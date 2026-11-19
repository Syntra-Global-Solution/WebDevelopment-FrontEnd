import { supabase } from '../lib/supabase'

const columns = 'id,user_id,subject_type,transport_type,line,direction,station,address,category,description,latitude,longitude,source_type,created_at,updated_at'

function requireClient() {
  if (!supabase) throw new Error('Configure o Supabase para usar esta função.')
  return supabase
}

export async function listOccurrences() {
  const client = requireClient()
  const { data, error } = await client.from('occurrences').select(columns).order('created_at', { ascending: false })
  if (error) throw new Error('Não foi possível carregar os relatos.')
  return data || []
}

export async function createOccurrence(values, userId) {
  const client = requireClient()
  const payload = { ...values, user_id: userId, source_type: 'user' }
  const { data, error } = await client.from('occurrences').insert(payload).select(columns).single()
  if (error) throw new Error('Não foi possível registrar o relato. Revise os dados e tente novamente.')
  return data
}

export async function updateOccurrence(id, values) {
  const client = requireClient()
  const safeValues = { ...values }
  delete safeValues.user_id
  delete safeValues.id
  delete safeValues.created_at
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
  const { error } = await client.from('occurrences').delete().eq('id', id)
  if (error) throw new Error('Não foi possível excluir o relato. Verifique sua sessão.')
}
