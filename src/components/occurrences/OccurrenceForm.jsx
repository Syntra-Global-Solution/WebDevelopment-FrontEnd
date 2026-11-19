import { LocateFixed } from 'lucide-react'
import { useEffect, useState } from 'react'
import { categoryOptions } from '../../data/demoOccurrences'
import { knownPlaces } from '../../data/knownPlaces'
import { useAuth } from '../../hooks/useAuth'
import { useGeolocation } from '../../hooks/useGeolocation'
import { geocodePlace, reverseGeocode } from '../../services/geocodingService'
import { hasErrors, validateOccurrence } from '../../utils/validators'
import { Button } from '../ui/Button'
import { FormField, inputClass } from '../ui/FormField'
import { StatusMessage } from '../ui/StatusMessage'

const emptyValues = {
  subject_type: '',
  transport_type: '',
  line: '',
  direction: '',
  station: '',
  address: '',
  category: '',
  description: '',
  latitude: null,
  longitude: null,
}

const subjectTypes = [
  { value: 'station', label: 'Estação' },
  { value: 'transport', label: 'Transporte' },
  { value: 'infrastructure', label: 'Rua ou infraestrutura' },
]

export function OccurrenceForm({ initialValues, onSave, onCancel, saving }) {
  const { user, openLogin } = useAuth()
  const [values, setValues] = useState(() => ({ ...emptyValues, ...initialValues }))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState(null)
  const { coordinates, loading: locating, error: locationError, requestLocation } = useGeolocation()
  const isEditing = Boolean(initialValues?.id)
  const availableCategories = categoryOptions.filter((option) => (
    values.subject_type === 'infrastructure'
      ? option.group === 'infrastructure' || option.value === 'accessibility'
      : option.group !== 'infrastructure'
  ))

  useEffect(() => {
    if (!coordinates) return
    let active = true
    reverseGeocode(coordinates.latitude, coordinates.longitude)
      .then((place) => {
        if (!active) return
        setValues((current) => ({ ...current, address: place.label, latitude: place.latitude, longitude: place.longitude }))
        setStatus({ tone: 'success', message: 'Localização adicionada ao relato.' })
      })
      .catch(() => {
        if (!active) return
        setValues((current) => ({ ...current, address: 'Localização atual', latitude: coordinates.latitude, longitude: coordinates.longitude }))
      })
    return () => { active = false }
  }, [coordinates])

  function update(key, value) {
    setValues((current) => {
      if (key !== 'subject_type') return { ...current, [key]: value }
      const allowedCategories = categoryOptions.filter((option) => (
        value === 'infrastructure'
          ? option.group === 'infrastructure' || option.value === 'accessibility'
          : option.group !== 'infrastructure'
      ))
      return {
        ...current,
        subject_type: value,
        category: allowedCategories.some((option) => option.value === current.category) ? current.category : '',
        ...(value === 'infrastructure'
          ? { transport_type: '', line: '', direction: '', station: '' }
          : { address: value === 'station' ? current.address : '' }),
      }
    })
    setErrors((current) => ({ ...current, [key]: undefined }))
  }

  async function resolveCoordinates(nextValues) {
    if (Number.isFinite(Number(nextValues.latitude)) && Number.isFinite(Number(nextValues.longitude))) return nextValues
    const known = knownPlaces[nextValues.station]
    if (known) return { ...nextValues, latitude: known.latitude, longitude: known.longitude, address: nextValues.address || known.label }
    const query = nextValues.address || nextValues.station
    if (!query) return nextValues
    try {
      const place = await geocodePlace(query)
      return { ...nextValues, latitude: place.latitude, longitude: place.longitude, address: nextValues.address || place.label }
    } catch (geocodeError) {
      if (nextValues.subject_type === 'infrastructure') throw geocodeError
      return nextValues
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateOccurrence(values)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return
    if (!user) {
      setStatus({ tone: 'warning', message: 'Entre com o Supabase ou use o modo demonstração. Os dados preenchidos foram preservados.' })
      openLogin()
      return
    }

    setStatus({ tone: 'info', message: 'Validando a localização…' })
    try {
      const locatedValues = await resolveCoordinates(values)
      const payload = {
        subject_type: locatedValues.subject_type,
        transport_type: locatedValues.transport_type || null,
        line: locatedValues.line.trim() || null,
        direction: locatedValues.direction.trim() || null,
        station: locatedValues.station.trim() || null,
        address: locatedValues.address.trim() || null,
        category: locatedValues.category,
        description: locatedValues.description.trim() || null,
        latitude: Number.isFinite(Number(locatedValues.latitude)) ? Number(locatedValues.latitude) : null,
        longitude: Number.isFinite(Number(locatedValues.longitude)) ? Number(locatedValues.longitude) : null,
      }
      await onSave(payload)
      setStatus({ tone: 'success', message: isEditing ? 'Relato atualizado.' : 'Relato registrado.' })
      if (!isEditing) setValues(emptyValues)
    } catch (saveError) {
      setStatus({ tone: 'error', message: saveError.message })
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      <fieldset>
        <legend className="mb-2 text-sm font-semibold text-navy">Sobre o que deseja informar?</legend>
        <div className="grid gap-2">
          {subjectTypes.map((type) => (
            <button
              key={type.value}
              type="button"
              className={`min-h-11 rounded-lg border px-3 text-left text-sm font-semibold focus-visible:outline-2 focus-visible:outline-sage ${values.subject_type === type.value ? 'border-navy bg-navy text-cream' : 'border-slate/25 bg-white text-navy'}`}
              onClick={() => update('subject_type', type.value)}
              aria-pressed={values.subject_type === type.value}
            >
              {type.label}
            </button>
          ))}
        </div>
        {errors.subject_type ? <p className="mt-1 text-sm text-wine" role="alert">{errors.subject_type}</p> : null}
      </fieldset>

      {values.subject_type && values.subject_type !== 'infrastructure' ? (
        <FormField id="occurrence-transport" label="Tipo de transporte">
          <select id="occurrence-transport" className={inputClass} value={values.transport_type} onChange={(event) => update('transport_type', event.target.value)}>
            <option value="">Selecione, se aplicável</option>
            <option value="metro">Metrô</option>
            <option value="train">Trem</option>
            <option value="monorail">Monotrilho</option>
          </select>
        </FormField>
      ) : null}

      {values.subject_type === 'station' || values.subject_type === 'transport' ? (
        <FormField id="occurrence-line" label={values.subject_type === 'transport' ? 'Linha' : 'Linha, se aplicável'} error={errors.line}>
          <input id="occurrence-line" className={inputClass} value={values.line} onChange={(event) => update('line', event.target.value)} placeholder="Ex.: Linha 2 Verde" aria-describedby={errors.line ? 'occurrence-line-error' : undefined} aria-invalid={Boolean(errors.line)} />
        </FormField>
      ) : null}

      {values.subject_type === 'station' || values.subject_type === 'transport' ? (
        <FormField id="occurrence-station" label={values.subject_type === 'station' ? 'Estação' : 'Estação de referência'} error={errors.station}>
          <input id="occurrence-station" list="known-stations" className={inputClass} value={values.station} onChange={(event) => update('station', event.target.value)} placeholder="Ex.: Ana Rosa" aria-describedby={errors.station ? 'occurrence-station-error' : undefined} aria-invalid={Boolean(errors.station)} />
          <datalist id="known-stations">{Object.keys(knownPlaces).map((place) => <option key={place} value={place} />)}</datalist>
        </FormField>
      ) : null}

      {values.subject_type === 'transport' ? (
        <FormField id="occurrence-direction" label="Sentido, se aplicável" error={errors.direction}>
          <input id="occurrence-direction" className={inputClass} value={values.direction} onChange={(event) => update('direction', event.target.value)} placeholder="Ex.: Vila Madalena" aria-describedby={errors.direction ? 'occurrence-direction-error' : undefined} aria-invalid={Boolean(errors.direction)} />
        </FormField>
      ) : null}

      {values.subject_type === 'infrastructure' ? (
        <FormField id="occurrence-address" label="Endereço" error={errors.address} hint="O endereço será convertido em coordenadas ao enviar.">
          <input id="occurrence-address" className={inputClass} value={values.address} onChange={(event) => update('address', event.target.value)} placeholder="Rua, número e bairro" aria-describedby={errors.address ? 'occurrence-address-error' : undefined} aria-invalid={Boolean(errors.address)} />
        </FormField>
      ) : null}

      {values.subject_type ? (
        <Button type="button" variant="secondary" size="sm" onClick={requestLocation} disabled={locating}>
          <LocateFixed className="size-4" aria-hidden="true" /> {locating ? 'Obtendo localização…' : 'Usar minha localização'}
        </Button>
      ) : null}
      {locationError ? <StatusMessage tone="warning">{locationError}</StatusMessage> : null}

      {values.subject_type ? (
        <FormField id="occurrence-category" label="Categoria" error={errors.category}>
          <select id="occurrence-category" className={inputClass} value={values.category} onChange={(event) => update('category', event.target.value)} aria-describedby={errors.category ? 'occurrence-category-error' : undefined} aria-invalid={Boolean(errors.category)}>
            <option value="">Escolha uma categoria</option>
            {availableCategories.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </FormField>
      ) : null}

      {values.subject_type ? (
        <FormField id="occurrence-description" label="Descrição opcional" error={errors.description} hint={`${values.description.length}/500 caracteres`}>
          <textarea id="occurrence-description" className={`${inputClass} min-h-24 resize-y`} maxLength={500} value={values.description} onChange={(event) => update('description', event.target.value)} placeholder="Inclua apenas informações úteis, sem dados pessoais." aria-describedby={errors.description ? 'occurrence-description-error' : undefined} aria-invalid={Boolean(errors.description)} />
        </FormField>
      ) : null}

      {status ? <StatusMessage tone={status.tone}>{status.message}</StatusMessage> : null}
      {values.subject_type ? (
        <div className="flex gap-2">
          {onCancel ? <Button type="button" variant="secondary" className="flex-1" onClick={onCancel}>Cancelar</Button> : null}
          <Button type="submit" className="flex-1" disabled={saving}>{saving ? 'Salvando…' : isEditing ? 'Salvar alterações' : 'Registrar ocorrência'}</Button>
        </div>
      ) : null}
    </form>
  )
}
