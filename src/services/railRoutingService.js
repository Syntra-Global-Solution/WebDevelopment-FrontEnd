import { railLines, railStations, railTypeLabels } from '../data/railNetwork'
import { haversineMeters } from '../utils/routeScoring'
import { fetchWalkingRoutes } from './routingService'

const TRANSFER_SECONDS = 5 * 60
const DWELL_SECONDS = 35
const WALKING_SPEED_MPS = 1.3

const lineById = Object.fromEntries(railLines.map((line) => [line.id, line]))
const stationLines = railLines.reduce((index, line) => {
  line.stations.forEach((stationId) => {
    index[stationId] = [...(index[stationId] || []), line.id]
  })
  return index
}, {})

function stateKey(lineId, stationId) {
  return `${lineId}:${stationId}`
}

function addEdge(graph, from, edge) {
  graph.set(from, [...(graph.get(from) || []), edge])
}

function buildGraph() {
  const graph = new Map()
  railLines.forEach((line) => {
    line.stations.forEach((stationId) => graph.set(stateKey(line.id, stationId), []))
    for (let index = 0; index < line.stations.length - 1; index += 1) {
      const fromStation = line.stations[index]
      const toStation = line.stations[index + 1]
      const distance = haversineMeters(railStations[fromStation], railStations[toStation])
      const duration = distance / (line.speedKmh / 3.6) + DWELL_SECONDS
      const forward = { type: 'travel', lineId: line.id, fromStation, toStation, distance, duration, to: stateKey(line.id, toStation) }
      const backward = { ...forward, fromStation: toStation, toStation: fromStation, to: stateKey(line.id, fromStation) }
      addEdge(graph, stateKey(line.id, fromStation), forward)
      addEdge(graph, stateKey(line.id, toStation), backward)
    }
  })

  Object.entries(stationLines).forEach(([stationId, lineIds]) => {
    lineIds.forEach((fromLine) => {
      lineIds.filter((toLine) => toLine !== fromLine).forEach((toLine) => {
        addEdge(graph, stateKey(fromLine, stationId), {
          type: 'transfer',
          fromStation: stationId,
          toStation: stationId,
          fromLine,
          lineId: toLine,
          distance: 0,
          duration: TRANSFER_SECONDS,
          to: stateKey(toLine, stationId),
        })
      })
    })
  })
  return graph
}

const graph = buildGraph()

