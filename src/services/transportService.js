import { transportLines } from '../data/transportData'

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
