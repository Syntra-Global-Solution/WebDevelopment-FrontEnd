import { transportLines } from '../data/transportData.js'

const CROWD_LEVELS = [
  { key: 'low', label: 'Baixo' },
  { key: 'moderate', label: 'Moderado' },
  { key: 'high', label: 'Alto' },
  { key: 'full', label: 'Lotado' },
]

const HEADWAY_BY_TYPE = {
  metro: 5,
  monorail: 7,
  train: 9,
}

function stableHash(value) {
  return [...value].reduce((hash, character) => ((hash * 31) + character.charCodeAt(0)) >>> 0, 0)
}

function crowdLevel(line, stationIndex, arrival, trainIndex) {
  const minutes = arrival.getHours() * 60 + arrival.getMinutes()
  const peak = (minutes >= 390 && minutes <= 570) || (minutes >= 990 && minutes <= 1200)
  const centralStation = stationIndex > line.stops.length * 0.25 && stationIndex < line.stops.length * 0.75
  const variation = stableHash(`${line.id}-${stationIndex}-${arrival.getDay()}-${trainIndex}`) % 2
  const levelIndex = Math.min((peak ? 2 : 0) + (centralStation ? 1 : 0) + variation, CROWD_LEVELS.length - 1)
  return CROWD_LEVELS[levelIndex]
}

function formatArrival(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export async function searchTransport({ type, query, direction }) {
  await new Promise((resolve) => setTimeout(resolve, 350))
  const normalized = query.trim().toLocaleLowerCase('pt-BR')
  return transportLines.filter((line) => {
    const matchesType = !type || line.type === type
    const matchesQuery = !normalized || `${line.code} ${line.name} ${line.stops.join(' ')}`.toLocaleLowerCase('pt-BR').includes(normalized)
    const matchesDirection = !direction || line.directions.includes(direction)
    return matchesType && matchesQuery && matchesDirection
  })
}

export async function getTrainPredictions(line, station, now = new Date()) {
  await new Promise((resolve) => setTimeout(resolve, 250))

  if (!line?.id || !Array.isArray(line.stops) || !line.stops.length) {
    throw new Error('Linha sem dados suficientes para calcular previsões.')
  }

  const stationIndex = line.stops.indexOf(station)
  if (stationIndex < 0) {
    throw new Error('Estação não encontrada nesta linha.')
  }

  const referenceTime = now instanceof Date ? now : new Date(now)
  if (Number.isNaN(referenceTime.getTime())) {
    throw new Error('Horário de referência inválido.')
  }

  const headwayMinutes = HEADWAY_BY_TYPE[line.type] || 8
  const headwayMs = headwayMinutes * 60 * 1000
  const dayStart = new Date(referenceTime)
  dayStart.setHours(0, 0, 0, 0)

  const stationOffsetMinutes = (stationIndex * 2) + (stableHash(`${line.id}-${station}`) % headwayMinutes)
  const firstService = new Date(dayStart.getTime() + (4 * 60 + stationOffsetMinutes) * 60 * 1000)
  const elapsed = referenceTime.getTime() - firstService.getTime()
  const cycles = Math.max(0, Math.floor(elapsed / headwayMs) + 1)
  const firstArrival = new Date(firstService.getTime() + cycles * headwayMs)

  return [0, 1].map((trainIndex) => {
    const arrival = new Date(firstArrival.getTime() + trainIndex * headwayMs)
    const secondsUntilArrival = Math.max(0, Math.ceil((arrival.getTime() - referenceTime.getTime()) / 1000))

    return {
      id: `${line.id}-${stationIndex}-${arrival.getTime()}`,
      minutesUntilArrival: Math.max(1, Math.ceil(secondsUntilArrival / 60)),
      arrivalTime: formatArrival(arrival),
      crowding: crowdLevel(line, stationIndex, arrival, trainIndex),
    }
  })
}
