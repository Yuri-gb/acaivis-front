import './PaymentStatus.css'

import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import {
    FaArrowLeft,
    FaCheck,
    FaCheckCircle,
    FaCopy,
    FaCreditCard,
    FaExclamationCircle,
    FaHourglassHalf,
    FaQrcode,
    FaRedo,
    FaShoppingBag,
    FaTimesCircle
} from 'react-icons/fa'

import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { api, ApiError } from '../../services/api'
import type { MercadoPagoPaymentResponse, Order, PaymentMethod } from '../../types/api'

const money = (value: number) =>
    value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const formatTime = (seconds: number) => {
    const minutes = Math.max(0, Math.floor(seconds / 60))
    const remaining = Math.max(0, seconds % 60)
    return `${String(minutes).padStart(2, '0')}:${String(remaining).padStart(2, '0')}`
}

type ResultState =
    | 'APPROVED'
    | 'PROMISED'
    | 'PENDING'
    | 'PROCESSING'
    | 'REFUSED'
    | 'EXPIRED'

function resolveState(order: Order, payment: MercadoPagoPaymentResponse | null): ResultState {
    if (order.status === 'PAYMENT_PROMISED') return 'PROMISED'
    if (order.status === 'PAID' || order.paymentConfirmed) return 'APPROVED'
    if (order.status === 'CANCELLED') return 'EXPIRED'

    const status = payment?.status?.toLowerCase()
    const detail = payment?.statusDetail?.toLowerCase() || ''

    if (status === 'approved' || status === 'processed' || status === 'accredited') return 'APPROVED'
    if (status === 'rejected' || status === 'refused' || status === 'charged_back') return 'REFUSED'
    if (status === 'cancelled' || status === 'canceled' || status === 'expired') return 'EXPIRED'
    if (status === 'processing' || status === 'in_process' || status === 'in_mediation') return 'PROCESSING'
    if (detail.includes('rejected') || detail.includes('refused')) return 'REFUSED'

    return 'PENDING'
}

