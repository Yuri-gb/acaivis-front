import './ProductCard.css'

import {
    FaHeart,
    FaShoppingCart,
    FaPlus,
    FaMinus
} from 'react-icons/fa'

import { useState } from 'react'


interface ProductCardProps {

    productId: number

    image: string

    name: string

    size: string

    description: string

    price: string

    badge?: string

    onAddToCart: (
        productId: number,
        quantity: number
    ) => void
}


function ProductCard({

    productId,

    image,

    name,

    size,

    description,

    price,

    badge,

    onAddToCart

}: ProductCardProps) {

    const [quantity, setQuantity] = useState(1)

    const [favorite, setFavorite] = useState(false)


    const decreaseQuantity = () => {

        setQuantity((current) => {

            if (current <= 1) {

                return 1

            }

            return current - 1

        })

    }


    const increaseQuantity = () => {

        setQuantity((current) => current + 1)

    }


    const toggleFavorite = () => {

        setFavorite((current) => !current)

    }


    const handleAddToCart = () => {

        onAddToCart(
            productId,
            quantity
        )

    }


    return (

        <article className="product-card">


            {/* ========================================
                IMAGEM
                ======================================== */}

            <div className="product-card-image">


                {badge && (

                    <span className="product-card-badge">

                        {badge}

                    </span>

                )}


                <button

                    type="button"

                    className={
                        `product-card-favorite ${
                            favorite ? 'active' : ''
                        }`
                    }

                    onClick={toggleFavorite}

                    aria-label={

                        favorite

                            ? `Remover ${name} dos favoritos`

                            : `Adicionar ${name} aos favoritos`

                    }

                >

                    <FaHeart />

                </button>


                <img

                    src={image}

                    alt={name}

                />

            </div>


            {/* ========================================
                CONTEÚDO
                ======================================== */}

            <div className="product-card-content">


                <h3>

                    {name}

                </h3>


                <span className="product-card-size">

                    {size}

                </span>


                <p>

                    {description}

                </p>


                {/* ========================================
                    PREÇO
                    ======================================== */}

                <strong className="product-card-price">

                    {price}

                </strong>


                {/* ========================================
                    QUANTIDADE
                    ======================================== */}

                <div className="product-card-quantity">


                    <button

                        type="button"

                        onClick={decreaseQuantity}

                        aria-label={
                            `Diminuir quantidade de ${name}`
                        }

                    >

                        <FaMinus />

                    </button>


                    <span>

                        {quantity}

                    </span>


                    <button

                        type="button"

                        onClick={increaseQuantity}

                        aria-label={
                            `Aumentar quantidade de ${name}`
                        }

                    >

                        <FaPlus />

                    </button>


                </div>


                {/* ========================================
                    ADICIONAR
                    ======================================== */}

                <button

                    type="button"

                    className="product-card-add"

                    onClick={handleAddToCart}

                >

                    <FaShoppingCart />

                    <span>

                        Adicionar

                    </span>

                </button>


            </div>

        </article>

    )

}


export default ProductCard