import './Cart.css'

import {
    useEffect,
    useMemo,
    useState
} from 'react'

import {
    FaChevronRight,
    FaTrash,
    FaMinus,
    FaPlus,
    FaArrowLeft,
    FaShoppingCart,
    FaMapMarkerAlt,
    FaShieldAlt,
    FaSearch
} from 'react-icons/fa'

import { Link } from 'react-router-dom'

import Navbar from '../../components/Navbar/Navbar'
import Footer from '../../components/Footer/Footer'

import ProductsCarousel, {
    CarouselProduct
} from '../../components/ProductsCarousel/ProductsCarousel'

import cartEmptyImage
    from '../../assets/images/cart/cart-empty.webp'

import cartEmptyMobileImage
    from '../../assets/images/cart/cart-empty-mobile.webp'

import cartEmptyCheioImage
    from '../../assets/images/cart/cart-empty-cheio.webp'

import cartEmptyCheioMobileImage
    from '../../assets/images/cart/cart-empty-cheio-mobile.webp'

import estaVazioImage
    from '../../assets/images/cart/esta-vazio.webp'

import gostarImage
    from '../../assets/images/cart/gostar.webp'

import {
    getCart,
    removeFromCart,
    updateCartQuantity,
    clearCart
} from '../../services/cart'

import { api } from '../../services/api'

import { productImage } from '../../services/image'

import type { CartItem } from '../../types/api'


const money = (n: number) =>
    n.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })


