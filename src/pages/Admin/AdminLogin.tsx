import { FormEvent, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, auth, ApiError } from '../../services/api'
import './Admin.css'

export default function AdminLogin() {
    const nav = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem(auth.tokenKey)
        const role = localStorage.getItem(auth.roleKey)

        if (!token || !role) {
            return
        }

        if (role === 'DELIVERER') {
            nav('/entrega', { replace: true })
            return
        }

        if (role === 'ADMIN') {
            nav('/admin', { replace: true })
        }
    }, [nav])

    const submit = async (e: FormEvent) => {
        e.preventDefault()

        setError('')
        setLoading(true)

        try {
            const r = await api.login(email.trim(), password)

            localStorage.setItem(auth.tokenKey, r.token)
            localStorage.setItem(auth.roleKey, r.role)

            if (r.role === 'DELIVERER') {
                nav('/entrega', { replace: true })
            } else if (r.role === 'ADMIN') {
                nav('/admin', { replace: true })
            } else {
                localStorage.removeItem(auth.tokenKey)
                localStorage.removeItem(auth.roleKey)
                setError('Perfil de acesso não reconhecido.')
            }
        } catch (e) {
            setError(
                e instanceof ApiError
                    ? e.message
                    : 'Credenciais inválidas.'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="admin-login">
            <form
                className="admin-login-card"
                onSubmit={submit}
            >
                <h1>Acesso Açaívis</h1>

                <p>
                    Entre para acessar sua área.
                </p>

                <label>
                    E-mail

                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="username"
                    />
                </label>

                <label>
                    Senha

                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                    />
                </label>

                {error && (
                    <div className="admin-error">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </main>
    )
}