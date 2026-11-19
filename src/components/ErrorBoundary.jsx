import { Component } from 'react'
import { AlertTriangle } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="grid min-h-screen place-items-center bg-navy p-6">
          <section className="max-w-sm rounded-xl bg-cream p-6 text-center">
            <AlertTriangle className="mx-auto mb-3 size-8 text-wine" aria-hidden="true" />
            <h1 className="text-xl font-bold text-navy">A Syntra encontrou um problema</h1>
            <p className="mt-2 text-sm text-slate">Atualize a página para tentar novamente. Seus relatos salvos no Supabase não serão perdidos.</p>
            <button className="mt-5 min-h-11 rounded-lg bg-navy px-4 font-semibold text-cream" onClick={() => window.location.reload()}>
              Atualizar página
            </button>
          </section>
        </main>
      )
    }
    return this.props.children
  }
}
