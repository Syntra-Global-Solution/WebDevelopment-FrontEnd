import L from 'leaflet'
import { useEffect, useMemo } from 'react'
import { CircleMarker, MapContainer, Marker, Popup, Polyline, TileLayer, Tooltip, useMap } from 'react-leaflet'
import { categoryMeta } from '../../data/demoOccurrences'
import { formatDateTime, occurrenceLocation, sourceLabel } from '../../utils/formatters'

const tileUrl = import.meta.env.VITE_OSM_TILE_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const iconPaths = {
  accessibility: '<circle cx="12" cy="4" r="2"/><path d="m9 7 3 2 2 3h4"/><path d="m9 17-2 3"/><path d="m15 21-2-4-3-1V9"/><circle cx="8" cy="16" r="5"/>',
  delay: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  crowding: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/>',
  interruption: '<path d="M10.3 2.9 1.8 17a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 2.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  infrastructure: '<path d="m2 22 1-1h18l1 1"/><path d="M6 18 10 4h4l4 14"/><path d="M8 13h8"/>',
}

function markerKind(category) {
  if (category === 'accessibility') return 'accessibility'
  if (category === 'delay') return 'delay'
  if (category === 'crowding') return 'crowding'
  if (category === 'interruption') return 'interruption'
  return 'infrastructure'
}

function occurrenceIcon(category) {
  const kind = markerKind(category)
  const critical = ['interruption', 'sidewalk', 'obstacle'].includes(category)
  const background = critical ? '#4D0E13' : category === 'accessibility' ? '#415A77' : '#0D1B2A'
  return L.divIcon({
    className: 'syntra-map-marker',
    html: `<span style="background:${background}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${iconPaths[kind]}</svg></span>`,
    iconSize: [34, 40],
    iconAnchor: [17, 38],
    popupAnchor: [0, -35],
  })
}

function MapResizer({ boundsKey }) {
  const map = useMap()
  useEffect(() => {
    const frame = requestAnimationFrame(() => map.invalidateSize())
    const timer = setTimeout(() => map.invalidateSize(), 250)
    return () => {
      cancelAnimationFrame(frame)
      clearTimeout(timer)
    }
  }, [boundsKey, map])
  return null
}

function FitContent({ points, boundsKey }) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 1) map.setView(points[0], 15)
    if (points.length > 1) map.fitBounds(points, { padding: [26, 26], maxZoom: 16 })
  }, [boundsKey, map, points])
  return null
}

function OccurrenceMarker({ occurrence }) {
  const meta = categoryMeta[occurrence.category] || { label: 'Ocorrência' }
  const icon = useMemo(() => occurrenceIcon(occurrence.category), [occurrence.category])
  return (
    <Marker position={[Number(occurrence.latitude), Number(occurrence.longitude)]} icon={icon}>
      <Popup>
        <article className="min-w-48 text-navy">
          <p className="text-xs font-semibold text-slate">{sourceLabel(occurrence.source_type)}</p>
          <h3 className="mt-1 font-bold">{meta.label}</h3>
          <p className="mt-1 text-sm">{occurrenceLocation(occurrence)}</p>
          {occurrence.line ? <p className="text-sm">{occurrence.line}</p> : null}
          <p className="mt-2 text-sm leading-relaxed">{occurrence.description || 'Sem descrição adicional.'}</p>
          <p className="mt-2 text-xs text-slate">{formatDateTime(occurrence.created_at)}</p>
        </article>
      </Popup>
    </Marker>
  )
}

export function MapCanvas({
  route,
  origin,
  destination,
  occurrences = [],
  currentLocation,
  className = 'h-64',
  label = 'Mapa interativo',
}) {
  const routePoints = route?.geometry?.coordinates?.map(([longitude, latitude]) => [latitude, longitude]) || []
  const occurrencePoints = occurrences
    .filter((item) => Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude)))
    .map((item) => [Number(item.latitude), Number(item.longitude)])
  const points = [
    ...routePoints,
    ...(origin ? [[origin.latitude, origin.longitude]] : []),
    ...(destination ? [[destination.latitude, destination.longitude]] : []),
    ...(currentLocation ? [[currentLocation.latitude, currentLocation.longitude]] : []),
    ...(route ? [] : occurrencePoints),
  ]
  const boundsKey = points.map((point) => point.join(',')).join('|')
  const center = points[0] || [-23.55052, -46.63331]

  return (
    <div className={`map-shell overflow-hidden rounded-xl border border-slate/25 bg-beige/30 ${className}`} role="region" aria-label={label}>
      <MapContainer center={center} zoom={12} scrollWheelZoom className="h-full w-full">
        <TileLayer
          url={tileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <MapResizer boundsKey={boundsKey} />
        {points.length ? <FitContent points={points} boundsKey={boundsKey} /> : null}
        {route?.segments?.length
          ? route.segments.map((segment, index) => (
              <Polyline
                key={`${segment.mode}-${segment.lineId || 'walk'}-${index}`}
                positions={segment.geometry.coordinates.map(([longitude, latitude]) => [latitude, longitude])}
                pathOptions={{
                  color: segment.color || '#415A77',
                  weight: segment.mode === 'walking' ? 5 : 7,
                  opacity: 0.92,
                  dashArray: segment.mode === 'walking' ? '7 8' : undefined,
                }}
              >
                <Tooltip>{segment.label}</Tooltip>
              </Polyline>
            ))
          : routePoints.length
            ? <Polyline positions={routePoints} pathOptions={{ color: '#415A77', weight: 6, opacity: 0.9 }} />
            : null}
        {origin ? (
          <CircleMarker center={[origin.latitude, origin.longitude]} radius={8} pathOptions={{ color: '#0D1B2A', fillColor: '#F4F1DE', fillOpacity: 1, weight: 4 }}>
            <Tooltip permanent direction="center" className="point-tooltip">O</Tooltip>
          </CircleMarker>
        ) : null}
        {destination ? (
          <CircleMarker center={[destination.latitude, destination.longitude]} radius={8} pathOptions={{ color: '#4D0E13', fillColor: '#F4F1DE', fillOpacity: 1, weight: 4 }}>
            <Tooltip permanent direction="center" className="point-tooltip">D</Tooltip>
          </CircleMarker>
        ) : null}
        {currentLocation ? (
          <CircleMarker center={[currentLocation.latitude, currentLocation.longitude]} radius={9} pathOptions={{ color: '#F4F1DE', fillColor: '#415A77', fillOpacity: 1, weight: 3 }}>
            <Tooltip>Você está aqui</Tooltip>
          </CircleMarker>
        ) : null}
        {occurrences
          .filter((item) => Number.isFinite(Number(item.latitude)) && Number.isFinite(Number(item.longitude)))
          .map((occurrence) => <OccurrenceMarker key={occurrence.id} occurrence={occurrence} />)}
      </MapContainer>
    </div>
  )
}
