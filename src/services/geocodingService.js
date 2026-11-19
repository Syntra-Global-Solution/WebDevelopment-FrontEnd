const baseUrl = import.meta.env.VITE_NOMINATIM_URL || 'https://nominatim.openstreetmap.org'
const cache = new Map()
let lastRequestAt = 0

async function respectRateLimit() {
  const elapsed = Date.now() - lastRequestAt
  if (elapsed < 1050) await new Promise((resolve) => setTimeout(resolve, 1050 - elapsed))
  lastRequestAt = Date.now()
}

async function getJson(url, signal) {
  await respectRateLimit()
  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/json', 'Accept-Language': 'pt-BR,pt;q=0.9' },
  })
  if (!response.ok) throw new Error('O serviço de localização não respondeu. Tente novamente.')
  return response.json()
}

export async function geocodePlace(query, signal) {
  const cleanQuery = query.trim()
  if (!cleanQuery) throw new Error('Informe um endereço ou local.')
  const key = `search:${cleanQuery.toLocaleLowerCase('pt-BR')}`
  if (cache.has(key)) return cache.get(key)

  const params = new URLSearchParams({
    q: cleanQuery,
    format: 'jsonv2',
    limit: '1',
    countrycodes: 'br',
    addressdetails: '1',
    viewbox: '-46.826,-23.356,-46.365,-24.008',
  })
  const results = await getJson(`${baseUrl}/search?${params}`, signal)
  if (!results.length) throw new Error(`Não encontramos “${cleanQuery}”. Revise o local informado.`)
  const place = {
    latitude: Number(results[0].lat),
    longitude: Number(results[0].lon),
    label: results[0].display_name,
  }
  cache.set(key, place)
  return place
}

export async function reverseGeocode(latitude, longitude, signal) {
  const key = `reverse:${latitude.toFixed(5)},${longitude.toFixed(5)}`
  if (cache.has(key)) return cache.get(key)
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    format: 'jsonv2',
    zoom: '18',
    addressdetails: '1',
  })
  const result = await getJson(`${baseUrl}/reverse?${params}`, signal)
  const place = {
    latitude,
    longitude,
    label: result.display_name || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`,
  }
  cache.set(key, place)
  return place
}
