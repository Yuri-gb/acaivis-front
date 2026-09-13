import { useState } from 'react'
import {
    FaHeart,
    FaRegHeart,
    FaShoppingCart,
    FaPlus,
    FaMinus
} from 'react-icons/fa'

import type { MockProduct } from '../../dev/mockProduct'
import './ProductInfo.css'


interface ProductInfoProps {
    product: MockProduct
}


interface MockCartItem {
    id: number
    productId: number
    image: string
    name: string
    description: string
    unitPrice: number
    quantity: number
}


function ProductInfo({
    product
}: ProductInfoProps) {

    const [quantity, setQuantity] = useState(1)
    const [favorite, setFavorite] = useState(false)


    const decreaseQuantity = () => {

        setQuantity((current) =>
            current <= 1
                ? 1
                : current - 1
        )

    }


    const increaseQuantity = () => {

        setQuantity((current) => current + 1)

    }


    const handleAddToCart = () => {

        const storageKey = 'acaivis_cart'

        try {

            const storedCart =
                localStorage.getItem(storageKey)

            const cart: MockCartItem[] =
                storedCart
                    ? JSON.parse(storedCart)
                    : []

            const existingItem =
                cart.find(
                    (item) =>
                        item.productId === product.id
                )

            if (existingItem) {

                existingItem.quantity += quantity

            } else {

                cart.push({
                    id: Date.now(),
                    productId: product.id,
                    image: product.image,
                    name: product.name,
                    description: product.size,
                    unitPrice: product.unitPrice,
                    quantity
                })

            }

            localStorage.setItem(
                storageKey,
                JSON.stringify(cart)
            )

        } catch (error) {

            console.error(
                'Não foi possível adicionar o produto ao carrinho.',
                error
            )

        }

    }


    return (

        <div className="product-details-info">

            <button
                type="button"
                className="product-details-favorite"
                onClick={() =>
                    setFavorite((current) => !current)
                }
                aria-label={
                    favorite
                        ? 'Remover dos favoritos'
                        : 'Adicionar aos favoritos'
                }
            >

                {favorite ? <FaHeart /> : <FaRegHeart />}

                <span>
                    Adicionar
                    <br />
                    aos favoritos
                </span>

            </button>


            <h1>
                {product.name}
            </h1>


            <span className="product-details-size">
                {product.size}
            </span>


            <div className="product-details-rating">

                <span className="product-details-rating-stars">
                    ★★★★★
                </span>

                <span className="product-details-rating-text">
                    4.9 (127 avaliações)
                </span>

            </div>


            <strong className="product-details-price">
                {product.price}
            </strong>


            <p className="product-details-description">
                {product.description}
            </p>


            <span className="product-details-quantity-label">
                Quantidade
            </span>


            <div className="product-details-quantity">

                <button
                    type="button"
                    onClick={decreaseQuantity}
                    aria-label="Diminuir quantidade"
                >
                    <FaMinus />
                </button>

                <span>
                    {quantity}
                </span>

                <button
                    type="button"
                    onClick={increaseQuantity}
                    aria-label="Aumentar quantidade"
                >
                    <FaPlus />
                </button>

            </div>


            <button
                type="button"
                className="product-details-add"
                onClick={handleAddToCart}
                disabled={!product.available}
            >

                <FaShoppingCart />

                <span>
                    {product.available
                        ? 'Adicionar ao carrinho'
                        : 'Produto indisponível'}
                </span>

            </button>

        </div>

    )
}


export default ProductInfo
