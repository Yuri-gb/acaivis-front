import './ProductsFilters.css'

import {
    FaCrown,
    FaLeaf,
    FaSnowflake,
    FaDollarSign,
    FaBoxOpen,
    FaChevronUp,
    FaChevronDown,
    FaTimes,
    FaTrash
} from 'react-icons/fa'

import mascotImage
    from '../../assets/images/products/acaivis-mascote-card.png'


/* ========================================
   PROPS
   ======================================== */

interface ProductsFiltersProps {

    selectedCategory: string

    onCategoryChange: (
        category: string
    ) => void

    categoryCounts: {
        todos: number
        tradicionais: number
        premium: number
        combos: number
        adicionais: number
    }

    selectedSizes: string[]

    onSizeChange: (
        size: string
    ) => void

    sizeCounts: {
        '300 ml': number
        '500 ml': number
        '2 garrafas': number
    }

    minPrice: number

    maxPrice: number

    onMinPriceChange: (
        value: number
    ) => void

    onMaxPriceChange: (
        value: number
    ) => void

    showOnlyAvailable: boolean

    onAvailabilityChange: (
        value: boolean
    ) => void

    isMobileOpen?: boolean

    onMobileClose?: () => void
}


/* ========================================
   COMPONENTE
   ======================================== */

function ProductsFilters({

    selectedCategory,

    onCategoryChange,

    categoryCounts,

    selectedSizes,

    onSizeChange,

    sizeCounts,

    minPrice,

    maxPrice,

    onMinPriceChange,

    onMaxPriceChange,

    showOnlyAvailable,

    onAvailabilityChange,

    isMobileOpen = false,

    onMobileClose

}: ProductsFiltersProps) {


    /* ========================================
       LIMPAR FILTROS
       ======================================== */

    const handleClearFilters = () => {

        onCategoryChange('Todos')

        selectedSizes.forEach((size) => {
            onSizeChange(size)
        })

        onMinPriceChange(0)

        onMaxPriceChange(40)

        onAvailabilityChange(true)
    }


    /* ========================================
       FECHAR MOBILE
       ======================================== */

    const handleMobileClose = () => {

        if (onMobileClose) {
            onMobileClose()
        }
    }


    return (
        <>

            {/* ========================================
               OVERLAY MOBILE
               ======================================== */}

            <div
                className={
                    `products-filters-overlay ${
                        isMobileOpen
                            ? 'active'
                            : ''
                    }`
                }
                onClick={handleMobileClose}
            >
            </div>


            {/* ========================================
               PAINEL
               ======================================== */}

            <aside
                className={
                    `products-filters ${
                        isMobileOpen
                            ? 'mobile-open'
                            : ''
                    }`
                }
            >

                {/* ========================================
                   CABEÇALHO MOBILE
                   ======================================== */}

                <div className="products-filters-mobile-header">

                    <div className="products-filters-mobile-handle">
                    </div>

                    <div className="products-filters-mobile-title">

                        <div>

                            <h2>
                                Filtros
                            </h2>

                            <p>
                                Escolha os filtros para encontrar seu açaí ideal.
                            </p>

                        </div>

                        <button
                            type="button"
                            className="products-filters-mobile-clear"
                            onClick={handleClearFilters}
                        >
                            Limpar tudo
                        </button>

                    </div>

                    <button
                        type="button"
                        className="products-filters-mobile-close"
                        onClick={handleMobileClose}
                        aria-label="Fechar filtros"
                    >
                        <FaTimes />
                    </button>

                </div>


                {/* ========================================
                   CATEGORIAS
                   ======================================== */}

                <div className="products-filters-section">

                    <div className="products-filters-section-title">

                        <div className="products-filters-section-heading">

                            <FaLeaf />

                            <h3>
                                Categorias
                            </h3>

                        </div>

                        <FaChevronUp
                            className="products-filters-chevron"
                        />

                    </div>


                    <div className="products-filters-category-list">


                        {/* TODOS */}

                        <button
                            type="button"
                            className={
                                `products-filters-category ${
                                    selectedCategory === 'Todos'
                                        ? 'active'
                                        : ''
                                }`
                            }
                            onClick={() =>
                                onCategoryChange('Todos')
                            }
                        >

                            <span className="products-filters-radio">
                            </span>

                            <span>
                                Todos
                            </span>

                            <span>
                                {categoryCounts.todos}
                            </span>

                        </button>


                        {/* TRADICIONAIS */}

                        <button
                            type="button"
                            className={
                                `products-filters-category ${
                                    selectedCategory === 'Açaís Tradicionais'
                                        ? 'active'
                                        : ''
                                }`
                            }
                            onClick={() =>
                                onCategoryChange(
                                    'Açaís Tradicionais'
                                )
                            }
                        >

                            <span className="products-filters-radio">
                            </span>

                            <span>
                                Açaís Tradicionais
                            </span>

                            <span>
                                {categoryCounts.tradicionais}
                            </span>

                        </button>


                        {/* PREMIUM */}

                        <button
                            type="button"
                            className={
                                `products-filters-category ${
                                    selectedCategory === 'Açaís Premium'
                                        ? 'active'
                                        : ''
                                }`
                            }
                            onClick={() =>
                                onCategoryChange(
                                    'Açaís Premium'
                                )
                            }
                        >

                            <span className="products-filters-radio">
                            </span>

                            <span>
                                Açaís Premium
                            </span>

                            <span>
                                {categoryCounts.premium}
                            </span>

                        </button>


                        {/* COMBOS */}

                        <button
                            type="button"
                            className={
                                `products-filters-category ${
                                    selectedCategory === 'Combos'
                                        ? 'active'
                                        : ''
                                }`
                            }
                            onClick={() =>
                                onCategoryChange('Combos')
                            }
                        >

                            <span className="products-filters-radio">
                            </span>

                            <span>
                                Combos
                            </span>

                            <span>
                                {categoryCounts.combos}
                            </span>

                        </button>


                        {/* ADICIONAIS */}

                        <button
                            type="button"
                            className={
                                `products-filters-category ${
                                    selectedCategory === 'Adicionais'
                                        ? 'active'
                                        : ''
                                }`
                            }
                            onClick={() =>
                                onCategoryChange('Adicionais')
                            }
                        >

                            <span className="products-filters-radio">
                            </span>

                            <span>
                                Adicionais
                            </span>

                            <span>
                                {categoryCounts.adicionais}
                            </span>

                        </button>

                    </div>

                </div>


                {/* ========================================
                   TAMANHO
                   ======================================== */}

                <div className="products-filters-section">

                    <div className="products-filters-section-title">

                        <div className="products-filters-section-heading">

                            <FaBoxOpen />

                            <h3>
                                Tamanho
                            </h3>

                        </div>

                        <FaChevronUp
                            className="products-filters-chevron"
                        />

                    </div>


                    {/* 300 ML */}

                    <label className="products-filters-checkbox">

                        <input
                            type="checkbox"
                            checked={
                                selectedSizes.includes('300 ml')
                            }
                            onChange={() =>
                                onSizeChange('300 ml')
                            }
                        />

                        <span className="products-filters-checkbox-box">
                        </span>

                        <span className="products-filters-checkbox-label">
                            300 ml
                        </span>

                        <span className="products-filters-checkbox-count">
                            {sizeCounts['300 ml']}
                        </span>

                    </label>


                    {/* 500 ML */}

                    <label className="products-filters-checkbox">

                        <input
                            type="checkbox"
                            checked={
                                selectedSizes.includes('500 ml')
                            }
                            onChange={() =>
                                onSizeChange('500 ml')
                            }
                        />

                        <span className="products-filters-checkbox-box">
                        </span>

                        <span className="products-filters-checkbox-label">
                            500 ml
                        </span>

                        <span className="products-filters-checkbox-count">
                            {sizeCounts['500 ml']}
                        </span>

                    </label>


                    {/* 2 GARRAFAS */}

                    <label className="products-filters-checkbox">

                        <input
                            type="checkbox"
                            checked={
                                selectedSizes.includes('2 garrafas')
                            }
                            onChange={() =>
                                onSizeChange('2 garrafas')
                            }
                        />

                        <span className="products-filters-checkbox-box">
                        </span>

                        <span className="products-filters-checkbox-label">
                            2 garrafas
                        </span>

                        <span className="products-filters-checkbox-count">
                            {sizeCounts['2 garrafas']}
                        </span>

                    </label>

                </div>


                {/* ========================================
                   PREÇO
                   ======================================== */}

                <div className="products-filters-section">

                    <div className="products-filters-section-title">

                        <div className="products-filters-section-heading">

                            <FaDollarSign />

                            <h3>
                                Preço
                            </h3>

                        </div>

                        <FaChevronUp
                            className="products-filters-chevron"
                        />

                    </div>


                    <div className="products-filters-price">

                        <div className="products-filters-price-track">

                            <div
                                className="products-filters-price-line"
                                style={{
                                    left: `${(minPrice / 40) * 100}%`,
                                    right: `${100 - (maxPrice / 40) * 100}%`
                                }}
                            >
                            </div>


                            <input
                                type="range"
                                className="products-filters-price-range min"
                                min="0"
                                max="40"
                                step="0.10"
                                value={minPrice}
                                onChange={(event) => {

                                    const value =
                                        Number(
                                            event.target.value
                                        )

                                    if (
                                        value < maxPrice
                                    ) {
                                        onMinPriceChange(
                                            value
                                        )
                                    }

                                }}
                                aria-label="Preço mínimo"
                            />


                            <input
                                type="range"
                                className="products-filters-price-range max"
                                min="0"
                                max="40"
                                step="0.10"
                                value={maxPrice}
                                onChange={(event) => {

                                    const value =
                                        Number(
                                            event.target.value
                                        )

                                    if (
                                        value > minPrice
                                    ) {
                                        onMaxPriceChange(
                                            value
                                        )
                                    }

                                }}
                                aria-label="Preço máximo"
                            />

                        </div>


                        <div className="products-filters-price-values">

                            <span>
                                R$ {minPrice
                                    .toFixed(2)
                                    .replace('.', ',')}
                            </span>

                            <span>
                                R$ {maxPrice
                                    .toFixed(2)
                                    .replace('.', ',')}
                            </span>

                        </div>

                    </div>

                </div>


                {/* ========================================
                   DISPONIBILIDADE
                   ======================================== */}

                <div className="products-filters-section">

                    <div className="products-filters-section-title">

                        <div className="products-filters-section-heading">

                            <FaBoxOpen />

                            <h3>
                                Disponibilidade
                            </h3>

                        </div>

                        <FaChevronUp
                            className="products-filters-chevron"
                        />

                    </div>


                    <label className="products-filters-checkbox">

                        <input
                            type="checkbox"
                            checked={
                                showOnlyAvailable
                            }
                            onChange={(event) =>
                                onAvailabilityChange(
                                    event.target.checked
                                )
                            }
                        />

                        <span className="products-filters-checkbox-box">
                        </span>

                        <span className="products-filters-checkbox-label">
                            Apenas disponíveis
                        </span>

                    </label>

                </div>


                {/* ========================================
                   MASCOTE DESKTOP
                   ======================================== */}

                <div className="products-filters-quality">

                    <img
                        src={mascotImage}
                        alt="Mascote Açaívis"
                    />

                </div>


                {/* ========================================
                   BOTÕES MOBILE
                   ======================================== */}

                <div className="products-filters-mobile-actions">

                    <button
                        type="button"
                        className="products-filters-mobile-cancel"
                        onClick={handleMobileClose}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="products-filters-mobile-apply"
                        onClick={handleMobileClose}
                    >
                        Aplicar filtros
                    </button>

                </div>

            </aside>

        </>
    )
}


export default ProductsFilters