import { useEffect, useMemo, useState } from 'react'
import './Products.css'

import Navbar from '../../components/Navbar/Navbar'
import ProductsBanner from '../../components/ProductsBanner/ProductsBanner'
import ProductsToolbar from '../../components/ProductsToolbar/ProductsToolbar'
import ProductsFilters from '../../components/ProductsFilters/ProductsFilters'
import ProductCard from '../../components/ProductCard/ProductCard'
import ProductsPagination from '../../components/ProductsPagination/ProductsPagination'
import Footer from '../../components/Footer/Footer'

import { api } from '../../services/api'
import { productImage } from '../../services/image'
import { addToCart } from '../../services/cart'
import type { Product } from '../../types/api'

function Products() {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [currentPage, setCurrentPage] = useState(1)
    const [search, setSearch] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('Todos')
    const [selectedSizes, setSelectedSizes] = useState<string[]>([])
    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(40)
    const [showOnlyAvailable, setShowOnlyAvailable] = useState(true)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [sortOption, setSortOption] = useState<
        'best-selling' | 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'
    >('best-selling')
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const productsPerPage = 12

    useEffect(() => {
        api.availableProducts
            .then(productData => {
                setProducts(productData)
            })
            .catch((err: Error) => setError(err.message))
            .finally(() => setLoading(false))
    }, [])

    const filteredProducts = useMemo(() => {
        const searchTerm = search.trim().toLowerCase()

        return products.filter((product) => {
            const matchesSearch =
                !searchTerm ||
                `${product.name} ${product.size} ${product.description}`
                    .toLowerCase()
                    .includes(searchTerm)

            const matchesCategory =
                selectedCategory === 'Todos' ||
                (selectedCategory === 'Açaís Tradicionais' &&
                    product.name === 'Açaí Tradicional') ||
                (selectedCategory === 'Açaís Premium' &&
                    (product.name === 'Açaí com Leite' ||
                        product.name === 'Açaí com Morango')) ||
                (selectedCategory === 'Combos' &&
                    (product.categoryName === 'Combos' ||
                        product.name.startsWith('Combo')))

            const matchesSize =
                selectedSizes.length === 0 ||
                selectedSizes.includes(product.size)

            const price = Number(product.price)

            const matchesPrice = price >= minPrice && price <= maxPrice

            const matchesAvailability =
                !showOnlyAvailable || product.available

            return (
                matchesSearch &&
                matchesCategory &&
                matchesSize &&
                matchesPrice &&
                matchesAvailability
            )
        })
    }, [
        products,
        search,
        selectedCategory,
        selectedSizes,
        minPrice,
        maxPrice,
        showOnlyAvailable,
    ])

    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts]

        switch (sortOption) {
            case 'newest':
                return sorted.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                )

            case 'price-asc':
                return sorted.sort(
                    (a, b) => Number(a.price) - Number(b.price)
                )

            case 'price-desc':
                return sorted.sort(
                    (a, b) => Number(b.price) - Number(a.price)
                )

            case 'name-asc':
                return sorted.sort((a, b) =>
                    a.name.localeCompare(b.name, 'pt-BR')
                )

            case 'name-desc':
                return sorted.sort((a, b) =>
                    b.name.localeCompare(a.name, 'pt-BR')
                )

            case 'best-selling':
            default:
                return sorted
        }
    }, [filteredProducts, sortOption])

    const categoryCounts = useMemo(() => {
        const searchTerm = search.trim().toLowerCase()

        const searchProducts = products.filter((product) => {
            if (!searchTerm) return true

            return `${product.name} ${product.size} ${product.description}`
                .toLowerCase()
                .includes(searchTerm)
        })

        return {
            todos: searchProducts.length,
            tradicionais: searchProducts.filter(
                (product) => product.name === 'Açaí Tradicional'
            ).length,
            premium: searchProducts.filter(
                (product) =>
                    product.name === 'Açaí com Leite' ||
                    product.name === 'Açaí com Morango'
            ).length,
            combos: searchProducts.filter(
                (product) =>
                    product.categoryName === 'Combos' ||
                    product.name.startsWith('Combo')
            ).length,
            adicionais: 0,
        }
    }, [products, search])

    const sizeCounts = useMemo(
        () => ({
            '300 ml': products.filter(
                (product) => product.size === '300 ml'
            ).length,
            '500 ml': products.filter(
                (product) => product.size === '500 ml'
            ).length,
            '2 garrafas': products.filter(
                (product) => product.size.startsWith('2 garrafas')
            ).length,
        }),
        [products]
    )

    const totalPages = Math.max(
        1,
        Math.ceil(sortedProducts.length / productsPerPage)
    )

    const currentProducts = sortedProducts.slice(
        (currentPage - 1) * productsPerPage,
        currentPage * productsPerPage
    )

    useEffect(() => {
        setCurrentPage(1)
    }, [
        search,
        selectedCategory,
        selectedSizes,
        minPrice,
        maxPrice,
        showOnlyAvailable,
        sortOption,
    ])

    const handleSearchChange = (value: string) => {
        setSearch(value)
        setCurrentPage(1)
    }

    const handleSortChange = (
        option: typeof sortOption
    ) => {
        setSortOption(option)
        setCurrentPage(1)
    }

    const handleCategoryChange = (category: string) => {
        setSelectedCategory(category)
        setCurrentPage(1)
    }

    const handleSizeChange = (size: string) => {
        setSelectedSizes((current) =>
            current.includes(size)
                ? current.filter((item) => item !== size)
                : [...current, size]
        )
        setCurrentPage(1)
    }

    const money = (value: number) =>
        value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        })

    const handleAddToCart = (productId: number, quantity: number) => {
        const product = products.find((item) => item.id === productId)

        if (!product || !product.available) return

        addToCart({
            productId: product.id,
            image: productImage(product.imageUrl, product.name),
            name: product.name,
            description: product.size,
            unitPrice: Number(product.price),
            quantity,
        })
    }

    return (
        <>
            <Navbar />

            <main className="products-page">
                <ProductsBanner />

                <ProductsToolbar
                    search={search}
                    onSearchChange={handleSearchChange}
                    onOpenFilters={() => setIsFiltersOpen(true)}
                    sortOption={sortOption}
                    onSortChange={handleSortChange}
                    viewMode={viewMode}
                    onViewModeChange={setViewMode}
                />

                <section className="products-catalog">
                    <ProductsFilters
                        selectedCategory={selectedCategory}
                        onCategoryChange={handleCategoryChange}
                        categoryCounts={categoryCounts}
                        selectedSizes={selectedSizes}
                        onSizeChange={handleSizeChange}
                        sizeCounts={sizeCounts}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        onMinPriceChange={(value) => {
                            setMinPrice(value)
                            setCurrentPage(1)
                        }}
                        onMaxPriceChange={(value) => {
                            setMaxPrice(value)
                            setCurrentPage(1)
                        }}
                        showOnlyAvailable={showOnlyAvailable}
                        onAvailabilityChange={(value) => {
                            setShowOnlyAvailable(value)
                            setCurrentPage(1)
                        }}
                        isMobileOpen={isFiltersOpen}
                        onMobileClose={() => setIsFiltersOpen(false)}
                    />

                    <div
                        className={`products-grid ${
                            viewMode === 'list' ? 'list-view' : ''
                        }`}
                    >
                        {loading ? (
                            <div className="products-loading">
                                Carregando produtos...
                            </div>
                        ) : error ? (
                            <div className="products-loading">
                                {error}
                            </div>
                        ) : currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    productId={product.id}
                                    image={productImage(
                                        product.imageUrl,
                                        product.name
                                    )}
                                    name={product.name}
                                    size={product.size}
                                    description={product.description}
                                    price={money(Number(product.price))}
                                    badge={
                                        product.badge || undefined
                                    }
                                    onAddToCart={handleAddToCart}
                                />
                            ))
                        ) : (
                            <div className="products-empty">
                                <h2>Nenhum produto encontrado</h2>
                                <p>
                                    Tente buscar por outro nome ou produto.
                                </p>
                            </div>
                        )}
                    </div>

                    {!loading &&
                        !error &&
                        currentProducts.length > 0 && (
                            <ProductsPagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalProducts={sortedProducts.length}
                                productsPerPage={productsPerPage}
                                onPageChange={setCurrentPage}
                            />
                        )}
                </section>
            </main>

            <Footer />
        </>
    )
}

export default Products