function Cart() {

    const [items, setItems] =
        useState<CartItem[]>(getCart())

    const [cep, setCep] = useState('')
    const [cepLoading, setCepLoading] = useState(false)
    const [deliveryFee, setDeliveryFee] = useState<number | null>(null)
    const [deliveryMessage, setDeliveryMessage] = useState('Digite seu CEP para calcular o frete.')

    const [recommended, setRecommended] =
        useState<CarouselProduct[]>([])


    useEffect(() => {

        const refresh = () =>
            setItems(getCart())


        window.addEventListener(
            'acaivis-cart-updated',
            refresh
        )


        api.availableProducts
            .then(data => {

                setRecommended(
                    data
                        .slice(0, 4)
                        .map(p => ({
                            id: p.id,

                            image: productImage(
                                p.imageUrl,
                                p.name
                            ),

                            name: p.name,

                            description:
                                p.description,

                            price:
                                p.price.toLocaleString(
                                    'pt-BR',
                                    {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }
                                )
                        }))
                )

            })
            .catch(console.error)


        return () =>
            window.removeEventListener(
                'acaivis-cart-updated',
                refresh
            )

    }, [])


    const subtotal =
        useMemo(
            () =>
                items.reduce(
                    (s, i) =>
                        s +
                        i.unitPrice *
                        i.quantity,
                    0
                ),
            [items]
        )


    const total = subtotal + (items.length ? Number(deliveryFee || 0) : 0)


    const change =
        (
            id: number,
            q: number
        ) => {

            updateCartQuantity(id, q)

            setItems(getCart())
        }


    return (

        <div className="cart-page">

            <Navbar />

            <main className="cart-main">

                {items.length ? (

                    <>

                        <section className="cart-filled-hero">

                            <div className="cart-filled-hero-breadcrumb">

                                <Link to="/">
                                    Início
                                </Link>

                                <FaChevronRight />

                                <span>
                                    <FaShoppingCart />
                                    Carrinho
                                </span>

                            </div>


                            <div className="cart-filled-hero-content">

                                <h1>
                                    Seu <span>carrinho</span>
                                </h1>

                                <p>
                                    Confira seus produtos e finalize seu pedido.
                                </p>

                            </div>


                            <div className="cart-filled-hero-art">

                                <picture>

                                    <source
                                        media="(max-width:790px)"
                                        srcSet={
                                            cartEmptyCheioMobileImage
                                        }
                                    />

                                    <img
                                        src={
                                            cartEmptyCheioImage
                                        }
                                        alt="Açaívis"
                                    />

                                </picture>

                            </div>

                        </section>


                        <section className="cart-filled-layout">

                            <div className="cart-filled-products">

                                <div className="cart-filled-products-header">

                                    <h2>
                                        Seus produtos
                                    </h2>

                                    <span>
                                        {
                                            items.reduce(
                                                (s, i) =>
                                                    s +
                                                    i.quantity,
                                                0
                                            )
                                        } itens
                                    </span>

                                </div>


                                <div className="cart-filled-items">

                                    {items.map(item => (

                                        <article
                                            className="cart-filled-item"
                                            key={item.productId}
                                        >

                                            <div className="cart-filled-item-image">

                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                />

                                            </div>


                                            <div className="cart-filled-item-info">

                                                <h3>
                                                    {item.name}
                                                </h3>

                                                <p>
                                                    {item.description}
                                                </p>

                                                <strong>
                                                    {money(
                                                        item.unitPrice
                                                    )}
                                                </strong>

                                            </div>


                                            <div className="cart-filled-item-quantity">

                                                <button
                                                    onClick={() =>
                                                        change(
                                                            item.productId,
                                                            item.quantity - 1
                                                        )
                                                    }
                                                >
                                                    <FaMinus />
                                                </button>

                                                <span>
                                                    {item.quantity}
                                                </span>

                                                <button
                                                    onClick={() =>
                                                        change(
                                                            item.productId,
                                                            item.quantity + 1
                                                        )
                                                    }
                                                >
                                                    <FaPlus />
                                                </button>

                                            </div>


                                            <strong className="cart-filled-item-total">

                                                {money(
                                                    item.unitPrice *
                                                    item.quantity
                                                )}

                                            </strong>


                                            <button
                                                className="cart-filled-item-remove"
                                                onClick={() => {

                                                    removeFromCart(
                                                        item.productId
                                                    )

                                                    setItems(
                                                        getCart()
                                                    )

                                                }}
                                                aria-label="Remover"
                                            >
                                                <FaTrash />
                                            </button>

                                        </article>

                                    ))}

                                </div>


                                <div className="cart-filled-actions">

                                    <button
                                        className="cart-filled-clear"
                                        onClick={() => {

                                            clearCart()

                                            setItems([])

                                        }}
                                    >
                                        <FaTrash />
                                        Limpar carrinho
                                    </button>


                                    <Link
                                        to="/produtos"
                                        className="cart-filled-continue"
                                    >
                                        <FaArrowLeft />
                                        Continuar comprando
                                    </Link>

                                </div>

                            </div>


                            <aside className="cart-filled-sidebar">

                                <div className="cart-summary">

                                    <div className="cart-summary-title">

                                        <FaShoppingCart />

                                        <h2>
                                            Resumo
                                        </h2>

                                    </div>


                                    <div className="cart-summary-row">

                                        <span>
                                            Subtotal
                                        </span>

                                        <strong>
                                            {money(subtotal)}
                                        </strong>

                                    </div>


                                    <div className="cart-summary-delivery cart-summary-delivery-cep">
                                        <div className="cart-delivery-heading">
                                            <span>
                                                <FaMapMarkerAlt />
                                                <span>Entrega</span>
                                            </span>
                                            {deliveryFee !== null && (
                                                <strong>{money(deliveryFee)}</strong>
                                            )}
                                        </div>

                                        <div className="cart-cep-calculator">
                                            <label htmlFor="cart-cep">Digite seu CEP</label>
                                            <div className="cart-cep-input-row">
                                                <input
                                                    id="cart-cep"
                                                    value={cep}
                                                    onChange={event => {
                                                        const digits = event.target.value.replace(/\D/g, '').slice(0, 8)
                                                        setCep(digits.replace(/(\d{5})(\d)/, '$1-$2'))
                                                        setDeliveryFee(null)
                                                        setDeliveryMessage('Digite seu CEP para calcular o frete.')
                                                    }}
                                                    placeholder="00000-000"
                                                    inputMode="numeric"
                                                    autoComplete="postal-code"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={async () => {
                                                        const digits = cep.replace(/\D/g, '')
                                                        if (digits.length !== 8) {
                                                            setDeliveryMessage('Digite um CEP válido com 8 números.')
                                                            return
                                                        }
                                                        setCepLoading(true)
                                                        setDeliveryMessage('Calculando frete...')
                                                        try {
                                                            const result = await api.calculateDelivery(digits)
                                                            setDeliveryFee(Number(result.deliveryFee))
                                                            sessionStorage.setItem('acaivis_delivery_quote', JSON.stringify(result))
                                                            sessionStorage.setItem('acaivis_checkout_cep', digits)
                                                            setDeliveryMessage('Frete calculado com sucesso.')
                                                        } catch (calculateError) {
                                                            setDeliveryFee(null)
                                                            setDeliveryMessage(calculateError instanceof Error ? calculateError.message : 'Não foi possível calcular o frete.')
                                                        } finally {
                                                            setCepLoading(false)
                                                        }
                                                    }}
                                                    disabled={cepLoading}
                                                    aria-label="Calcular frete"
                                                >
                                                    {cepLoading ? '...' : <FaSearch />}
                                                </button>
                                            </div>
                                            <small className={deliveryFee !== null ? 'is-success' : ''}>
                                                {deliveryMessage}
                                            </small>
                                        </div>
                                    </div>


                                    <div className="cart-summary-divider" />


                                    <div className="cart-summary-total">

                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            {money(total)}
                                        </strong>

                                    </div>


                                    <Link
                                        to="/finalizar-pedido"
                                        className={`cart-summary-button ${deliveryFee === null ? 'is-disabled' : ''}`}
                                        onClick={event => {
                                            if (deliveryFee === null) {
                                                event.preventDefault()
                                                setDeliveryMessage('Digite seu CEP e calcule o frete antes de continuar.')
                                            }
                                        }}
                                        aria-disabled={deliveryFee === null}
                                    >
                                        {deliveryFee === null ? 'Calcule o frete' : 'Finalizar pedido'}
                                        <FaChevronRight />
                                    </Link>


                                    <div className="cart-secure">

                                        <FaShieldAlt />

                                        <div>

                                            <h3>
                                                Compra segura
                                            </h3>

                                            <p>
                                                Seus dados são usados somente para processar o pedido.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </aside>

                        </section>

                    </>

                ) : (

                    <section className="cart-empty">

                        <div className="cart-empty-content">

                            <h1>

                                Seu carrinho
                                <br />

                                <img
                                    src={estaVazioImage}
                                    alt="está vazio"
                                    className="cart-empty-title-image"
                                />

                            </h1>


                            <p>
                                Parece que você ainda não adicionou nenhum produto ao seu carrinho.
                            </p>

                            <p>
                                Que tal escolher um açaí e tornar seu dia mais saboroso?
                            </p>


                            <Link
                                to="/produtos"
                                className="cart-empty-button"
                            >
                                Ver produtos
                                <FaChevronRight />
                            </Link>

                        </div>


                        <div className="cart-empty-image">

                            <picture>

                                <source
                                    media="(max-width:792px)"
                                    srcSet={
                                        cartEmptyMobileImage
                                    }
                                />

                                <img
                                    src={cartEmptyImage}
                                    alt="Carrinho vazio"
                                />

                            </picture>

                        </div>

                    </section>

                )}


                {recommended.length > 0 && (

                    <section className="cart-recommendations">

                        <div className="cart-recommendations-heading">

                            <h2 className="cart-recommendations-title">
                                Você também pode

                                <img
                                    className="cart-recommendations-title-image"
                                    src={gostarImage}
                                    alt="gostar"
                                />
                            </h2>

                        </div>


                        <ProductsCarousel
                            products={recommended}
                        />

                    </section>

                )}

            </main>


            <Footer />

        </div>

    )
}


export default Cart