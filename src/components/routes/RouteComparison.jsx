import { formatDistance, formatDuration } from '../../utils/formatters'

export function RouteComparison({ routes }) {
  if (routes.length < 2) return null
  return (
    <section className="rounded-xl border border-slate/25 bg-white p-4" aria-labelledby="comparison-title">
      <h2 className="font-semibold text-navy" id="comparison-title">Comparação</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-72 text-left text-sm">
          <thead>
            <tr className="border-b border-beige text-xs text-slate">
              <th className="pb-2 font-medium">Critério</th>
              {routes.map((route, index) => <th className="pb-2 font-semibold text-navy" key={route.id}>Rota {index + 1}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-beige/70 text-navy">
            <tr><th className="py-2 font-medium">Tempo</th>{routes.map((route) => <td key={route.id}>{formatDuration(route.duration)}</td>)}</tr>
            <tr><th className="py-2 font-medium">Caminhada</th>{routes.map((route) => <td key={route.id}>{formatDistance(route.walkingDistance)}</td>)}</tr>
            <tr><th className="py-2 font-medium">Baldeações</th>{routes.map((route) => <td key={route.id}>{route.transfers}</td>)}</tr>
            <tr><th className="py-2 font-medium">Linhas</th>{routes.map((route) => <td key={route.id}>{route.lines.map((line) => line.shortName).join(', ')}</td>)}</tr>
            <tr><th className="py-2 font-medium">Relatos próximos</th>{routes.map((route) => <td key={route.id}>{route.nearbyOccurrences}</td>)}</tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
