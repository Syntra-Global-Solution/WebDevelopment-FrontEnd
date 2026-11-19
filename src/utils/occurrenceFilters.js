export function filterOccurrences(occurrences, group, source) {
  const now = Date.now()
  return occurrences.filter((occurrence) => {
    const matchesSource = source === 'all' || occurrence.source_type === source
    let matchesGroup = group === 'all'
    if (group === 'recent') {
      const createdAt = new Date(occurrence.created_at).getTime()
      matchesGroup = Number.isFinite(createdAt) && now - createdAt <= 24 * 60 * 60 * 1000
    } else if (group !== 'all') {
      const categoryGroup = occurrence.category === 'accessibility'
        ? 'accessibility'
        : ['sidewalk', 'lighting', 'obstacle'].includes(occurrence.category)
          ? 'infrastructure'
          : 'transport'
      matchesGroup = categoryGroup === group
    }
    return matchesSource && matchesGroup
  })
}
