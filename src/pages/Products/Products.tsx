import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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

import {
    mockProducts
} from '../../dev/mockProduct'


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

const products: Product[] = mockProducts


/* ========================================
   PÁGINA DE PRODUTOS
   ======================================== */

function Products() {

    const navigate = useNavigate()

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


    const [
        viewMode,
        setViewMode
    ] = useState<'grid' | 'list'>('grid')


    const [
        sortOption,
        setSortOption
    ] = useState<
        'best-selling' |
        'newest' |
        'price-asc' |
        'price-desc' |
        'name-asc' |
        'name-desc'
    >('best-selling')


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
       ORDENAÇÃO
       ======================================== */

    const sortedProducts = useMemo(() => {

        const sorted = [
            ...filteredProducts
        ]

        switch (sortOption) {

            case 'newest':
                return sorted.sort(
                    (a, b) => b.id - a.id
                )

            case 'price-asc':
                return sorted.sort(
                    (a, b) =>
                        Number(
                            a.price
                                .replace('R$', '')
                                .replace('.', '')
                                .replace(',', '.')
                                .trim()
                        ) -
                        Number(
                            b.price
                                .replace('R$', '')
                                .replace('.', '')
                                .replace(',', '.')
                                .trim()
                        )
                )

            case 'price-desc':
                return sorted.sort(
                    (a, b) =>
                        Number(
                            b.price
                                .replace('R$', '')
                                .replace('.', '')
                                .replace(',', '.')
                                .trim()
                        ) -
                        Number(
                            a.price
                                .replace('R$', '')
                                .replace('.', '')
                                .replace(',', '.')
                                .trim()
                        )
                )

            case 'name-asc':
                return sorted.sort(
                    (a, b) =>
                        a.name.localeCompare(
                            b.name,
                            'pt-BR'
                        )
                )

            case 'name-desc':
                return sorted.sort(
                    (a, b) =>
                        b.name.localeCompare(
                            a.name,
                            'pt-BR'
                        )
                )

            case 'best-selling':
            default:
                return sorted

        }

    }, [
        filteredProducts,
        sortOption
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


            combos:
                searchProducts.filter(
                    (product) =>
                        product.name.startsWith('Combo')
                ).length,


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
                        product.size.startsWith('2 garrafas')
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
                sortedProducts.length /
                productsPerPage
            )
        )


    const firstProductIndex =
        (currentPage - 1) *
        productsPerPage


    const currentProducts =
        sortedProducts.slice(
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
       ALTERAR ORDENAÇÃO
       ======================================== */

    const handleSortChange = (
        option: typeof sortOption
    ) => {

        setSortOption(option)

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
       ABRIR DETALHES DO PRODUTO
       ======================================== */

    const handleProductClick = (
        productId: number
    ) => {

        navigate(`/produtos/${productId}`)

    }


    /* ========================================
       ADICIONAR AO CARRINHO
       ======================================== */

    const handleAddToCart = (
        productId: number,
        quantity: number
    ) => {

        const product = products.find(
            (item) => item.id === productId
        )

        if (!product || !product.available) {
            return
        }

        const productPrice =
            Number(
                product.price
                    .replace('R$', '')
                    .replace('.', '')
                    .replace(',', '.')
                    .trim()
            )

        const currentCart = JSON.parse(
            localStorage.getItem('acaivis_cart') || '[]'
        )

        const existingItemIndex =
            currentCart.findIndex(
                (item: {
                    productId: number
                }) => item.productId === productId
            )

        if (existingItemIndex >= 0) {

            currentCart[existingItemIndex].quantity +=
                quantity

        } else {

            currentCart.push({
                id: Date.now(),
                productId: product.id,
                image: product.image,
                name: product.name,
                description: product.size,
                unitPrice: productPrice,
                quantity
            })

        }

        localStorage.setItem(
            'acaivis_cart',
            JSON.stringify(currentCart)
        )
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
                    sortOption={sortOption}
                    onSortChange={handleSortChange}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
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


                    <div className={`products-grid ${
                        viewMode === 'list' ? 'list-view' : ''
                    }`}>

                        {currentProducts.length > 0 ? (

                            currentProducts.map(
                                (product) => (

                                    <div
                                        key={product.id}
                                        onClick={(event) => {
                                            const target =
                                                event.target as HTMLElement

                                            if (
                                                target.closest(
                                                    'button, a, input, select, textarea'
                                                )
                                            ) {
                                                return
                                            }

                                            handleProductClick(product.id)
                                        }}
                                        role="link"
                                        tabIndex={0}
                                        onKeyDown={(event) => {
                                            if (
                                                event.key === 'Enter' ||
                                                event.key === ' '
                                            ) {
                                                event.preventDefault()
                                                handleProductClick(product.id)
                                            }
                                        }}
                                    >
                                        <ProductCard
                                            productId={product.id}
                                            image={product.image}
                                        name={product.name}
                                        size={product.size}
                                        description={
                                            product.description
                                        }
                                        price={product.price}
                                        badge={product.badge}
                                            onAddToCart={
                                                handleAddToCart
                                            }
                                        />
                                    </div>

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