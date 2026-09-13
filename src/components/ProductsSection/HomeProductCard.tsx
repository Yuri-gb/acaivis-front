import './HomeProductCard.css'

import { FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'

interface HomeProductCardProps {
    image: string
    name: string
    description: string
    price: string
    productId: number
    onAdd: (productId: number) => void
}

function HomeProductCard({
    image,
    name,
    description,
    price,
    productId,
    onAdd
}: HomeProductCardProps) {

    const handleAdd = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault()
        event.stopPropagation()
        onAdd(productId)
    }

    return (
        <Link
            to={`/produtos/${productId}`}
            className="home-product-card"
        >
            <div className="home-product-card-image">
                <img
                    src={image}
                    alt={name}
                    loading="lazy"
                />
            </div>

            <div className="home-product-card-content">
                <h3>
                    {name}
                </h3>

                <p>
                    {description}
                </p>

                <div className="home-product-card-footer">
                    <strong>
                        {price}
                    </strong>

                    <button
                        type="button"
                        className="home-product-card-add"
                        onClick={handleAdd}
                        aria-label={`Adicionar ${name} ao carrinho`}
                    >
                        <FaPlus />
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default HomeProductCard