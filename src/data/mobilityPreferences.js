export const preferenceGroups = [
  {
    id: 'accessibility',
    label: 'Acessibilidade',
    items: [
      { id: 'wheelchair', label: 'Acessível para cadeira de rodas', supported: false },
      { id: 'stroller', label: 'Estou com carrinho de bebê', supported: false },
      { id: 'sidewalks', label: 'Priorizar calçadas adequadas', supported: false },
      { id: 'avoidHills', label: 'Evitar subidas', supported: false },
    ],
  },
  {
    id: 'walking',
    label: 'Caminhada',
    items: [
      { id: 'walkLess', label: 'Prefiro caminhar menos', supported: true, exclusiveWith: 'walkMore' },
      { id: 'walkMore', label: 'Posso caminhar mais', supported: true, exclusiveWith: 'walkLess' },
    ],
  },
  {
    id: 'safety',
    label: 'Segurança',
    items: [
      { id: 'lighting', label: 'Priorizar ruas iluminadas', supported: false },
      { id: 'safety', label: 'Priorizar segurança', supported: false },
      { id: 'avoidOccurrences', label: 'Evitar locais com ocorrências', supported: true },
    ],
  },
  {
    id: 'comfort',
    label: 'Conforto e tempo',
    items: [
      { id: 'comfort', label: 'Priorizar conforto', supported: false },
      { id: 'shorterTime', label: 'Priorizar menor tempo', supported: true },
      { id: 'fewerTransfers', label: 'Priorizar menos baldeações', supported: true },
    ],
  },
]

export const initialPreferences = Object.fromEntries(
  preferenceGroups.flatMap((group) => group.items.map((item) => [item.id, false])),
)