export function findNearestStations(place, limit = 4) {
  return Object.entries(railStations)
    .map(([id, station]) => ({ id, ...station, distance: haversineMeters(place, station) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(0, limit)
}

function reconstructPath(previous, endKey) {
  const edges = []
  const states = [endKey]
  let current = endKey
  while (previous.has(current)) {
    const item = previous.get(current)
    edges.push(item.edge)
    current = item.from
    states.push(current)
  }
  return { edges: edges.reverse(), states: states.reverse() }
}

export function calculateRailPath(originStationId, destinationStationId) {
  const startKeys = (stationLines[originStationId] || []).map((lineId) => stateKey(lineId, originStationId))
  const targetKeys = new Set((stationLines[destinationStationId] || []).map((lineId) => stateKey(lineId, destinationStationId)))
  if (!startKeys.length || !targetKeys.size || originStationId === destinationStationId) return null

  const distances = new Map([...graph.keys()].map((key) => [key, Number.POSITIVE_INFINITY]))
  const previous = new Map()
  const unvisited = new Set(graph.keys())
  startKeys.forEach((key) => distances.set(key, 0))
  let endKey = null

  while (unvisited.size) {
    let current = null
    let currentDistance = Number.POSITIVE_INFINITY
    unvisited.forEach((key) => {
      const distance = distances.get(key)
      if (distance < currentDistance) {
        current = key
        currentDistance = distance
      }
    })
    if (!current || !Number.isFinite(currentDistance)) break
    if (targetKeys.has(current)) {
      endKey = current
      break
    }
    unvisited.delete(current)
    const adjacentEdges = graph.get(current) || []
    adjacentEdges.forEach((edge) => {
      if (!unvisited.has(edge.to)) return
      const candidate = currentDistance + edge.duration
      if (candidate < distances.get(edge.to)) {
        distances.set(edge.to, candidate)
        previous.set(edge.to, { from: current, edge })
      }
    })
  }
  if (!endKey) return null

  const { edges, states } = reconstructPath(previous, endKey)
  const travelEdges = edges.filter((edge) => edge.type === 'travel')
  if (!travelEdges.length) return null
  const legs = []
  travelEdges.forEach((edge) => {
    const currentLeg = legs.at(-1)
    if (!currentLeg || currentLeg.lineId !== edge.lineId) {
      legs.push({
        lineId: edge.lineId,
        fromStation: edge.fromStation,
        toStation: edge.toStation,
        stationIds: [edge.fromStation, edge.toStation],
        distance: edge.distance,
        duration: edge.duration,
      })
      return
    }
    currentLeg.toStation = edge.toStation
    currentLeg.stationIds.push(edge.toStation)
    currentLeg.distance += edge.distance
    currentLeg.duration += edge.duration
  })

  return {
    states,
    edges,
    legs,
    duration: edges.reduce((total, edge) => total + edge.duration, 0),
    distance: travelEdges.reduce((total, edge) => total + edge.distance, 0),
    transfers: edges.filter((edge) => edge.type === 'transfer').length,
  }
}

function directShortWalk(from, to) {
  const distance = haversineMeters(from, to)
  return {
    mode: 'walking',
    duration: distance / WALKING_SPEED_MPS,
    distance,
    geometry: { type: 'LineString', coordinates: [[from.longitude, from.latitude], [to.longitude, to.latitude]] },
  }
}

async function walkingSegment(from, to, signal) {
  if (haversineMeters(from, to) < 55) return directShortWalk(from, to)
  const routes = await fetchWalkingRoutes(from, to, signal)
  return routes[0]
}

function appendCoordinates(target, coordinates) {
  coordinates.forEach((coordinate) => {
    const previous = target.at(-1)
    if (!previous || previous[0] !== coordinate[0] || previous[1] !== coordinate[1]) target.push(coordinate)
  })
}

function buildJourney(candidate, firstWalk, lastWalk, index) {
  const boarding = railStations[candidate.boarding.id]
  const alighting = railStations[candidate.alighting.id]
  const segments = [{ mode: 'walking', label: `Caminhada até ${boarding.name}`, color: '#778D7A', geometry: firstWalk.geometry }]
  const steps = [{ instruction: `Caminhe até a estação ${boarding.name}`, distance: firstWalk.distance, mode: 'walking' }]

  candidate.path.legs.forEach((leg, legIndex) => {
    const line = lineById[leg.lineId]
    const from = railStations[leg.fromStation]
    const to = railStations[leg.toStation]
    const coordinates = leg.stationIds.map((stationId) => {
      const station = railStations[stationId]
      return [station.longitude, station.latitude]
    })
    segments.push({ mode: line.type, lineId: line.id, label: line.name, color: line.color, geometry: { type: 'LineString', coordinates } })
    if (legIndex > 0) steps.push({ instruction: `Faça a baldeação em ${from.name} para a ${line.name}`, distance: 0, mode: 'transfer' })
    else steps.push({ instruction: `Embarque na ${line.name} em ${from.name}`, distance: 0, mode: line.type })
    steps.push({ instruction: `Siga pela ${line.name} até ${to.name}`, distance: leg.distance, mode: line.type })
  })

  segments.push({ mode: 'walking', label: `Caminhada a partir de ${alighting.name}`, color: '#778D7A', geometry: lastWalk.geometry })
  steps.push({ instruction: `Desembarque em ${alighting.name} e caminhe até o destino`, distance: lastWalk.distance, mode: 'walking' })
  const coordinates = []
  segments.forEach((segment) => appendCoordinates(coordinates, segment.geometry.coordinates))
  const lines = candidate.path.legs.map((leg) => lineById[leg.lineId]).filter((line, position, all) => all.findIndex((item) => item.id === line.id) === position)

  return {
    id: `rail-${index + 1}`,
    mode: 'rail',
    duration: firstWalk.duration + candidate.path.duration + lastWalk.duration,
    distance: firstWalk.distance + candidate.path.distance + lastWalk.distance,
    walkingDistance: firstWalk.distance + lastWalk.distance,
    railDistance: candidate.path.distance,
    transfers: candidate.path.transfers,
    boardingStation: boarding.name,
    alightingStation: alighting.name,
    lines,
    modes: [...new Set(lines.map((line) => railTypeLabels[line.type]))],
    segments,
    geometry: { type: 'LineString', coordinates },
    steps,
  }
}

export async function planRailJourneys(origin, destination, signal) {
  const origins = findNearestStations(origin, 4)
  const destinations = findNearestStations(destination, 4)
  const candidates = []
  origins.forEach((boarding) => {
    destinations.forEach((alighting) => {
      const path = calculateRailPath(boarding.id, alighting.id)
      if (!path) return
      candidates.push({
        boarding,
        alighting,
        path,
        estimate: boarding.distance / WALKING_SPEED_MPS + path.duration + alighting.distance / WALKING_SPEED_MPS,
      })
    })
  })

  const unique = []
  candidates.sort((a, b) => a.estimate - b.estimate).forEach((candidate) => {
    const signature = `${candidate.boarding.id}:${candidate.alighting.id}:${candidate.path.legs.map((leg) => leg.lineId).join('-')}`
    if (!unique.some((item) => item.signature === signature)) unique.push({ ...candidate, signature })
  })
  const selected = unique.slice(0, 3)
  if (!selected.length) throw new Error('Não encontramos uma combinação ferroviária para esses locais.')

  const journeys = []
  for (let index = 0; index < selected.length; index += 1) {
    const candidate = selected[index]
    try {
      const firstWalk = await walkingSegment(origin, railStations[candidate.boarding.id], signal)
      const lastWalk = await walkingSegment(railStations[candidate.alighting.id], destination, signal)
      journeys.push(buildJourney(candidate, firstWalk, lastWalk, journeys.length))
    } catch (walkingError) {
      if (walkingError.name === 'AbortError') throw walkingError
    }
  }
  if (!journeys.length) throw new Error('Não foi possível calcular os acessos a pé até a rede ferroviária. Tente novamente.')
  return journeys
}