export default function PaymentStatus() {
    const [params] = useSearchParams()
    const navigate = useNavigate()
    const code = params.get('codigo')?.trim().toUpperCase() || ''

    const [order, setOrder] = useState<Order>()
    const [payment, setPayment] = useState<MercadoPagoPaymentResponse | null>(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [now, setNow] = useState(Date.now())

    const refresh = async () => {
        if (!code) {
            setError('Código do pedido não informado.')
            setLoading(false)
            return
        }

        try {
            const [orderResponse, paymentResponse] = await Promise.all([
                api.orderByTracking(code),
                api.paymentStatus(code)
            ])
            setOrder(orderResponse)
            setPayment(paymentResponse)
            setError('')
        } catch (requestError) {
            setError(requestError instanceof ApiError
                ? requestError.message
                : 'Não foi possível consultar o pagamento.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refresh()
    }, [code])

    const state = useMemo(
        () => order ? resolveState(order, payment) : 'PENDING',
        [order, payment]
    )

    useEffect(() => {
        if (!order || state !== 'PENDING') return

        const timer = window.setInterval(() => {
            setNow(Date.now())
            refresh()
        }, 5000)

        return () => window.clearInterval(timer)
    }, [order, state, code])

    useEffect(() => {
        if (!payment?.expiresAt || state !== 'PENDING') return
        const timer = window.setInterval(() => setNow(Date.now()), 1000)
        return () => window.clearInterval(timer)
    }, [payment?.expiresAt, state])

    const expiresAt = payment?.expiresAt ? new Date(payment.expiresAt).getTime() : 0
    const remainingSeconds = expiresAt
        ? Math.max(0, Math.floor((expiresAt - now) / 1000))
        : 0

    useEffect(() => {
        if (state === 'PENDING' && payment?.expiresAt && remainingSeconds === 0) {
            refresh()
        }
    }, [remainingSeconds, state, payment?.expiresAt])

    const copyPix = async () => {
        if (!payment?.qrCode) return
        try {
            await navigator.clipboard.writeText(payment.qrCode)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1800)
        } catch {
            setError('Não foi possível copiar o código Pix automaticamente.')
        }
    }

    const continueShopping = () => navigate('/produtos')
    const tracking = () => navigate(`/rastrear-pedido?codigo=${encodeURIComponent(code)}`)

    const content = {
        APPROVED: {
            icon: <FaCheckCircle />,
            title: 'Pedido realizado com sucesso!',
            message: 'Seu pagamento foi confirmado.',
            className: 'positive'
        },
        PROMISED: {
            icon: <FaCheckCircle />,
            title: 'Pedido confirmado!',
            message: 'Seu pedido foi recebido e será preparado. O pagamento será realizado na entrega.',
            className: 'positive'
        },
        PENDING: {
            icon: <FaHourglassHalf />,
            title: 'Aguardando pagamento',
            message: 'Conclua o pagamento para confirmar seu pedido.',
            className: 'pending'
        },
        PROCESSING: {
            icon: <FaHourglassHalf />,
            title: 'Pagamento em processamento',
            message: 'Seu pagamento foi enviado e ainda não recebeu uma confirmação final.',
            className: 'pending'
        },
        REFUSED: {
            icon: <FaTimesCircle />,
            title: 'Pagamento não aprovado',
            message: 'Não foi possível confirmar este pagamento. Você pode tentar novamente.',
            className: 'negative'
        },
        EXPIRED: {
            icon: <FaExclamationCircle />,
            title: 'Pagamento expirado',
            message: 'Este pagamento não está mais disponível. Faça uma nova tentativa para realizar seu pedido.',
            className: 'negative'
        }
    }[state]

    if (loading) {
        return (
            <>
                <Navbar />
                <main className="payment-status-page">
                    <div className="payment-status-loading">
                        <FaHourglassHalf />
                        <h1>Consultando pagamento...</h1>
                        <p>Estamos buscando o estado mais recente do seu pedido.</p>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    if (error || !order) {
        return (
            <>
                <Navbar />
                <main className="payment-status-page">
                    <div className="payment-status-error">
                        <FaExclamationCircle />
                        <h1>Não foi possível consultar o pedido</h1>
                        <p>{error || 'Pedido não encontrado.'}</p>
                        <Link to="/produtos">Voltar para produtos</Link>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="payment-status-page">
                <div className="payment-status-container">
                    <Link className="payment-status-back" to="/carrinho">
                        <FaArrowLeft /> Voltar
                    </Link>

                    <section className={`payment-result-card ${content.className}`}>
                        <div className="payment-result-icon">{content.icon}</div>
                        <span className="payment-result-kicker">Pagamento</span>
                        <h1>{content.title}</h1>
                        <p>{content.message}</p>

                        <div className="payment-order-summary">
                            <div>
                                <span>Pedido</span>
                                <strong>{order.trackingCode}</strong>
                            </div>
                            <div>
                                <span>Total</span>
                                <strong>{money(Number(order.total))}</strong>
                            </div>
                        </div>

                        {state === 'PENDING' && order.paymentMethod === 'PIX' && (
                            <div className="pix-payment-box">
                                <div className="pix-heading">
                                    <FaQrcode />
                                    <div>
                                        <strong>Pagamento via Pix</strong>
                                        <span>Escaneie o QR Code ou use o código copia e cola.</span>
                                    </div>
                                </div>

                                {payment?.qrCodeBase64 && (
                                    <div className="pix-qr">
                                        <img
                                            src={`data:image/png;base64,${payment.qrCodeBase64}`}
                                            alt="QR Code Pix"
                                        />
                                    </div>
                                )}

                                {payment?.qrCode && (
                                    <div className="pix-copy">
                                        <span>Código Pix copia e cola</span>
                                        <div>
                                            <code>{payment.qrCode}</code>
                                            <button type="button" onClick={copyPix}>
                                                {copied ? <FaCheck /> : <FaCopy />}
                                                {copied ? 'Copiado' : 'Copiar'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {payment?.expiresAt && (
                                    <div className={`pix-timer ${remainingSeconds <= 300 ? 'urgent' : ''}`}>
                                        <span>Tempo restante</span>
                                        <strong>{formatTime(remainingSeconds)}</strong>
                                    </div>
                                )}
                            </div>
                        )}

                        {state === 'PROCESSING' && (
                            <div className="payment-info">
                                <FaHourglassHalf />
                                <span>Não feche esta página. O status será atualizado automaticamente.</span>
                            </div>
                        )}

                        {state === 'REFUSED' && (
                            <div className="payment-info">
                                <FaRedo />
                                <span>Escolha outra forma de pagamento ou tente novamente.</span>
                            </div>
                        )}

                        {state === 'EXPIRED' && (
                            <div className="payment-info">
                                <FaExclamationCircle />
                                <span>O pagamento anterior não pode mais ser utilizado.</span>
                            </div>
                        )}

                        <div className="payment-result-actions">
                            <button type="button" className="primary" onClick={tracking}>
                                <FaShoppingBag /> Rastrear pedido
                            </button>
                            <button type="button" className="secondary" onClick={continueShopping}>
                                Continuar comprando
                            </button>
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </>
    )
}
