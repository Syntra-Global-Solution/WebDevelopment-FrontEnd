export function ProjectIntro() {
  return (
    <section className="w-full max-w-3xl px-5 pt-8 text-center sm:px-6 sm:pt-0" aria-labelledby="project-intro-title">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-beige">
        Protótipo interativo <span className="mx-1.5 text-sage" aria-hidden="true">|</span> Global Solution 2026
      </p>
      <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-[-0.025em] text-cream sm:text-4xl" id="project-intro-title">
        SYntra - Sua cidade em movimento, tudo em sintonia.
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-cream/75 sm:text-base">
        Um novo jeito de viver a mobilidade urbana. Informação em tempo real, trajetos inteligentes, acessibilidade e segurança conectados em uma única experiência, pensada para quem move a cidade todos os dias.
      </p>
      <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-sage to-transparent" aria-hidden="true" />
    </section>
  )
}
