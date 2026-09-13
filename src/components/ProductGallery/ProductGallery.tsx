import { useState } from 'react'
import { FaSearch } from 'react-icons/fa'

import type { MockProduct } from '../../dev/mockProduct'
import './ProductGallery.css'


interface ProductGalleryProps {
    product: MockProduct
}


function ProductGallery({
    product
}: ProductGalleryProps) {

    const images = [
        product.image,
        product.image,
        product.image,
        product.image,
        product.image
    ]

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
