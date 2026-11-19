import { ArrowDownUp, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useGeolocation } from '../hooks/useGeolocation'
import { useJourney } from '../hooks/useJourney'
import { useOccurrenceContext } from '../hooks/useOccurrenceContext'
import { reverseGeocode } from '../services/geocodingService'
import { ActiveJourney } from '../components/routes/ActiveJourney'
import { LocationInput } from '../components/routes/LocationInput'
import { MobilityPreferences } from '../components/routes/MobilityPreferences'
import { RouteCard } from '../components/routes/RouteCard'
import { RouteComparison } from '../components/routes/RouteComparison'
import { MapCanvas } from '../components/map/MapCanvas'
import { Button } from '../components/ui/Button'
import { LoadingState } from '../components/ui/LoadingState'
import { StatusMessage } from '../components/ui/StatusMessage'

export function TrajetosPage() {
  const journey = useJourney()
  const setCurrentOrigin = journey.setCurrentOrigin
  const { occurrences } = useOccurrenceContext()
  const { coordinates, loading: locating, error: locationError, requestLocation } = useGeolocation()
  const [locationStatus, setLocationStatus] = useState('')
  const [preferencesOpen, setPreferencesOpen] = useState(false)

  useEffect(() => {
    if (!coordinates) return
    let active = true
    reverseGeocode(coordinates.latitude, coordinates.longitude)
      .then((place) => {
        if (!active) return
        setCurrentOrigin(place)
        setLocationStatus('Localização atual definida como origem.')
      })
      .catch(() => {
        if (!active) return
        setCurrentOrigin({ ...coordinates, label: 'Minha localização' })
        setLocationStatus('Localização atual definida como origem.')
      })
    return () => { active = false }
  }, [coordinates, setCurrentOrigin])

  const comparisonRoutes = journey.routes.filter((route) => journey.comparisonIds.includes(route.id))

  function searchRoutes() {
    setPreferencesOpen(false)
    journey.searchRoutes()
  }

  return (
    <div className="page-section space-y-5">
      <header>
        <p className="eyebrow">Planeje seu deslocamento</p>
        <h1 className="page-title">Para onde você vai?</h1>
        <p className="page-description">Combine metrô, trem e monotrilho com caminhadas de acesso calculadas.</p>
      </header>

      <section className="space-y-3 rounded-xl border border-slate/25 bg-white p-4" aria-label="Origem e destino">
        <LocationInput
          id="route-origin"
          label="Origem"
          value={journey.origin.text}
          onChange={journey.setOriginText}
          placeholder="Endereço, estação ou local"
          onUseCurrent={() => {
            setLocationStatus('Solicitando sua localização…')
            requestLocation()
          }}
          locating={locating}
        />
        <div className="flex justify-center -my-1">
          <Button type="button" variant="ghost" size="icon" onClick={journey.swapLocations} aria-label="Inverter origem e destino" title="Inverter origem e destino">
            <ArrowDownUp className="size-5" aria-hidden="true" />
          </Button>
        </div>
        <LocationInput
          id="route-destination"
          label="Destino"
          value={journey.destination.text}
          onChange={journey.setDestinationText}
          placeholder="Para onde você vai?"
        />
        {locationError ? <StatusMessage tone="warning">{locationError}</StatusMessage> : null}
        {locationStatus ? <p className="text-xs text-slate" role="status">{locationStatus}</p> : null}
        <Button type="button" className="w-full" onClick={searchRoutes} disabled={journey.loading}>
          <Search className="size-4" aria-hidden="true" /> {journey.loading ? 'Buscando trajetos…' : 'Buscar trajetos'}
        </Button>
      </section>

      <MobilityPreferences preferences={journey.preferences} onToggle={journey.togglePreference} open={preferencesOpen} onOpenChange={setPreferencesOpen} />

      <MapCanvas
        route={journey.selectedRoute}
        origin={journey.origin.place}
        destination={journey.destination.place}
        occurrences={journey.selectedRoute ? occurrences : []}
        className="h-64"
        label="Mapa do trajeto"
      />
      <p className="-mt-3 text-[11px] leading-relaxed text-slate">Mapa © OpenStreetMap. Caminhadas via FOSSGIS/OSRM. Rede ferroviária local baseada nas operadoras e no OpenStreetMap.</p>

      {journey.error ? <StatusMessage tone="error">{journey.error} <button type="button" className="ml-1 underline" onClick={searchRoutes}>Tentar novamente</button></StatusMessage> : null}
      {journey.loading ? <LoadingState label="Calculando o caminho pela malha de ruas…" /> : null}

      {journey.routes.length ? (
        <section className="space-y-3" aria-labelledby="routes-title">
          <div>
            <h2 className="section-title" id="routes-title">Trajetos encontrados</h2>
            <p className="text-sm text-slate">{journey.routes.length === 1 ? 'A fonte retornou uma rota.' : `${journey.routes.length} alternativas retornadas pela fonte.`}</p>
          </div>
          {journey.routes.map((route) => (
            <RouteCard
              key={route.id}
              route={route}
              selected={journey.selectedRoute?.id === route.id}
              comparing={journey.comparisonIds.includes(route.id)}
              onSelect={() => journey.selectRoute(route.id)}
              onCompare={() => journey.toggleComparison(route.id)}
              onStart={() => {
                journey.selectRoute(route.id)
                journey.startRoute(route.id)
              }}
            />
          ))}
        </section>
      ) : null}

      <RouteComparison routes={comparisonRoutes} />

      {journey.activeRoute ? (
        <ActiveJourney
          route={journey.activeRoute}
          origin={journey.origin.place}
          destination={journey.destination.place}
          onStop={journey.stopRoute}
        />
      ) : null}
    </div>
  )
}
