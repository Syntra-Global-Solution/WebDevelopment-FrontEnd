const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin({ email, password }) {
  const errors = {}
  if (!email?.trim()) errors.email = 'Informe o e-mail.'
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Informe um e-mail válido.'
  if (!password) errors.password = 'Informe a senha.'
  return errors
}

export function validateOccurrence(values) {
  const errors = {}
  if (!values.subject_type) errors.subject_type = 'Escolha o tipo de ocorrência.'
  if (!values.category) errors.category = 'Escolha uma categoria.'

  if (values.subject_type === 'infrastructure' && !values.address?.trim()) {
    errors.address = 'Informe o endereço da ocorrência.'
  }
  if (values.subject_type === 'station' && !values.station?.trim()) {
    errors.station = 'Informe a estação.'
  }
  if (values.subject_type === 'transport' && !values.line?.trim()) {
    errors.line = 'Informe a linha.'
  }
  if (values.description?.length > 500) errors.description = 'Use no máximo 500 caracteres.'
  return errors
}

export function hasErrors(errors) {
  return Object.keys(errors).length > 0
}
