import './Checkout.css'

import {
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react'

import {
    FaArrowLeft,
    FaArrowRight,
    FaCheck,
    FaCopy,
    FaCreditCard,
    FaHeart,
    FaLock,
    FaMinus,
    FaPlus,
    FaQrcode,
    FaShoppingBag,
    FaShieldAlt,
    FaShoppingCart,
    FaTag,
    FaTrash,
    FaTruck,
    FaWhatsapp
} from 'react-icons/fa'

import { Link, useNavigate } from 'react-router-dom'

import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

import {
    clearCart,
    getCart,
    removeFromCart,
    updateCartQuantity
} from '../../services/cart'

import {
    api,
    ApiError
} from '../../services/api'

import type {
    CartItem,
    DeliveryCalculation,
    MercadoPagoPaymentResponse,
    Order,
    PaymentMethod
} from '../../types/api'


const MP_PUBLIC_KEY = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || ''

const money = (value: number) =>
    value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

const onlyDigits = (value: string) =>
    value.replace(/\D/g, '')

const maskCpf = (value: string) => {
    const digits = onlyDigits(value).slice(0, 11)
    return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

const maskPhone = (value: string) => {
    const digits = onlyDigits(value).slice(0, 11)
    if (digits.length <= 10) {
        return digits
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
    }
    return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
}

const maskCep = (value: string) => {
    const digits = onlyDigits(value).slice(0, 8)
    return digits.replace(/(\d{5})(\d)/, '$1-$2')
}

const uuid = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`

const paymentLabel = (method: PaymentMethod) => {
    switch (method) {
        case 'CREDIT_CARD':
            return 'Cartão de crédito'
        case 'DEBIT_CARD':
            return 'Cartão de débito'
        case 'CASH':
            return 'Dinheiro'
        default:
            return 'Pix'
    }
}

const statusLabel = (status?: string) => {
    switch (status) {
        case 'processed':
        case 'accredited':
            return 'Pagamento aprovado'
        case 'action_required':
            return 'Aguardando pagamento'
        case 'processing':
            return 'Pagamento em processamento'
        case 'canceled':
        case 'expired':
            return 'Pagamento cancelado'
        default:
            return 'Pagamento recebido'
    }
}


type FormState = {
    customerName: string
    customerPhone: string
    customerEmail: string
    cpf: string
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    paymentMethod: PaymentMethod
    notes: string
}

type CardFormInstance = {
    submit: () => void
    unmount: () => void
    getCardFormData: () => {
        token: string
        installments: string
        paymentMethodId: string
        identificationType: string
        identificationNumber: string
    }
}

type MercadoPagoConstructor = new (
    publicKey: string,
    options?: { locale?: string }
) => {
    cardForm: (options: Record<string, unknown>) => CardFormInstance
}

declare global {
    interface Window {
        MercadoPago?: MercadoPagoConstructor
    }
}

let mercadoPagoScriptPromise: Promise<MercadoPagoConstructor> | null = null

function loadMercadoPago(): Promise<MercadoPagoConstructor> {
    if (window.MercadoPago) {
        return Promise.resolve(window.MercadoPago)
    }

    if (mercadoPagoScriptPromise) {
        return mercadoPagoScriptPromise
    }

    mercadoPagoScriptPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(
            'script[data-mercadopago-sdk="true"]'
        )

        if (existing) {
            existing.addEventListener('load', () => {
                if (window.MercadoPago) resolve(window.MercadoPago)
                else reject(new Error('MercadoPago.js não foi inicializado.'))
            })
            existing.addEventListener('error', () =>
                reject(new Error('Não foi possível carregar o MercadoPago.js.'))
            )
            return
        }

        const script = document.createElement('script')
        script.src = 'https://sdk.mercadopago.com/js/v2'
        script.async = true
        script.dataset.mercadopagoSdk = 'true'
        script.onload = () => {
            if (window.MercadoPago) resolve(window.MercadoPago)
            else reject(new Error('MercadoPago.js não foi inicializado.'))
        }
        script.onerror = () =>
            reject(new Error('Não foi possível carregar o MercadoPago.js.'))
        document.head.appendChild(script)
    })

    return mercadoPagoScriptPromise
}


function Checkout() {
    const navigate = useNavigate()
    const [items, setItems] = useState<CartItem[]>(getCart())
    const [deliveryQuote, setDeliveryQuote] = useState<DeliveryCalculation | null>(null)
    const [form, setForm] = useState<FormState>({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        cpf: '',
        street: '',
        number: '',
        complement: '',
        neighborhood: '',
        city: 'Feira de Santana',
        state: 'BA',
        zipCode: '',
        paymentMethod: 'PIX',
        notes: ''
    })

    const [order, setOrder] = useState<Order>()
    const [payment, setPayment] = useState<MercadoPagoPaymentResponse>()
    const [loading, setLoading] = useState(false)
    const [cardReady, setCardReady] = useState(false)
    const [cardError, setCardError] = useState('')
    const [error, setError] = useState('')
    const [cepLoading, setCepLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [couponOpen, setCouponOpen] = useState(false)

    const cardFormRef = useRef<CardFormInstance | null>(null)
    const pendingCardOrderRef = useRef<Order | null>(null)

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
        [items]
    )

    const deliveryFee = Number(deliveryQuote?.deliveryFee || 0)
    const total = subtotal + deliveryFee
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    useEffect(() => {
        const savedQuote = sessionStorage.getItem('acaivis_delivery_quote')
        const savedCep = sessionStorage.getItem('acaivis_checkout_cep')

        if (savedQuote) {
            try {
                const parsed = JSON.parse(savedQuote) as DeliveryCalculation
                if (parsed.deliveryZoneId) {
                    setDeliveryQuote(parsed)
                }
            } catch {
                sessionStorage.removeItem('acaivis_delivery_quote')
            }
        }

        if (savedCep) {
            setForm(previous => ({ ...previous, zipCode: maskCep(savedCep) }))
        }
    }, [])

    useEffect(() => {
        if (!['CREDIT_CARD', 'DEBIT_CARD'].includes(form.paymentMethod)) {
            cardFormRef.current?.unmount()
            cardFormRef.current = null
            setCardReady(false)
            setCardError('')
            return
        }

        if (!MP_PUBLIC_KEY) {
            setCardError('A Public Key do Mercado Pago não está configurada no frontend.')
            return
        }

        let cancelled = false
        let currentCardForm: CardFormInstance | null = null

        setCardReady(false)
        setCardError('')
        cardFormRef.current?.unmount()
        cardFormRef.current = null

        loadMercadoPago()
            .then(MercadoPago => {
                if (cancelled) return

                const mp = new MercadoPago(MP_PUBLIC_KEY, {
                    locale: 'pt-BR'
                })

                const cardForm = mp.cardForm({
                    amount: total.toFixed(2),
                    iframe: true,
                    form: {
                        id: 'acaivis-card-form',
                        cardNumber: {
                            id: 'mp-card-number',
                            placeholder: 'Número do cartão',
                            style: {
                                color: '#ffffff',
                                fontSize: '12px',
                                placeholderColor: '#8f8f9d'
                            }
                        },
                        expirationDate: {
                            id: 'mp-expiration-date',
                            placeholder: 'MM/AA',
                            style: {
                                color: '#ffffff',
                                fontSize: '12px',
                                placeholderColor: '#8f8f9d'
                            }
                        },
                        securityCode: {
                            id: 'mp-security-code',
                            placeholder: 'CVV',
                            style: {
                                color: '#ffffff',
                                fontSize: '12px',
                                placeholderColor: '#8f8f9d'
                            }
                        },
                        cardholderName: {
                            id: 'mp-cardholder-name',
                            placeholder: 'Nome como está no cartão'
                        },
                        issuer: {
                            id: 'mp-issuer',
                            placeholder: 'Banco emissor'
                        },
                        installments: {
                            id: 'mp-installments',
                            placeholder: 'Parcelas'
                        },
                        identificationType: {
                            id: 'mp-identification-type',
                            placeholder: 'Tipo de documento'
                        },
                        identificationNumber: {
                            id: 'mp-identification-number',
                            placeholder: 'CPF'
                        },
                        cardholderEmail: {
                            id: 'mp-cardholder-email',
                            placeholder: 'E-mail'
                        }
                    },
                    style: {
                        input: {
                            color: '#ffffff',
                            fontSize: '12px'
                        },
                        select: {
                            color: '#ffffff',
                            fontSize: '12px'
                        }
                    },
                    callbacks: {
                        onFormMounted: (mountError: unknown) => {
                            if (mountError) {
                                setCardError('Não foi possível carregar o formulário do cartão.')
                                return
                            }
                            setCardReady(true)
                        },
                        onReady: () => setCardReady(true),
                        onError: (cardFormError: unknown) => {
                            console.error('Mercado Pago CardForm error:', cardFormError)
                            setCardError('Verifique os dados do cartão e tente novamente.')
                        },
                        onSubmit: async (event: Event) => {
                            event.preventDefault()

                            const cardData = cardForm.getCardFormData()
                            const cardholderEmail = String(cardData.cardholderEmail || form.customerEmail || '').trim()

                            if (!cardData.token) {
                                setError('Não foi possível gerar o token do cartão. Verifique os dados informados.')
                                setLoading(false)
                                return
                            }

                            if (!cardholderEmail) {
                                setError('Informe o e-mail do comprador antes de continuar.')
                                setLoading(false)
                                return
                            }

                            try {
                                // Card tokenization must succeed before creating the local
                                // order. A rejected/invalid card must not create an order.
                                const createdOrder = await createLocalOrder()
                                if (!createdOrder) {
                                    setLoading(false)
                                    return
                                }

                                pendingCardOrderRef.current = createdOrder
                                setOrder(createdOrder)

                                const paymentMethodType = form.paymentMethod === 'CREDIT_CARD'
                                    ? 'credit_card'
                                    : 'debit_card'

                                const response = await api.createMercadoPagoPayment(createdOrder.id, {
                                    paymentMethodId: cardData.paymentMethodId,
                                    paymentMethodType,
                                    token: cardData.token,
                                    installments: form.paymentMethod === 'DEBIT_CARD'
                                        ? 1
                                        : Number(cardData.installments || 1),
                                    payerEmail: cardholderEmail,
                                    idempotencyKey: uuid()
                                })

                                setPayment(response)
                                clearCart()
                                navigate(`/resultado-pagamento?codigo=${encodeURIComponent(createdOrder.trackingCode)}`)
                            } catch (paymentError) {
                                setError(paymentError instanceof ApiError
                                    ? paymentError.message
                                    : 'Não foi possível processar o pagamento.')
                            } finally {
                                pendingCardOrderRef.current = null
                                setLoading(false)
                            }
                        }
                    }
                })

                if (!cancelled) {
                    currentCardForm = cardForm
                    cardFormRef.current = cardForm
                } else {
                    cardForm.unmount()
                }
            })
            .catch(loadError => {
                if (!cancelled) {
                    console.error('Mercado Pago SDK error:', loadError)
                    setCardError(loadError instanceof Error
                        ? loadError.message
                        : 'Não foi possível carregar o Mercado Pago.')
                }
            })

        return () => {
            cancelled = true
            currentCardForm?.unmount()

            if (cardFormRef.current === currentCardForm) {
                cardFormRef.current = null
            }
        }
    }, [form.paymentMethod, total])

    const setField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
        setForm(previous => ({ ...previous, [field]: value }))
    }

    const changeQuantity = (productId: number, quantity: number) => {
        updateCartQuantity(productId, quantity)
        setItems(getCart())
    }

    const removeItem = (productId: number) => {
        removeFromCart(productId)
        setItems(getCart())
    }

    const calculateDelivery = async (zipCode: string) => {
        const result = await api.calculateDelivery(zipCode)

        if (!result.deliveryZoneId) {
            setDeliveryQuote(null)
            throw new Error('Ainda não entregamos nesse CEP.')
        }

        setDeliveryQuote(result)
        sessionStorage.setItem('acaivis_delivery_quote', JSON.stringify(result))
        sessionStorage.setItem('acaivis_checkout_cep', zipCode)
        return result
    }

    const lookupCep = async () => {
        const cep = onlyDigits(form.zipCode)
        if (cep.length !== 8) {
            setError('Digite um CEP válido com 8 números.')
            return
        }

        setCepLoading(true)
        setError('')

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
            if (!response.ok) throw new Error('Não foi possível consultar o CEP.')
            const data = await response.json() as {
                erro?: boolean
                logradouro?: string
                bairro?: string
                localidade?: string
                uf?: string
            }

            if (data.erro) throw new Error('CEP não encontrado.')

            setForm(previous => ({
                ...previous,
                street: data.logradouro || previous.street,
                neighborhood: data.bairro || previous.neighborhood,
                city: data.localidade || previous.city,
                state: data.uf || previous.state
            }))

            await calculateDelivery(cep)
        } catch (lookupError) {
            setDeliveryQuote(null)
            setError(lookupError instanceof Error ? lookupError.message : 'Não foi possível calcular o frete.')
        } finally {
            setCepLoading(false)
        }
    }

    const validate = () => {
        if (!deliveryQuote?.deliveryZoneId) return 'Calcule o frete pelo CEP antes de continuar.'
        if (!form.customerName.trim()) return 'Informe seu nome completo.'
        if (!form.customerEmail.trim()) return 'Informe seu e-mail.'
        if (!onlyDigits(form.cpf) || onlyDigits(form.cpf).length !== 11) return 'Informe um CPF válido.'
        if (onlyDigits(form.customerPhone).length < 10) return 'Informe um telefone válido.'
        if (!onlyDigits(form.zipCode) || onlyDigits(form.zipCode).length !== 8) return 'Informe um CEP válido.'
        if (!form.street.trim() || !form.number.trim() || !form.neighborhood.trim()) return 'Complete seu endereço de entrega.'
        if (!items.length) return 'Seu carrinho está vazio.'
        if (['CREDIT_CARD', 'DEBIT_CARD'].includes(form.paymentMethod) && !cardReady) return 'Aguarde o formulário do cartão carregar.'
        return ''
    }

    const createLocalOrder = async () => {
        const validationError = validate()
        if (validationError) {
            setError(validationError)
            return null
        }

        const createdOrder = await api.createOrder({
            customerName: form.customerName.trim(),
            customerPhone: onlyDigits(form.customerPhone),
            customerEmail: form.customerEmail.trim(),
            street: form.street.trim(),
            number: form.number.trim(),
            complement: form.complement.trim(),
            neighborhood: form.neighborhood.trim(),
            city: form.city.trim(),
            state: form.state.trim().toUpperCase(),
            zipCode: onlyDigits(form.zipCode),
            deliveryZoneId: deliveryQuote!.deliveryZoneId,
            paymentMethod: form.paymentMethod,
            notes: form.notes.trim(),
            items: items.map(item => ({
                productId: item.productId,
                quantity: item.quantity
            }))
        })

        return createdOrder
    }

    const handleCheckout = async () => {
        setError('')
        setCardError('')
        setLoading(true)

        try {
            if (form.paymentMethod === 'CREDIT_CARD' || form.paymentMethod === 'DEBIT_CARD') {
                // Do not create an order before Mercado Pago successfully tokenizes
                // the card. The CardForm onSubmit callback creates it after tokenization.
                if (!cardFormRef.current) {
                    setError('O formulário do cartão ainda não está pronto.')
                    setLoading(false)
                    return
                }

                cardFormRef.current.submit()
                return
            }

            const createdOrder = await createLocalOrder()
            if (!createdOrder) {
                setLoading(false)
                return
            }

            setOrder(createdOrder)

            if (form.paymentMethod === 'CASH') {
                clearCart()
                navigate(`/resultado-pagamento?codigo=${encodeURIComponent(createdOrder.trackingCode)}`)
                setLoading(false)
                return
            }

            if (form.paymentMethod === 'PIX') {
                const response = await api.createMercadoPagoPayment(createdOrder.id, {
                    paymentMethodId: 'pix',
                    paymentMethodType: 'bank_transfer',
                    token: null,
                    installments: null,
                    payerEmail: form.customerEmail.trim(),
                    idempotencyKey: uuid()
                })

                setPayment(response)
                clearCart()
                navigate(`/resultado-pagamento?codigo=${encodeURIComponent(createdOrder.trackingCode)}`)
                setLoading(false)
                return
            }

        } catch (checkoutError) {
            setError(checkoutError instanceof ApiError
                ? checkoutError.message
                : 'Não foi possível finalizar o pedido.')
            setLoading(false)
        }
    }

    const copyPix = async () => {
        if (!payment?.qrCode) return
        try {
            await navigator.clipboard.writeText(payment.qrCode)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 2200)
        } catch {
            setError('Não foi possível copiar o código Pix automaticamente.')
        }
    }

    const renderPaymentResult = () => {
        if (!payment) return null

        const paid = payment.status === 'processed' || payment.status === 'accredited'
        const cancelled = payment.status === 'canceled' || payment.status === 'expired'

        if (form.paymentMethod === 'PIX') {
            return (
                <div className={`checkout-pix-result ${paid ? 'is-paid' : ''}`}>
                    <div className="checkout-pix-copy">
                        <div className="checkout-pix-heading">
                            <div className="checkout-pix-icon"><FaQrcode /></div>
                            <div>
                                <span>Pagamento via Pix</span>
                                <strong>{paid ? 'Pagamento aprovado!' : 'Pague com Pix'}</strong>
                            </div>
                        </div>

                        {!paid && !cancelled && (
                            <p>
                                Escaneie o QR Code pelo app do seu banco ou copie o código abaixo.
                            </p>
                        )}

                        {payment.qrCodeBase64 && !paid && (
                            <div className="checkout-pix-qr-wrap">
                                <img
                                    src={`data:image/png;base64,${payment.qrCodeBase64}`}
                                    alt="QR Code Pix para pagamento"
                                />
                                <span>Abra o app do seu banco e escaneie</span>
                            </div>
                        )}

                        {payment.qrCode && !paid && (
                            <div className="checkout-pix-code">
                                <span>Código Pix copia e cola</span>
                                <div>
                                    <code>{payment.qrCode}</code>
                                    <button type="button" onClick={copyPix} aria-label="Copiar código Pix">
                                        {copied ? <FaCheck /> : <FaCopy />}
                                    </button>
                                </div>
                                {copied && <small>Código copiado!</small>}
                            </div>
                        )}

                        <div className={`checkout-payment-status ${paid ? 'paid' : cancelled ? 'cancelled' : ''}`}>
                            <span>{paid ? <FaCheck /> : <FaLock />}</span>
                            <div>
                                <strong>{cancelled ? 'Pagamento cancelado' : statusLabel(payment.status)}</strong>
                                <small>
                                    {paid
                                        ? 'Seu pedido já pode entrar em preparo.'
                                        : cancelled
                                            ? 'Você pode iniciar uma nova tentativa de pagamento.'
                                            : 'Assim que o pagamento for confirmado, seu pedido seguirá para preparo.'}
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div className={`checkout-card-result ${paid ? 'is-paid' : ''}`}>
                <span className="checkout-card-result-icon">
                    {paid ? <FaCheck /> : <FaCreditCard />}
                </span>
                <div>
                    <strong>{statusLabel(payment.status)}</strong>
                    <span>{payment.statusDetail || 'O Mercado Pago recebeu a solicitação.'}</span>
                </div>
            </div>
        )
    }

    if (!items.length && !order) {
        return (
            <>
                <Navbar />
                <main className="checkout-page checkout-empty-page">
                    <div className="checkout-empty-card">
                        <FaShoppingCart />
                        <h1>Seu carrinho está vazio.</h1>
                        <p>Escolha seus sabores favoritos e volte para finalizar o pedido.</p>
                        <Link to="/produtos">Escolher produtos</Link>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    const orderPaid = Boolean(order?.paymentConfirmed || payment?.status === 'processed' || payment?.status === 'accredited')

    return (
        <>
            <Navbar />

            <main className="checkout-page">
                <div className="checkout-breadcrumb">
                    <Link to="/">Início</Link>
                    <span>›</span>
                    <Link to="/carrinho">Carrinho</Link>
                    <span>›</span>
                    <strong>Finalizar pedido</strong>
                </div>

                <header className="checkout-hero">
                    <div>
                        <span className="checkout-kicker">Quase lá!</span>
                        <h1>Finalize seu <em>pedido</em></h1>
                        <p>Preencha seus dados, escolha a forma de entrega e pagamento.</p>
                    </div>
                    <div className="checkout-hero-copy" aria-hidden="true">
                        <span>Mais sabor,<br />mais momentos.</span>
                        <FaHeart />
                    </div>
                </header>

                <div className="checkout-layout">
                    <section className="checkout-main-column">
                        <section className="checkout-section">
                            <div className="checkout-section-heading">
                                <span className="checkout-step">1</span>
                                <div>
                                    <h2>Dados pessoais</h2>
                                    <p>Informe seus dados para identificarmos seu pedido.</p>
                                </div>
                            </div>

                            <div className="checkout-fields checkout-fields-personal">
                                <label className="checkout-field field-span-2">
                                    <span>Nome completo <b>*</b></span>
                                    <input
                                        value={form.customerName}
                                        onChange={event => setField('customerName', event.target.value)}
                                        placeholder="Seu nome completo"
                                        autoComplete="name"
                                    />
                                </label>
                                <label className="checkout-field field-span-2">
                                    <span>E-mail <b>*</b></span>
                                    <input
                                        type="email"
                                        value={form.customerEmail}
                                        onChange={event => setField('customerEmail', event.target.value)}
                                        placeholder="seu@email.com"
                                        autoComplete="email"
                                    />
                                </label>
                                <label className="checkout-field">
                                    <span>CPF <b>*</b></span>
                                    <input
                                        value={form.cpf}
                                        onChange={event => setField('cpf', maskCpf(event.target.value))}
                                        placeholder="000.000.000-00"
                                        inputMode="numeric"
                                    />
                                </label>
                                <label className="checkout-field">
                                    <span>Telefone <b>*</b></span>
                                    <input
                                        value={form.customerPhone}
                                        onChange={event => setField('customerPhone', maskPhone(event.target.value))}
                                        placeholder="(75) 00000-0000"
                                        autoComplete="tel"
                                        inputMode="tel"
                                    />
                                </label>
                            </div>
                        </section>

                        <section className="checkout-section">
                            <div className="checkout-section-heading">
                                <span className="checkout-step">2</span>
                                <div>
                                    <h2>Endereço de entrega</h2>
                                    <p>Onde você quer receber seu pedido?</p>
                                </div>
                            </div>

                            <div className="checkout-fields checkout-fields-address">
                                <div className="checkout-cep-row">
                                    <label className="checkout-field">
                                        <span>CEP <b>*</b></span>
                                        <div className="checkout-input-action">
                                            <input
                                                value={form.zipCode}
                                                onChange={event => {
                                                    setField('zipCode', maskCep(event.target.value))
                                                    setDeliveryQuote(null)
                                                    sessionStorage.removeItem('acaivis_delivery_quote')
                                                }}
                                                placeholder="00000-000"
                                                autoComplete="postal-code"
                                                inputMode="numeric"
                                            />
                                            <button type="button" onClick={lookupCep} disabled={cepLoading} aria-label="Consultar CEP">
                                                {cepLoading ? '...' : '⌕'}
                                            </button>
                                        </div>
                                    </label>
                                </div>

                                <label className="checkout-field field-span-3">
                                    <span>Rua <b>*</b></span>
                                    <input value={form.street} onChange={event => setField('street', event.target.value)} placeholder="Nome da rua, avenida, etc." autoComplete="street-address" />
                                </label>
                                <label className="checkout-field">
                                    <span>Número <b>*</b></span>
                                    <input value={form.number} onChange={event => setField('number', event.target.value)} placeholder="Nº" />
                                </label>
                                <label className="checkout-field field-span-2">
                                    <span>Complemento <small>(opcional)</small></span>
                                    <input value={form.complement} onChange={event => setField('complement', event.target.value)} placeholder="Apto, bloco, etc." />
                                </label>
                                <label className="checkout-field field-span-2">
                                    <span>Bairro <b>*</b></span>
                                    <input value={form.neighborhood} onChange={event => setField('neighborhood', event.target.value)} placeholder="Seu bairro" autoComplete="address-level3" />
                                </label>
                                <label className="checkout-field">
                                    <span>Cidade <b>*</b></span>
                                    <input value={form.city} onChange={event => setField('city', event.target.value)} placeholder="Feira de Santana" autoComplete="address-level2" />
                                </label>
                                <label className="checkout-field">
                                    <span>Estado <b>*</b></span>
                                    <select value={form.state} onChange={event => setField('state', event.target.value)}>
                                        <option value="BA">BA</option>
                                        <option value="AL">AL</option>
                                        <option value="PE">PE</option>
                                        <option value="SE">SE</option>
                                        <option value="MG">MG</option>
                                        <option value="SP">SP</option>
                                        <option value="RJ">RJ</option>
                                    </select>
                                </label>
                            </div>
                        </section>

                        <section className="checkout-section checkout-payment-section">
                            <div className="checkout-section-heading checkout-payment-heading">
                                <span className="checkout-step">3</span>
                                <div>
                                    <h2>Forma de pagamento</h2>
                                    <p>Escolha a forma de pagamento.</p>
                                </div>
                                <div className="checkout-secure-badge">
                                    <FaLock />
                                    <div>
                                        <strong>Pagamento seguro</strong>
                                        <span>Seus dados estão protegidos</span>
                                    </div>
                                </div>
                            </div>

                            <div className="payment-methods">
                                <button type="button" className={`payment-method ${form.paymentMethod === 'PIX' ? 'active' : ''}`} onClick={() => !order && setField('paymentMethod', 'PIX')} disabled={Boolean(order)}>
                                    <FaQrcode />
                                    <span>Pix</span>
                                </button>
                                <button type="button" className={`payment-method ${form.paymentMethod === 'CREDIT_CARD' ? 'active' : ''}`} onClick={() => !order && setField('paymentMethod', 'CREDIT_CARD')} disabled={Boolean(order)}>
                                    <FaCreditCard />
                                    <span>Cartão de crédito</span>
                                </button>
                                <button type="button" className={`payment-method ${form.paymentMethod === 'DEBIT_CARD' ? 'active' : ''}`} onClick={() => !order && setField('paymentMethod', 'DEBIT_CARD')} disabled={Boolean(order)}>
                                    <FaCreditCard />
                                    <span>Cartão de débito</span>
                                </button>
                                <button type="button" className={`payment-method ${form.paymentMethod === 'CASH' ? 'active' : ''}`} onClick={() => !order && setField('paymentMethod', 'CASH')} disabled={Boolean(order)}>
                                    <FaShoppingBag />
                                    <span>Dinheiro</span>
                                </button>
                            </div>

                            {payment ? (
                                renderPaymentResult()
                            ) : form.paymentMethod === 'PIX' && (
                                <div className="payment-instructions">
                                    <div className="payment-instructions-copy">
                                        <h3>Pague com Pix</h3>
                                        <p>Aprovação em segundos e seu pedido já entra em preparo.</p>

                                        <div className="pix-steps">
                                            <div><span>1</span><p><strong>Clique em “Gerar Pix”</strong><small>Vamos criar o código Pix para o seu pedido.</small></p></div>
                                            <div><span>2</span><p><strong>Escaneie o QR Code</strong><small>Você pode pagar pelo app do seu banco.</small></p></div>
                                            <div><span>3</span><p><strong>Após o pagamento</strong><small>Seu pedido será confirmado automaticamente.</small></p></div>
                                        </div>
                                    </div>
                                    <div className="pix-preview">
                                        <div className="pix-placeholder"><FaQrcode /></div>
                                        <span>Seu QR Code aparecerá aqui</span>
                                        <small>Depois de gerar o Pix</small>
                                    </div>
                                </div>
                            )}

                            {(form.paymentMethod === 'CREDIT_CARD' || form.paymentMethod === 'DEBIT_CARD') && !payment && (
                                <div className="card-payment-panel">
                                    <div className="card-payment-panel-header">
                                        <div>
                                            <h3>{paymentLabel(form.paymentMethod)}</h3>
                                            <p>Os dados do cartão são capturados com segurança pelo Mercado Pago.</p>
                                        </div>
                                        <FaShieldAlt />
                                    </div>

                                    <form id="acaivis-card-form" className="mp-card-form" onSubmit={event => event.preventDefault()}>
                                        <div className="card-field full">
                                            <span>Número do cartão</span>
                                            <div id="mp-card-number" className="mp-secure-field" />
                                        </div>
                                        <div className="card-field">
                                            <span>Validade</span>
                                            <div id="mp-expiration-date" className="mp-secure-field" />
                                        </div>
                                        <div className="card-field">
                                            <span>CVV</span>
                                            <div id="mp-security-code" className="mp-secure-field" />
                                        </div>
                                        <div className="card-field full">
                                            <span>Nome no cartão</span>
                                            <input id="mp-cardholder-name" placeholder="Nome como está no cartão" />
                                        </div>

                                        <select
                                            id="mp-issuer"
                                            aria-hidden="true"
                                            tabIndex={-1}
                                            style={{ display: 'none' }}
                                        />

                                        <div className={`card-field ${form.paymentMethod === 'DEBIT_CARD' ? 'card-field-installments-hidden' : ''}`}>
                                            <span>Parcelas</span>
                                            <select id="mp-installments" />
                                        </div>
                                        <div className="card-field">
                                            <span>Documento</span>
                                            <select id="mp-identification-type" />
                                        </div>
                                        <div className="card-field">
                                            <span>CPF</span>
                                            <input
                                                id="mp-identification-number"
                                                value={onlyDigits(form.cpf)}
                                                onChange={event => setField('cpf', onlyDigits(event.target.value).slice(0, 11))}
                                                placeholder="00000000000"
                                                inputMode="numeric"
                                                autoComplete="off"
                                            />
                                        </div>
                                        <div className="card-field full">
                                            <span>E-mail do comprador</span>
                                            <input id="mp-cardholder-email" value={form.customerEmail} onChange={event => setField('customerEmail', event.target.value)} placeholder="seu@email.com" type="email" />
                                        </div>
                                        <button type="submit" id="mp-card-submit" className="mp-hidden-submit">Continuar</button>
                                    </form>

                                    {cardError && <p className="checkout-error">{cardError}</p>}
                                </div>
                            )}

                            {form.paymentMethod === 'CASH' && (
                                <div className="cash-payment-panel">
                                    <FaShoppingBag />
                                    <div>
                                        <strong>Pagamento na entrega</strong>
                                        <p>Tenha o valor exato em mãos para agilizar a entrega.</p>
                                    </div>
                                </div>
                            )}

                            {error && <p className="checkout-error">{error}</p>}

                            <div className="checkout-notes-field">
                                <label className="checkout-field">
                                    <span>Observações do pedido <small>(opcional)</small></span>
                                    <textarea value={form.notes} onChange={event => setField('notes', event.target.value)} placeholder="Ex.: sem leite em pó, tocar a campainha..." rows={3} />
                                </label>
                            </div>
                        </section>

                        <div className="checkout-bottom-actions">
                            <Link to="/carrinho"><FaArrowLeft /> Voltar ao carrinho</Link>
                            {order ? (
                                <Link className="checkout-order-created-button" to={`/rastrear-pedido?codigo=${order.trackingCode}`}>
                                    {orderPaid ? 'Acompanhar pedido' : 'Pedido criado — acompanhar'} <FaArrowRight />
                                </Link>
                            ) : (
                                <button type="button" onClick={handleCheckout} disabled={loading}>
                                    {loading
                                        ? 'Processando...'
                                        : form.paymentMethod === 'PIX'
                                            ? 'Gerar código Pix'
                                            : 'Finalizar pedido'}
                                    <FaArrowRight />
                                </button>
                            )}
                        </div>
                    </section>

                    <aside className="checkout-sidebar">
                        <section className="order-summary-card">
                            <div className="order-summary-heading">
                                <div>
                                    <FaShoppingBag />
                                    <h2>Resumo do pedido</h2>
                                </div>
                                <Link to="/carrinho">Editar carrinho</Link>
                            </div>

                            <div className="summary-items">
                                {items.map(item => (
                                    <article className="summary-item" key={item.productId}>
                                        <img src={item.image} alt={item.name} />
                                        <div className="summary-item-info">
                                            <strong>{item.name}</strong>
                                            <span>{item.description || 'Açaívis'}</span>
                                            <b>{money(item.unitPrice)}</b>
                                        </div>
                                        <div className="summary-item-actions">
                                            <button type="button" onClick={() => removeItem(item.productId)} aria-label={`Remover ${item.name}`}><FaTrash /></button>
                                            <div className="quantity-control">
                                                <button type="button" onClick={() => changeQuantity(item.productId, item.quantity - 1)}><FaMinus /></button>
                                                <span>{item.quantity}</span>
                                                <button type="button" onClick={() => changeQuantity(item.productId, item.quantity + 1)}><FaPlus /></button>
                                            </div>
                                            <strong>{money(item.unitPrice * item.quantity)}</strong>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="summary-line"><span><FaTrash /> Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</span><strong>{money(subtotal)}</strong></div>
                            <div className="summary-line"><span><FaTruck /> Frete de entrega</span><strong>{deliveryQuote ? money(deliveryFee) : '—'}</strong></div>
                            <div className="summary-line"><span><FaTag /> Cupom de desconto</span><button type="button" onClick={() => setCouponOpen(value => !value)}>{couponOpen ? 'Fechar' : 'Adicionar cupom'}</button></div>

                            {couponOpen && (
                                <div className="coupon-box">
                                    <input placeholder="Digite seu cupom" disabled />
                                    <span>Cupons serão liberados em breve.</span>
                                </div>
                            )}

                            <div className="summary-total"><span>Total</span><strong>{money(total)}</strong></div>

                            <div className="summary-trust-box">
                                <FaHeart />
                                <div>
                                    <strong>Seu pedido será preparado com muito cuidado!</strong>
                                    <span>Qualidade e sabor direto de Feira de Santana - BA.</span>
                                </div>
                            </div>
                        </section>

                        <section className="checkout-benefits-card">
                            <div><FaTruck /><span><strong>Entrega com segurança</strong><small>Direto na sua casa</small></span></div>
                            <div><FaShieldAlt /><span><strong>Seus dados protegidos</strong><small>Compra 100% segura</small></span></div>
                            <div><FaCreditCard /><span><strong>Diversas formas de pagamento</strong><small>Pix, cartão, débito e mais</small></span></div>
                            <div><FaWhatsapp /><span><strong>Precisa de ajuda?</strong><small>Fale com a gente no WhatsApp</small></span></div>
                        </section>
                    </aside>
                </div>
            </main>

            <Footer />
        </>
    )
}

export default Checkout