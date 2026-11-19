function toRadians(value) {
  return (value * Math.PI) / 180
}

export function haversineMeters(a, b) {
  const earthRadius = 6371000
  const dLat = toRadians(b.latitude - a.latitude)
  const dLon = toRadians(b.longitude - a.longitude)
  const lat1 = toRadians(a.latitude)
  const lat2 = toRadians(b.latitude)
  const value =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2
  return 2 * earthRadius * Math.asin(Math.sqrt(value))
}

function nearbyOccurrenceCount(route, occurrences) {
  const coordinates = route.geometry?.coordinates || []
  if (!coordinates.length) return 0
  const sampled = coordinates.filter((_, index) => index % Math.max(1, Math.floor(coordinates.length / 35)) === 0)
  return occurrences.filter((occurrence) => {
    if (!Number.isFinite(Number(occurrence.latitude)) || !Number.isFinite(Number(occurrence.longitude))) return false
    const point = { latitude: Number(occurrence.latitude), longitude: Number(occurrence.longitude) }
    return sampled.some(([longitude, latitude]) => haversineMeters(point, { latitude, longitude }) <= 300)
  }).length
}

export function rankRoutes(routes, preferences, occurrences = []) {
  if (!routes.length) return []
  const minDuration = Math.min(...routes.map((route) => route.duration))
  const minWalkingDistance = Math.min(...routes.map((route) => route.walkingDistance ?? route.distance))
  const minTransfers = Math.min(...routes.map((route) => route.transfers ?? 0))

  const ranked = routes.map((route, index) => {
    const nearbyOccurrences = nearbyOccurrenceCount(route, occurrences)
    const durationWeight = preferences.shorterTime ? 1.7 : 1
    const distanceWeight = preferences.walkLess ? 1.6 : preferences.walkMore ? 0.45 : 1
    const occurrencePenalty = preferences.avoidOccurrences ? nearbyOccurrences * 900 : nearbyOccurrences * 120
    const walkingDistance = route.walkingDistance ?? route.distance
    const transferPenalty = (route.transfers ?? 0) * (preferences.fewerTransfers ? 900 : 300)
    const score = route.duration * durationWeight + walkingDistance * distanceWeight + occurrencePenalty + transferPenalty
    const badges = []
    if (routes.length > 1 && route.duration === minDuration) badges.push('Mais rápida')
    if (routes.length > 1 && walkingDistance === minWalkingDistance) badges.push('Menos caminhada')
    if (routes.length > 1 && (route.transfers ?? 0) === minTransfers) badges.push('Menos baldeações')
    return {
      ...route,
      id: route.id || `route-${index + 1}`,
      nearbyOccurrences,
      score,
      badges,
    }
  })

  ranked.sort((a, b) => a.score - b.score)
  if (Object.values(preferences).some(Boolean) && ranked.length > 1) {
    ranked[0].badges = [...ranked[0].badges, 'Melhor para suas preferências']
  }
  return ranked
}
