import { useState } from 'react'
import {
    FaHeart,
    FaRegHeart,
    FaShoppingCart,
    FaPlus,
    FaMinus
} from 'react-icons/fa'

import type { Product } from '../../types/api'
import { addToCart } from '../../services/cart'
import { productImage } from '../../services/image'
import './ProductInfo.css'


interface ProductInfoProps {
    product: Product
}


const money = (value: number) =>
    value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })


function ProductInfo({
    product
}: ProductInfoProps) {

    const [quantity, setQuantity] = useState(1)
    const [favorite, setFavorite] = useState(false)
    const [added, setAdded] = useState(false)


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
        addToCart({
            productId: product.id,
            image: productImage(product.imageUrl, product.name),
            name: product.name,
            description: product.size,
            unitPrice: Number(product.price),
            quantity
        })

        setAdded(true)

        window.setTimeout(() => {
            setAdded(false)
        }, 1800)
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
                {money(Number(product.price))}
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
                        ? (added
                            ? 'Adicionado!'
                            : 'Adicionar ao carrinho')
                        : 'Produto indisponível'}
                </span>

            </button>

        </div>

    )
}


export default ProductInfo
