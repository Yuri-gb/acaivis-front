import './Cart.css'

import { useState } from 'react'

import {
    FaChevronRight,
    FaTrash,
    FaMinus,
    FaPlus,
    FaArrowLeft,
    FaShoppingBag,
    FaShoppingCart,
    FaMapMarkerAlt,
    FaShieldAlt,
    FaTag
} from 'react-icons/fa'

import Navbar
    from '../../components/Navbar/Navbar'

import Footer
    from '../../components/Footer/Footer'

import ProductsCarousel, {
    CarouselProduct
} from '../../components/ProductsCarousel/ProductsCarousel'

import acaiTradicional
    from '../../assets/images/products/acai-tradicional.png'

import acaiLeite
    from '../../assets/images/products/acai-leite.png'

import acaiMorango
    from '../../assets/images/products/acai-morango.png'

import cartEmptyImage
    from '../../assets/images/cart/cart-empty.png'

import cartEmptyMobileImage
    from '../../assets/images/cart/cart-empty-mobile.png'

import cartEmptyCheioImage
    from '../../assets/images/cart/cart-empty-cheio.png'

import cartEmptyCheioMobileImage
    from '../../assets/images/cart/cart-empty-cheio-mobile.png'

import estaVazioImage
    from '../../assets/images/cart/esta-vazio.png'

import gostarImage
    from '../../assets/images/cart/gostar.png'

import {
    getMockCart,
    MOCK_CART_ENABLED
} from '../../dev/mockCart'


/* ========================================
   PRODUTOS RECOMENDADOS
   ======================================== */

const recommendedProducts: CarouselProduct[] = [

    {
        id: 1,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        description: '300 ml',
        price: 'R$ 12,90'
    },

    {
        id: 2,
        image: acaiLeite,
        name: 'Açaí com Leite em Pó',
        description: '300 ml',
        price: 'R$ 14,90'
    },

    {
        id: 3,
        image: acaiMorango,
        name: 'Açaí com Morango',
        description: '300 ml',
        price: 'R$ 15,90'
    },

    {
        id: 4,
        image: acaiTradicional,
        name: 'Combo Açaívis',
        description: '2 garrafas 500 ml',
        price: 'R$ 32,90'
    }

]


/* ========================================
   FORMATAÇÃO DE PREÇO
   ======================================== */

function formatPrice(value: number) {

    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })

}


/* ========================================
   MOCK DE ENTREGA
   ======================================== */

const mockDeliveryOptions = [
    {
        id: 'centro',
        name: 'Centro',
        price: 8
    },
    {
        id: 'tomba',
        name: 'Tomba',
        price: 10
    },
    {
        id: 'brasilia',
        name: 'Brasília',
        price: 12
    },
    {
        id: 'sim',
        name: 'SIM',
        price: 15
    },
    {
        id: 'sobradinho',
        name: 'Sobradinho',
        price: 14
    }
]


/* ========================================
   PÁGINA
   ======================================== */

