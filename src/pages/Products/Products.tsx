import { useMemo, useState } from 'react'

import './Products.css'

import Navbar
    from '../../components/Navbar/Navbar'

import ProductsBanner
    from '../../components/ProductsBanner/ProductsBanner'

import ProductsToolbar
    from '../../components/ProductsToolbar/ProductsToolbar'

import ProductsFilters
    from '../../components/ProductsFilters/ProductsFilters'

import ProductCard
    from '../../components/ProductCard/ProductCard'

import ProductsPagination
    from '../../components/ProductsPagination/ProductsPagination'

import Footer
    from '../../components/Footer/Footer'

import acaiTradicional
    from '../../assets/images/products/acai-tradicional.png'

import acaiLeite
    from '../../assets/images/products/acai-leite.png'

import acaiMorango
    from '../../assets/images/products/acai-morango.png'


/* ========================================
   PRODUTO
   ======================================== */

interface Product {

    id: number

    image: string

    name: string

    size: string

    description: string

    price: string

    badge?: string

    available: boolean
}


/* ========================================
   PRODUTOS
   ======================================== */

const products: Product[] = [

    {
        id: 1,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '500 ml',
        description:
            'Açaí cremoso e geladinho, perfeito para qualquer momento.',
        price: 'R$ 18,90',
        badge: 'MAIS VENDIDO',
        available: true
    },

    {
        id: 2,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '500 ml',
        description:
            'Açaí cremoso combinado com leite para deixar tudo ainda mais gostoso.',
        price: 'R$ 20,90',
        badge: 'QUERIDINHO',
        available: true
    },

    {
        id: 3,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '500 ml',
        description:
            'Açaí geladinho com morangos para uma combinação irresistível.',
        price: 'R$ 22,90',
        badge: 'PREMIUM',
        available: true
    },

    {
        id: 4,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '500 ml',
        description:
            'Açaí cremoso e geladinho, perfeito para qualquer momento.',
        price: 'R$ 18,90',
        badge: 'MAIS VENDIDO',
        available: true
    },

    {
        id: 5,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '500 ml',
        description:
            'Açaí cremoso combinado com leite para deixar tudo ainda mais gostoso.',
        price: 'R$ 20,90',
        badge: 'QUERIDINHO',
        available: true
    },

    {
        id: 6,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '500 ml',
        description:
            'Açaí geladinho com morangos para uma combinação irresistível.',
        price: 'R$ 22,90',
        badge: 'PREMIUM',
        available: false
    },

    {
        id: 7,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '500 ml',
        description:
            'Açaí cremoso e geladinho, perfeito para qualquer momento.',
        price: 'R$ 18,90',
        badge: 'MAIS VENDIDO',
        available: true
    },

    {
        id: 8,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '500 ml',
        description:
            'Açaí cremoso combinado com leite para deixar tudo ainda mais gostoso.',
        price: 'R$ 20,90',
        badge: 'QUERIDINHO',
        available: true
    },

    {
        id: 9,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '500 ml',
        description:
            'Açaí geladinho com morangos para uma combinação irresistível.',
        price: 'R$ 22,90',
        badge: 'PREMIUM',
        available: true
    },

    {
        id: 10,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '500 ml',
        description:
            'Açaí cremoso e geladinho, perfeito para qualquer momento.',
        price: 'R$ 18,90',
        badge: 'MAIS VENDIDO',
        available: true
    },

    {
        id: 11,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '500 ml',
        description:
            'Açaí cremoso combinado com leite para deixar tudo ainda mais gostoso.',
        price: 'R$ 20,90',
        badge: 'QUERIDINHO',
        available: true
    },

    {
        id: 12,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '500 ml',
        description:
            'Açaí geladinho com morangos para uma combinação irresistível.',
        price: 'R$ 22,90',
        badge: 'PREMIUM',
        available: true
    },

    {
        id: 13,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '500 ml',
        description:
            'Açaí cremoso e geladinho, perfeito para qualquer momento.',
        price: 'R$ 18,90',
        badge: 'MAIS VENDIDO',
        available: true
    },

    {
        id: 14,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '500 ml',
        description:
            'Açaí cremoso combinado com leite para deixar tudo ainda mais gostoso.',
        price: 'R$ 20,90',
        badge: 'QUERIDINHO',
        available: false
    },

    {
        id: 15,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '500 ml',
        description:
            'Açaí geladinho com morangos para uma combinação irresistível.',
        price: 'R$ 22,90',
        badge: 'PREMIUM',
        available: true
    },

    {
        id: 16,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '500 ml',
        description:
            'Açaí cremoso e geladinho, perfeito para qualquer momento.',
        price: 'R$ 18,90',
        badge: 'MAIS VENDIDO',
        available: true
    },

    {
        id: 17,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '500 ml',
        description:
            'Açaí cremoso combinado com leite para deixar tudo ainda mais gostoso.',
        price: 'R$ 20,90',
        badge: 'QUERIDINHO',
        available: true
    },

    {
        id: 18,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '500 ml',
        description:
            'Açaí geladinho com morangos para uma combinação irresistível.',
        price: 'R$ 22,90',
        badge: 'PREMIUM',
        available: true
    },

    {
        id: 19,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '500 ml',
        description:
            'Açaí cremoso e geladinho, perfeito para qualquer momento.',
        price: 'R$ 18,90',
        badge: 'MAIS VENDIDO',
        available: true
    },

    {
        id: 20,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '500 ml',
        description:
            'Açaí cremoso combinado com leite para deixar tudo ainda mais gostoso.',
        price: 'R$ 20,90',
        badge: 'QUERIDINHO',
        available: true
    },

    {
        id: 21,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '500 ml',
        description:
            'Açaí geladinho com morangos para uma combinação irresistível.',
        price: 'R$ 22,90',
        badge: 'PREMIUM',
        available: true
    },

    {
        id: 22,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '500 ml',
        description:
            'Açaí cremoso e geladinho, perfeito para qualquer momento.',
        price: 'R$ 18,90',
        badge: 'MAIS VENDIDO',
        available: true
    },

    {
        id: 23,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '500 ml',
        description:
            'Açaí cremoso combinado com leite para deixar tudo ainda mais gostoso.',
        price: 'R$ 20,90',
        badge: 'QUERIDINHO',
        available: true
    },

    {
        id: 24,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '500 ml',
        description:
            'Açaí geladinho com morangos para uma combinação irresistível.',
        price: 'R$ 22,90',
        badge: 'PREMIUM',
        available: true
    },

    {
        id: 25,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '500 ml',
        description:
            'Açaí cremoso e geladinho, perfeito para qualquer momento.',
        price: 'R$ 18,90',
        badge: 'MAIS VENDIDO',
        available: true
    },

    {
        id: 26,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '500 ml',
        description:
            'Açaí cremoso combinado com leite para deixar tudo ainda mais gostoso.',
        price: 'R$ 20,90',
        badge: 'QUERIDINHO',
        available: true
    },

    {
        id: 27,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '500 ml',
        description:
            'Açaí geladinho com morangos para uma combinação irresistível.',
        price: 'R$ 22,90',
        badge: 'PREMIUM',
        available: false
    },

    {
        id: 28,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '500 ml',
        description:
            'Açaí cremoso e geladinho, perfeito para qualquer momento.',
        price: 'R$ 18,90',
        badge: 'MAIS VENDIDO',
        available: true
    },

    {
        id: 29,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '500 ml',
        description:
            'Açaí cremoso combinado com leite para deixar tudo ainda mais gostoso.',
        price: 'R$ 20,90',
        badge: 'QUERIDINHO',
        available: true
    },

    {
        id: 30,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '500 ml',
        description:
            'Açaí geladinho com morangos para uma combinação irresistível.',
        price: 'R$ 22,90',
        badge: 'PREMIUM',
        available: true
    },

    {
        id: 31,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '500 ml',
        description:
            'Açaí cremoso e geladinho, perfeito para qualquer momento.',
        price: 'R$ 18,90',
        badge: 'MAIS VENDIDO',
        available: true
    },

    {
        id: 32,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '500 ml',
        description:
            'Açaí cremoso combinado com leite para deixar tudo ainda mais gostoso.',
        price: 'R$ 20,90',
        badge: 'QUERIDINHO',
        available: true
    },

    {
        id: 33,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '500 ml',
        description:
            'Açaí geladinho com morangos para uma combinação irresistível.',
        price: 'R$ 22,90',
        badge: 'PREMIUM',
        available: true
    },

    {
        id: 34,
        image: acaiTradicional,
        name: 'Açaí Tradicional',
        size: '500 ml',
        description:
            'Açaí cremoso e geladinho, perfeito para qualquer momento.',
        price: 'R$ 18,90',
        badge: 'MAIS VENDIDO',
        available: true
    },

    {
        id: 35,
        image: acaiLeite,
        name: 'Açaí com Leite',
        size: '500 ml',
        description:
            'Açaí cremoso combinado com leite para deixar tudo ainda mais gostoso.',
        price: 'R$ 20,90',
        badge: 'QUERIDINHO',
        available: false
    },

    {
        id: 36,
        image: acaiMorango,
        name: 'Açaí com Morango',
        size: '500 ml',
        description:
            'Açaí geladinho com morangos para uma combinação irresistível.',
        price: 'R$ 22,90',
        badge: 'PREMIUM',
        available: true
    }

]


