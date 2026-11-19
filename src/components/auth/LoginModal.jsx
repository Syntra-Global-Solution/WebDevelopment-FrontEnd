import { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { hasErrors, validateLogin } from '../../utils/validators'
import { Button } from '../ui/Button'
import { FormField, inputClass } from '../ui/FormField'
import { Modal } from '../ui/Modal'
import { StatusMessage } from '../ui/StatusMessage'

export function LoginModal() {
  const { isLoginOpen, closeLogin, signIn, signInDemo, error: authError, isConfigured } = useAuth()
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateLogin(values)
    setErrors(nextErrors)
    if (hasErrors(nextErrors)) return
    setLoading(true)
    try {
      await signIn(values.email.trim(), values.password)
      setValues({ email: '', password: '' })
    } catch {
      // A mensagem segura já é fornecida pelo contexto.
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={isLoginOpen} onClose={closeLogin} title="Entrar na Syntra" description="O login é necessário apenas para registrar ou gerenciar seus relatos.">
      {!isConfigured ? (
        <StatusMessage tone="warning" className="mb-4">
          O Supabase ainda não foi configurado. O acesso demonstrativo abaixo continua disponível sem credenciais.
        </StatusMessage>
      ) : null}
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <FormField id="login-email" label="E-mail" error={errors.email}>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            className={inputClass}
            value={values.email}
            onChange={(event) => setValues((current) => ({ ...current, email: event.target.value }))}
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            aria-invalid={Boolean(errors.email)}
          />
        </FormField>
        <FormField id="login-password" label="Senha" error={errors.password}>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            className={inputClass}
            value={values.password}
            onChange={(event) => setValues((current) => ({ ...current, password: event.target.value }))}
            aria-describedby={errors.password ? 'login-password-error' : undefined}
            aria-invalid={Boolean(errors.password)}
          />
        </FormField>
        {authError ? <StatusMessage tone="error">{authError}</StatusMessage> : null}
        <Button className="w-full" type="submit" disabled={loading || !isConfigured}>
          {loading ? 'Entrando…' : 'Entrar'}
        </Button>
      </form>
      <div className="my-4 flex items-center gap-3 text-xs text-slate" aria-hidden="true"><span className="h-px flex-1 bg-beige" /><span>ou</span><span className="h-px flex-1 bg-beige" /></div>
      <Button type="button" variant="secondary" className="w-full" onClick={signInDemo}>
        Entrar no modo demonstração
      </Button>
      <p className="mt-3 text-xs leading-relaxed text-slate">O modo demonstração é simulado, não usa senha e mantém novos relatos somente nesta sessão. O login Supabase continua sendo a autenticação real.</p>
    </Modal>
  )
}