function Cart() {

    const [selectedDeliveryId, setSelectedDeliveryId] =
        useState('brasilia')

    const [showDeliveryOptions, setShowDeliveryOptions] =
        useState(false)

    const cartItems =
        MOCK_CART_ENABLED
            ? getMockCart()
            : []


    const hasItems =
        cartItems.length > 0


    const totalItems =
        cartItems.reduce(
            (total, item) =>
                total + item.quantity,
            0
        )


    const subtotal =
        cartItems.reduce(
            (total, item) =>
                total +
                item.unitPrice * item.quantity,
            0
        )


    const selectedDelivery =
        mockDeliveryOptions.find(
            (option) =>
                option.id === selectedDeliveryId
        ) ??
        mockDeliveryOptions[2]

    const deliveryFee =
        hasItems
            ? selectedDelivery.price
            : 0


    const total =
        subtotal + deliveryFee


    return (

        <div className="cart-page">

            <Navbar />


            <main className="cart-main">


                {/* ========================================
                   CARRINHO COM ITENS
                   ======================================== */}

                {hasItems ? (

                    <>


                        {/* ========================================
                           HERO
                           ======================================== */}

                        <section className="cart-filled-hero">

                            <div className="cart-filled-hero-breadcrumb">

                                <a href="/">
                                    Início
                                </a>

                                <FaChevronRight />

                                <span>
                                    <FaShoppingCart />
                                    Carrinho
                                </span>

                            </div>


                            <div className="cart-filled-hero-content">

                                <h1>
                                    Seu{' '}
                                    <span>
                                        carrinho
                                    </span>
                                </h1>

                                <p>
                                    Confira seus produtos e
                                    finalize seu pedido.
                                </p>

                            </div>


                            <div className="cart-filled-hero-art">

                                <picture>
                                    <source
                                        media="(max-width: 790px)"
                                        srcSet={cartEmptyCheioMobileImage}
                                    />

                                    <img
                                        src={cartEmptyCheioImage}
                                        alt="Açaívis - Mais sabor, mais momentos"
                                        className="cart-filled-hero-image"
                                    />
                                </picture>

                            </div>

                        </section>


                        {/* ========================================
                           ÁREA PRINCIPAL DO CARRINHO
                           ======================================== */}

                        <section className="cart-filled-layout">


                            {/* ========================================
                               LISTA DE PRODUTOS
                               ======================================== */}

                            <div className="cart-filled-products">


                                <div className="cart-filled-products-header">

                                    <h2>
                                        Seus produtos
                                    </h2>

                                    <span>
                                        {totalItems}{' '}
                                        {totalItems === 1
                                            ? 'item'
                                            : 'itens'
                                        }
                                    </span>

                                </div>


                                <div className="cart-filled-items">

                                    {cartItems.map((item) => {

                                        const itemTotal =
                                            item.unitPrice *
                                            item.quantity


                                        return (

                                            <article
                                                key={item.id}
                                                className="cart-filled-item"
                                            >


                                                {/* IMAGEM */}

                                                <div className="cart-filled-item-image">

                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                    />

                                                </div>


                                                {/* INFORMAÇÕES */}

                                                <div className="cart-filled-item-info">

                                                    <h3>
                                                        {item.name}
                                                    </h3>

                                                    <p>
                                                        {item.description}
                                                    </p>

                                                    <strong>
                                                        {formatPrice(item.unitPrice)}
                                                    </strong>

                                                </div>


                                                {/* QUANTIDADE */}

                                                <div className="cart-filled-item-quantity">

                                                    <button
                                                        type="button"
                                                        aria-label={`Diminuir quantidade de ${item.name}`}
                                                    >
                                                        <FaMinus />
                                                    </button>

                                                    <span>
                                                        {item.quantity}
                                                    </span>

                                                    <button
                                                        type="button"
                                                        aria-label={`Aumentar quantidade de ${item.name}`}
                                                    >
                                                        <FaPlus />
                                                    </button>

                                                </div>


                                                {/* TOTAL */}

                                                <strong className="cart-filled-item-total">
                                                    {formatPrice(itemTotal)}
                                                </strong>


                                                {/* REMOVER */}

                                                <button
                                                    type="button"
                                                    className="cart-filled-item-remove"
                                                    aria-label={`Remover ${item.name}`}
                                                >
                                                    <FaTrash />
                                                </button>

                                            </article>

                                        )

                                    })}

                                </div>


                                {/* ========================================
                                   AÇÕES
                                   ======================================== */}

                                <div className="cart-filled-actions">

                                    <button
                                        type="button"
                                        className="cart-filled-clear"
                                    >

                                        <FaTrash />

                                        <span>
                                            Limpar carrinho
                                        </span>

                                    </button>


                                    <a
                                        href="/produtos"
                                        className="cart-filled-continue"
                                    >

                                        <FaArrowLeft />

                                        <span>
                                            Continuar comprando
                                        </span>

                                    </a>

                                </div>

                            </div>


                            {/* ========================================
                               COLUNA DIREITA
                               ======================================== */}

                            <aside className="cart-filled-sidebar">


                                {/* ========================================
                                   RESUMO
                                   ======================================== */}

                                <div className="cart-summary">

                                    <div className="cart-summary-title">

                                        <FaShoppingBag />

                                        <h2>
                                            Resumo do pedido
                                        </h2>

                                    </div>


                                    <div className="cart-summary-row">

                                        <span>
                                            Subtotal ({totalItems} itens)
                                        </span>

                                        <strong>
                                            {formatPrice(subtotal)}
                                        </strong>

                                    </div>


                                    <button
                                        type="button"
                                        className="cart-summary-delivery"
                                        onClick={() =>
                                            setShowDeliveryOptions(
                                                (current) => !current
                                            )
                                        }
                                        aria-expanded={showDeliveryOptions}
                                    >

                                        <span>
                                            <FaMapMarkerAlt />
                                            <span>
                                                Taxa de entrega
                                                <small>
                                                    {selectedDelivery.name}
                                                </small>
                                            </span>
                                        </span>

                                        <strong>
                                            {formatPrice(deliveryFee)}
                                            <FaChevronRight
                                                className={
                                                    showDeliveryOptions
                                                        ? 'is-open'
                                                        : ''
                                                }
                                            />
                                        </strong>

                                    </button>


                                    {showDeliveryOptions && (

                                        <div className="cart-delivery-mock">

                                            <div className="cart-delivery-mock-header">

                                                <div>
                                                    <strong>
                                                        Onde será a entrega?
                                                    </strong>

                                                    <span>
                                                        Selecione uma região
                                                        para simular o frete.
                                                    </span>
                                                </div>

                                                <FaMapMarkerAlt />

                                            </div>


                                            <div className="cart-delivery-options">

                                                {mockDeliveryOptions.map(
                                                    (option) => (

                                                        <button
                                                            key={option.id}
                                                            type="button"
                                                            className={
                                                                `cart-delivery-option ${
                                                                    selectedDeliveryId ===
                                                                    option.id
                                                                        ? 'is-selected'
                                                                        : ''
                                                                }`
                                                            }
                                                            onClick={() => {
                                                                setSelectedDeliveryId(
                                                                    option.id
                                                                )
                                                                setShowDeliveryOptions(
                                                                    false
                                                                )
                                                            }}
                                                        >

                                                            <span>
                                                                <strong>
                                                                    {option.name}
                                                                </strong>

                                                                {selectedDeliveryId ===
                                                                    option.id && (
                                                                    <small>
                                                                        selecionado
                                                                    </small>
                                                                )}
                                                            </span>

                                                            <strong>
                                                                {formatPrice(
                                                                    option.price
                                                                )}
                                                            </strong>

                                                        </button>

                                                    )
                                                )}

                                            </div>

                                        </div>

                                    )}


                                    <button
                                        type="button"
                                        className="cart-summary-coupon"
                                    >

                                        <span>
                                            <FaTag />
                                            Cupom de desconto
                                        </span>

                                        <strong>
                                            Adicionar
                                            <FaChevronRight />
                                        </strong>

                                    </button>


                                    <div className="cart-summary-divider" />


                                    <div className="cart-summary-total">

                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            {formatPrice(total)}
                                        </strong>

                                    </div>


                                    <button
                                        type="button"
                                        className="cart-summary-button"
                                    >

                                        <span>
                                            Finalizar pedido
                                        </span>

                                        <FaChevronRight />

                                    </button>

                                </div>


                                {/* ========================================
                                   COMPRA SEGURA
                                   ======================================== */}

                                <div className="cart-secure">

                                    <FaShieldAlt />

                                    <div>

                                        <h3>
                                            Compra segura
                                        </h3>

                                        <p>
                                            Seus dados estão protegidos.
                                            Garantimos uma experiência
                                            segura e confiável.
                                        </p>

                                    </div>

                                </div>


                            </aside>

                        </section>

                    </>

                ) : (


                    /* ========================================
                       CARRINHO VAZIO
                       ======================================== */

                    <section className="cart-empty">


                        <div className="cart-empty-content">


                            {/* ========================================
                               TÍTULO
                               ======================================== */}

                            <h1>

                                Seu carrinho

                                <br />

                                <img
                                    src={estaVazioImage}
                                    alt="está vazio"
                                    className="cart-empty-title-image"
                                />

                            </h1>


                            {/* ========================================
                               DESCRIÇÃO
                               ======================================== */}

                            <p>

                                Parece que você ainda não adicionou
                                nenhum produto ao seu carrinho.

                            </p>


                            <p>

                                Que tal escolher um açaí e tornar
                                seu dia mais saboroso?

                            </p>


                            {/* ========================================
                               BOTÃO
                               ======================================== */}

                            <a
                                href="/produtos"
                                className="cart-empty-button"
                            >

                                <span>
                                    Ver produtos
                                </span>

                                <FaChevronRight />

                            </a>

                        </div>


                        {/* ========================================
                           IMAGEM
                           ======================================== */}

                        <div className="cart-empty-image">

                            <picture>

                                <source
                                    media="(max-width: 792px)"
                                    srcSet={cartEmptyMobileImage}
                                />

                                <img
                                    src={cartEmptyImage}
                                    alt="Carrinho de compras vazio"
                                />

                            </picture>

                        </div>


                    </section>

                )}


                {/* ========================================
                   RECOMENDAÇÕES
                   ======================================== */}

                <section className="cart-recommendations">


                    <div className="cart-recommendations-heading">

                        <h2>

                            Você também pode{' '}

                            <img
                                src={gostarImage}
                                alt="gostar"
                                className="cart-recommendations-title-image"
                            />

                        </h2>


                        <p>

                            Que tal adicionar mais sabor
                            ao seu pedido?

                        </p>

                    </div>


                    <ProductsCarousel
                        products={recommendedProducts}
                    />


                </section>


            </main>


            <Footer />

        </div>
    )
}


export default Cart