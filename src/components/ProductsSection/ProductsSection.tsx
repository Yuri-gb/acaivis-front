import './ProductsSection.css'
import { useEffect, useState } from 'react'
import ProductsCarousel, { CarouselProduct } from '../ProductsCarousel/ProductsCarousel'
import { api } from '../../services/api'
import { productImage } from '../../services/image'

function ProductsSection() {
    const [products,setProducts]=useState<CarouselProduct[]>([])
    useEffect(()=>{ api.availableProducts.then(data=>setProducts(data.slice(0,6).map(p=>({id:p.id,image:productImage(p.imageUrl,p.name),name:p.name,description:p.description,price:p.price.toLocaleString('pt-BR',{style:'currency',currency:'BRL'})})))).catch(console.error) },[])
    return <section className="products-section" id="produtos"><div className="products-section-header"><div><span className="products-section-label">NOSSOS PRODUTOS</span><h2>Açaí na garrafinha</h2><p>Praticidade, sabor e aquele toque especial da Açaívis.</p></div></div><ProductsCarousel products={products}/></section>
}
export default ProductsSection