/* ========================================
   PÁGINA DE PRODUTOS
   ======================================== */

function Products() {

    /* ========================================
       ESTADOS
       ======================================== */

    const [
        currentPage,
        setCurrentPage
    ] = useState(1)


    const [
        search,
        setSearch
    ] = useState('')


    const [
        selectedCategory,
        setSelectedCategory
    ] = useState('Todos')


    const [
        selectedSizes,
        setSelectedSizes
    ] = useState<string[]>([])


    const [
        minPrice,
        setMinPrice
    ] = useState(0)


    const [
        maxPrice,
        setMaxPrice
    ] = useState(40)


    const [
        showOnlyAvailable,
        setShowOnlyAvailable
    ] = useState(true)


    /* ========================================
       FILTROS MOBILE
       ======================================== */

    const [
        isFiltersOpen,
        setIsFiltersOpen
    ] = useState(false)


    const productsPerPage = 12


    /* ========================================
       BUSCA + CATEGORIA + TAMANHO
       ======================================== */

    const filteredProducts = useMemo(() => {

        const searchTerm =
            search
                .trim()
                .toLowerCase()


        return products.filter((product) => {

            /* ========================================
               BUSCA
               ======================================== */

            const matchesSearch =
                !searchTerm ||
                product.name
                    .toLowerCase()
                    .includes(searchTerm) ||
                product.size
                    .toLowerCase()
                    .includes(searchTerm) ||
                product.description
                    .toLowerCase()
                    .includes(searchTerm)


            /* ========================================
               CATEGORIA
               ======================================== */

            const matchesCategory =
                selectedCategory === 'Todos' ||

                (
                    selectedCategory === 'Açaís Tradicionais' &&
                    product.name === 'Açaí Tradicional'
                ) ||

                (
                    selectedCategory === 'Açaís Premium' &&
                    (
                        product.name === 'Açaí com Leite' ||
                        product.name === 'Açaí com Morango'
                    )
                )


            /* ========================================
               TAMANHO
               ======================================== */

            const matchesSize =
                selectedSizes.length === 0 ||
                selectedSizes.includes(product.size)


            const productPrice =
                Number(
                    product.price
                        .replace('R$', '')
                        .replace('.', '')
                        .replace(',', '.')
                        .trim()
                )


            const matchesPrice =
                productPrice >= minPrice &&
                productPrice <= maxPrice


            const matchesAvailability =
                !showOnlyAvailable ||
                product.available


            return (
                matchesSearch &&
                matchesCategory &&
                matchesSize &&
                matchesPrice &&
                matchesAvailability
            )

        })

    }, [
        search,
        selectedCategory,
        selectedSizes,
        minPrice,
        maxPrice,
        showOnlyAvailable
    ])


    /* ========================================
       CONTADORES DAS CATEGORIAS
       ======================================== */

    const categoryCounts = useMemo(() => {

        const searchTerm =
            search
                .trim()
                .toLowerCase()


        const searchProducts =
            products.filter((product) => {

                if (!searchTerm) {
                    return true
                }


                return (
                    product.name
                        .toLowerCase()
                        .includes(searchTerm) ||

                    product.size
                        .toLowerCase()
                        .includes(searchTerm) ||

                    product.description
                        .toLowerCase()
                        .includes(searchTerm)
                )

            })


        return {

            todos:
                searchProducts.length,


            tradicionais:
                searchProducts.filter(
                    (product) =>
                        product.name ===
                        'Açaí Tradicional'
                ).length,


            premium:
                searchProducts.filter(
                    (product) =>
                        product.name ===
                            'Açaí com Leite' ||

                        product.name ===
                            'Açaí com Morango'
                ).length,


            combos: 0,


            adicionais: 0

        }

    }, [
        search
    ])


    /* ========================================
       CONTADORES DOS TAMANHOS
       ======================================== */

    const sizeCounts = useMemo(() => {

        return {

            '300 ml':
                products.filter(
                    (product) =>
                        product.size === '300 ml'
                ).length,


            '500 ml':
                products.filter(
                    (product) =>
                        product.size === '500 ml'
                ).length,


            '2 garrafas':
                products.filter(
                    (product) =>
                        product.size === '2 garrafas'
                ).length

        }

    }, [])


    /* ========================================
       PAGINAÇÃO
       ======================================== */

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredProducts.length /
                productsPerPage
            )
        )


    const firstProductIndex =
        (currentPage - 1) *
        productsPerPage


    const currentProducts =
        filteredProducts.slice(
            firstProductIndex,
            firstProductIndex +
            productsPerPage
        )


    /* ========================================
       ALTERAR BUSCA
       ======================================== */

    const handleSearchChange = (
        value: string
    ) => {

        setSearch(value)

        setCurrentPage(1)

    }


    /* ========================================
       ALTERAR CATEGORIA
       ======================================== */

    const handleCategoryChange = (
        category: string
    ) => {

        setSelectedCategory(category)

        setCurrentPage(1)

    }


    /* ========================================
       ALTERAR TAMANHO
       ======================================== */

    const handleSizeChange = (
        size: string
    ) => {

        setSelectedSizes((currentSizes) => {

            if (currentSizes.includes(size)) {

                return currentSizes.filter(
                    (currentSize) =>
                        currentSize !== size
                )

            }


            return [
                ...currentSizes,
                size
            ]

        })


        setCurrentPage(1)

    }


    /* ========================================
       RENDER
       ======================================== */

    return (

        <>

            <Navbar />


            <main className="products-page">

                <ProductsBanner />


                <ProductsToolbar
                    search={search}
                    onSearchChange={handleSearchChange}
                    onOpenFilters={() =>
                        setIsFiltersOpen(true)
                    }
                />


                <section className="products-catalog">

                    <ProductsFilters

                        selectedCategory={
                            selectedCategory
                        }

                        onCategoryChange={
                            handleCategoryChange
                        }

                        categoryCounts={
                            categoryCounts
                        }

                        selectedSizes={
                            selectedSizes
                        }

                        onSizeChange={
                            handleSizeChange
                        }

                        sizeCounts={
                            sizeCounts
                        }

                        minPrice={
                            minPrice
                        }

                        maxPrice={
                            maxPrice
                        }

                        onMinPriceChange={
                            (value) => {
                                setMinPrice(value)
                                setCurrentPage(1)
                            }
                        }

                        onMaxPriceChange={
                            (value) => {
                                setMaxPrice(value)
                                setCurrentPage(1)
                            }
                        }

                        showOnlyAvailable={
                            showOnlyAvailable
                        }

                        onAvailabilityChange={
                            (value) => {
                                setShowOnlyAvailable(value)
                                setCurrentPage(1)
                            }
                        }

                        isMobileOpen={
                            isFiltersOpen
                        }

                        onMobileClose={() =>
                            setIsFiltersOpen(false)
                        }

                    />


                    <div className="products-grid">

                        {currentProducts.length > 0 ? (

                            currentProducts.map(
                                (product) => (

                                    <ProductCard
                                        key={product.id}
                                        image={product.image}
                                        name={product.name}
                                        size={product.size}
                                        description={
                                            product.description
                                        }
                                        price={product.price}
                                        badge={product.badge}
                                    />

                                )
                            )

                        ) : (

                            <div className="products-empty">

                                <h2>
                                    Nenhum produto encontrado
                                </h2>

                                <p>
                                    Tente buscar por outro nome ou produto.
                                </p>

                            </div>

                        )}

                    </div>


                    {/* ========================================
                        PAGINAÇÃO
                        ======================================== */}

                    {filteredProducts.length > 0 && (

                        <ProductsPagination
                            currentPage={
                                currentPage
                            }

                            totalPages={
                                totalPages
                            }

                            totalProducts={
                                filteredProducts.length
                            }

                            productsPerPage={
                                productsPerPage
                            }

                            onPageChange={
                                setCurrentPage
                            }
                        />

                    )}

                </section>

            </main>


            <Footer />

        </>

    )
}


export default Products