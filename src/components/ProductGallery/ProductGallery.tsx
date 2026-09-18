import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

import type { Product } from '../../types/api'
import './ProductGallery.css'
import { productImage } from '../../services/image'


interface ProductGalleryProps {
    product: Product
}


function ProductGallery({
    product
}: ProductGalleryProps) {

    const image = productImage(product.imageUrl, product.name)
    const images = [image, image, image, image, image]

    const [selectedImage, setSelectedImage] = useState(0)


    return (

        <div className="product-details-gallery">

            <div className="product-gallery-main">

                {product.badge && (
                    <span className="product-gallery-badge">
                        {product.badge}
                    </span>
                )}

                <img
                    src={images[selectedImage]}
                    alt={product.name}
                />

                <button
                    type="button"
                    className="product-gallery-zoom"
                    aria-label="Ampliar imagem do produto"
                >
                    <FaSearch />
                </button>

            </div>


            <div className="product-gallery-thumbnails">

                {images.map((image, index) => (

                    <button
                        key={`${product.id}-${index}`}
                        type="button"
                        className={
                            `product-gallery-thumbnail ${
                                selectedImage === index ? 'active' : ''
                            }`
                        }
                        onClick={() => setSelectedImage(index)}
                        aria-label={`Ver imagem ${index + 1} de ${product.name}`}
                    >

                        <img
                            src={image}
                            alt=""
                        />

                    </button>

                ))}

            </div>

        </div>

    )
}


export default ProductGallery
