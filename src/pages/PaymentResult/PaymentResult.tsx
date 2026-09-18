import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaClock, FaCopy, FaExclamationCircle, FaQrcode, FaRedoAlt, FaShoppingBag, FaTimesCircle } from 'react-icons/fa'
import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'
import { api, ApiError } from '../../services/api'
import type { MercadoPagoPaymentResponse, TrackingOrder } from '../../types/api'
import './PaymentResult.css'

const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

type ViewState = 'APPROVED' | 'PROMISED' | 'PENDING' | 'PROCESSING' | 'REFUSED' | 'EXPIRED' | 'LOADING' | 'ERROR'

const getState = (order: TrackingOrder | null, payment: MercadoPagoPaymentResponse | null): ViewState => {
    if (!order) return 'LOADING'
    if (order.status === 'PAYMENT_PROMISED') return 'PROMISED'
    if (order.status === 'CANCELLED') return 'EXPIRED'
    if (order.paymentConfirmed || payment?.status === 'processed' || payment?.status === 'approved' || payment?.status === 'accredited') return 'APPROVED'
    const status = payment?.status?.toLowerCase()
    if (status === 'rejected' || status === 'refused' || status === 'cc_rejected') return 'REFUSED'
    if (status === 'expired' || status === 'canceled' || status === 'cancelled') return 'EXPIRED'
    if (status === 'processing' || status === 'in_process') return 'PROCESSING'
    return 'PENDING'
}

export default function PaymentResult() {
    const [params] = useSearchParams()
    const code = params.get('codigo')?.trim().toUpperCase() || ''
    const [order, setOrder] = useState<TrackingOrder | null>(null)
    const [payment, setPayment] = useState<MercadoPagoPaymentResponse | null>(null)
    const [error, setError] = useState('')
    const [copied, setCopied] = useState(false)
    const [remaining, setRemaining] = useState<number | null>(null)

    const load = async () => {
        if (!code) {
            setError('Código do pedido não informado.')
            return
        }
        try {
            const current = await api.trackOrder(code)
            setOrder(current)
            const paymentData = await api.paymentStatus(code)
            setPayment(paymentData)
            setError('')
        } catch (e) {
            setError(e instanceof ApiError ? e.message : 'Não foi possível consultar o pagamento.')
        }
    }

    useEffect(() => {
        load()
    }, [code])

    const state = useMemo(() => getState(order, payment), [order, payment])

    useEffect(() => {
        if (!payment?.expiresAt) return
        const tick = () => {
            const diff = new Date(payment.expiresAt!).getTime() - Date.now()
            setRemaining(Math.max(0, Math.floor(diff / 1000)))
        }
        tick()
        const timer = window.setInterval(tick, 1000)
        return () => window.clearInterval(timer)
    }, [payment?.expiresAt])

    useEffect(() => {
        if (!code || state === 'APPROVED' || state === 'PROMISED' || state === 'EXPIRED' || state === 'REFUSED') return
        const timer = window.setInterval(load, 8000)
        return () => window.clearInterval(timer)
    }, [code, state])

    const copyPix = async () => {
        if (!payment?.qrCode) return
        try {
            await navigator.clipboard.writeText(payment.qrCode)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2000)
        } catch {}
    }

    const timerLabel = remaining === null ? '30:00' : `${Math.floor(remaining / 60).toString().padStart(2, '0')}:${(remaining % 60).toString().padStart(2, '0')}`

    if (error) return (
        <>
            <Navbar />
            <main className="payment-result-page"><section className="payment-result-card">
                <FaExclamationCircle className="result-icon error" />
                <h1>Não foi possível consultar o pedido</h1>
                <p>{error}</p>
                <Link className="result-primary" to="/rastrear-pedido">Consultar pedido <FaArrowRight /></Link>
            </section></main>
            <Footer />
        </>
    )

    return (
        <>
            <Navbar />
            <main className="payment-result-page">
                <div className="payment-result-wrap">
                    <Link className="result-back" to="/carrinho"><FaArrowLeft /> Voltar</Link>

                    <section className={`payment-result-card state-${state.toLowerCase()}`}>
                        {state === 'LOADING' && <><FaClock className="result-icon" /><h1>Consultando seu pedido...</h1><p>Estamos buscando a confirmação do pagamento.</p></>}

                        {state === 'APPROVED' && <><FaCheckCircle className="result-icon success" /><span className="result-kicker">Pagamento aprovado</span><h1>Pedido realizado com sucesso!</h1><p>Seu pagamento foi confirmado e seu pedido seguirá para preparo.</p></>}

                        {state === 'PROMISED' && <><FaCheckCircle className="result-icon success" /><span className="result-kicker">Pagamento na entrega</span><h1>Pedido confirmado!</h1><p>Seu pedido foi recebido e será preparado. O pagamento será realizado na entrega.</p></>}

                        {state === 'PENDING' && <><FaClock className="result-icon pending" /><span className="result-kicker">Pagamento pendente</span><h1>Aguardando seu Pix</h1><p>Faça o pagamento para confirmar o pedido. Esta página será atualizada automaticamente.</p>
                            {payment?.qrCodeBase64 && <div className="pix-qr"><img src={`data:image/png;base64,${payment.qrCodeBase64}`} alt="QR Code Pix" /></div>}
                            {payment?.qrCode && <div className="pix-copy"><span>Pix copia e cola</span><div><code>{payment.qrCode}</code><button onClick={copyPix} aria-label="Copiar Pix">{copied ? <FaCheckCircle /> : <FaCopy />}</button></div>{copied && <small>Copiado!</small>}</div>}
                            <div className="pix-timer"><FaClock /><div><span>Tempo para pagamento</span><strong>{timerLabel}</strong></div></div>
                        </>}

                        {state === 'PROCESSING' && <><FaClock className="result-icon pending" /><span className="result-kicker">Pagamento em processamento</span><h1>Estamos confirmando seu pagamento</h1><p>Não feche a página. Assim que houver uma confirmação, o status será atualizado.</p></>}

                        {state === 'REFUSED' && <><FaTimesCircle className="result-icon refused" /><span className="result-kicker">Pagamento recusado</span><h1>Não foi possível aprovar o pagamento</h1><p>Você pode tentar novamente com outro meio de pagamento.</p><Link className="result-primary" to="/finalizar-pedido"><FaRedoAlt /> Tentar novamente</Link></>}

                        {state === 'EXPIRED' && <><FaTimesCircle className="result-icon refused" /><span className="result-kicker">Pagamento expirado / cancelado</span><h1>Este pagamento não está mais disponível</h1><p>O Pix expirou ou o pedido foi cancelado. Inicie uma nova tentativa para fazer um pedido.</p><Link className="result-primary" to="/produtos"><FaShoppingBag /> Fazer novo pedido</Link></>}

                        {order && state !== 'LOADING' && <div className="result-order-info">
                            <div><span>Pedido</span><strong>{order.trackingCode}</strong></div>
                            <div><span>Total</span><strong>{money(Number(order.total))}</strong></div>
                        </div>}

                        {order && state !== 'LOADING' && state !== 'REFUSED' && state !== 'EXPIRED' && <Link className="result-secondary" to={`/rastrear-pedido?codigo=${encodeURIComponent(order.trackingCode)}`}>Rastrear pedido <FaArrowRight /></Link>}
                        {state === 'APPROVED' || state === 'PROMISED' ? <Link className="result-shopping" to="/produtos">Continuar comprando</Link> : null}
                    </section>
                </div>
            </main>
            <Footer />
        </>
    )
}
