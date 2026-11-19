const baseUrl = import.meta.env.VITE_ROUTING_URL || 'https://routing.openstreetmap.de/routed-foot'
let lastRequestAt = 0

async function respectRateLimit() {
  const elapsed = Date.now() - lastRequestAt
  if (elapsed < 1050) await new Promise((resolve) => setTimeout(resolve, 1050 - elapsed))
  lastRequestAt = Date.now()
}

export async function fetchWalkingRoutes(origin, destination, signal) {
  await respectRateLimit()
  const coordinates = `${origin.longitude},${origin.latitude};${destination.longitude},${destination.latitude}`
  const params = new URLSearchParams({
    alternatives: '3',
    steps: 'true',
    geometries: 'geojson',
    overview: 'full',
  })
  const response = await fetch(`${baseUrl}/route/v1/driving/${coordinates}?${params}`, {
    signal,
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) throw new Error('O serviço de rotas está indisponível. Tente novamente.')
  const data = await response.json()
  if (data.code !== 'Ok' || !data.routes?.length) {
    throw new Error('Não foi possível calcular um trajeto a pé entre esses locais.')
  }
  return data.routes.map((route, index) => ({
    id: `walking-${index + 1}`,
    duration: route.duration,
    distance: route.distance,
    geometry: route.geometry,
    steps: route.legs?.flatMap((leg) => leg.steps || []) || [],
    mode: 'walking',
    transfers: 0,
  }))
}
