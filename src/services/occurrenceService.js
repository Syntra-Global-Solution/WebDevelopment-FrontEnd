import { supabase } from '../lib/supabase'

const columns = 'id,user_id,subject_type,transport_type,line,direction,station,address,category,description,latitude,longitude,source_type,created_at,updated_at'
const writableColumns = [
  'subject_type',
  'transport_type',
  'line',
  'direction',
  'station',
  'address',
  'category',
  'description',
  'latitude',
  'longitude',
]

function requireClient() {
  if (!supabase) throw new Error('Configure o Supabase para usar esta função.')
  return supabase
}

function writablePayload(values) {
  return Object.fromEntries(
    writableColumns
      .filter((column) => Object.hasOwn(values, column))
      .map((column) => [column, values[column]]),
  )
}

export async function listOccurrences() {
  const client = requireClient()
  const { data, error } = await client.from('occurrences').select(columns).order('created_at', { ascending: false })
  if (error) throw new Error('Não foi possível carregar os relatos.')
  return data || []
}

export async function createOccurrence(values, userId) {
  const client = requireClient()
  if (!userId) throw new Error('Entre novamente para registrar o relato.')
  const payload = { ...writablePayload(values), user_id: userId, source_type: 'user' }
  const { data, error } = await client.from('occurrences').insert(payload).select(columns).single()
  if (error) throw new Error('Não foi possível registrar o relato. Revise os dados e tente novamente.')
  return data
}

export async function updateOccurrence(id, values) {
  const client = requireClient()
  const safeValues = writablePayload(values)
  const { data, error } = await client
    .from('occurrences')
    .update(safeValues)
    .eq('id', id)
    .select(columns)
    .single()
  if (error) throw new Error('Não foi possível atualizar o relato. Verifique sua sessão.')
  return data
}

export async function deleteOccurrence(id) {
  const client = requireClient()
  const { data, error } = await client.from('occurrences').delete().eq('id', id).select('id').maybeSingle()
  if (error) throw new Error('Não foi possível excluir o relato. Verifique sua sessão.')
  if (!data) throw new Error('O relato não foi encontrado ou você não tem permissão para excluí-lo.')
}
