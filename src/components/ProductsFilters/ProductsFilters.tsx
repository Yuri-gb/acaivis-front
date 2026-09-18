import './ProductsFilters.css'

import {
    FaLeaf,
    FaDollarSign,
    FaBoxOpen,
    FaChevronUp,
    FaTimes,
} from 'react-icons/fa'

import mascotImage from '../../assets/images/products/acaivis-mascote-card.webp'

interface ProductsFiltersProps {
    selectedCategory: string
    onCategoryChange: (category: string) => void

    categoryCounts: {
        todos: number
        tradicionais: number
        premium: number
        combos: number
        adicionais: number
    }

    selectedSizes: string[]
    onSizeChange: (size: string) => void

    sizeCounts: {
        '300 ml': number
        '500 ml': number
        '2 garrafas': number
    }

    minPrice: number
    maxPrice: number
    onMinPriceChange: (value: number) => void
    onMaxPriceChange: (value: number) => void

    showOnlyAvailable: boolean
    onAvailabilityChange: (value: boolean) => void

    isMobileOpen?: boolean
    onMobileClose?: () => void
}

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
    onMobileClose,
}: ProductsFiltersProps) {

    const handleClearFilters = () => {
        onCategoryChange('Todos')

        selectedSizes.forEach((size) => {
            onSizeChange(size)
        })

        onMinPriceChange(0)
        onMaxPriceChange(40)
        onAvailabilityChange(true)
    }

    const handleMobileClose = () => {
        onMobileClose?.()
    }

    return (
        <>
            <div
                className={`acaivis-filters-overlay ${
                    isMobileOpen ? 'active' : ''
                }`}
                onClick={handleMobileClose}
            />

            <aside
                className={`acaivis-filters ${
                    isMobileOpen ? 'mobile-open' : ''
                }`}
            >
                <div className="acaivis-filters-mobile-header">
                    <div className="acaivis-filters-mobile-handle" />

                    <div className="acaivis-filters-mobile-title">
                        <div>
                            <h2>Filtros</h2>

                            <p>
                                {categoryCounts.todos} produtos encontrados
                            </p>
                        </div>

                        <button
                            type="button"
                            className="acaivis-filters-mobile-clear"
                            onClick={handleClearFilters}
                        >
                            Limpar tudo
                        </button>
                    </div>

                    <button
                        type="button"
                        className="acaivis-filters-mobile-close"
                        onClick={handleMobileClose}
                        aria-label="Fechar filtros"
                    >
                        <FaTimes />
                    </button>
                </div>

                <div className="acaivis-filters-mobile-content">

                <div className="acaivis-filters-section">
                    <div className="acaivis-filters-section-title">
                        <div className="acaivis-filters-section-heading">
                            <FaLeaf />
                            <h3>Categorias</h3>
                        </div>

                        <FaChevronUp className="acaivis-filters-chevron" />
                    </div>

                    <div className="acaivis-filters-category-list">
                        <button
                            type="button"
                            className={`acaivis-filters-category ${
                                selectedCategory === 'Todos' ? 'active' : ''
                            }`}
                            onClick={() => onCategoryChange('Todos')}
                        >
                            <span className="acaivis-filters-radio" />
                            <span>Todos</span>
                            <span>{categoryCounts.todos}</span>
                        </button>

                        <button
                            type="button"
                            className={`acaivis-filters-category ${
                                selectedCategory === 'Açaís Tradicionais'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                onCategoryChange('Açaís Tradicionais')
                            }
                        >
                            <span className="acaivis-filters-radio" />
                            <span>Açaís Tradicionais</span>
                            <span>{categoryCounts.tradicionais}</span>
                        </button>

                        <button
                            type="button"
                            className={`acaivis-filters-category ${
                                selectedCategory === 'Açaís Premium'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                onCategoryChange('Açaís Premium')
                            }
                        >
                            <span className="acaivis-filters-radio" />
                            <span>Açaís Premium</span>
                            <span>{categoryCounts.premium}</span>
                        </button>

                        <button
                            type="button"
                            className={`acaivis-filters-category ${
                                selectedCategory === 'Combos' ? 'active' : ''
                            }`}
                            onClick={() => onCategoryChange('Combos')}
                        >
                            <span className="acaivis-filters-radio" />
                            <span>Combos</span>
                            <span>{categoryCounts.combos}</span>
                        </button>

                        <button
                            type="button"
                            className={`acaivis-filters-category ${
                                selectedCategory === 'Adicionais'
                                    ? 'active'
                                    : ''
                            }`}
                            onClick={() =>
                                onCategoryChange('Adicionais')
                            }
                        >
                            <span className="acaivis-filters-radio" />
                            <span>Adicionais</span>
                            <span>{categoryCounts.adicionais}</span>
                        </button>
                    </div>
                </div>

                <div className="acaivis-filters-section">
                    <div className="acaivis-filters-section-title">
                        <div className="acaivis-filters-section-heading">
                            <FaBoxOpen />
                            <h3>Tamanho</h3>
                        </div>

                        <FaChevronUp className="acaivis-filters-chevron" />
                    </div>

                    <label className="acaivis-filters-checkbox">
                        <input
                            type="checkbox"
                            checked={selectedSizes.includes('300 ml')}
                            onChange={() => onSizeChange('300 ml')}
                        />

                        <span className="acaivis-filters-checkbox-box" />

                        <span className="acaivis-filters-checkbox-label">
                            300 ml
                        </span>

                        <span className="acaivis-filters-checkbox-count">
                            {sizeCounts['300 ml']}
                        </span>
                    </label>

                    <label className="acaivis-filters-checkbox">
                        <input
                            type="checkbox"
                            checked={selectedSizes.includes('500 ml')}
                            onChange={() => onSizeChange('500 ml')}
                        />

                        <span className="acaivis-filters-checkbox-box" />

                        <span className="acaivis-filters-checkbox-label">
                            500 ml
                        </span>

                        <span className="acaivis-filters-checkbox-count">
                            {sizeCounts['500 ml']}
                        </span>
                    </label>

                    <label className="acaivis-filters-checkbox">
                        <input
                            type="checkbox"
                            checked={selectedSizes.includes('2 garrafas')}
                            onChange={() => onSizeChange('2 garrafas')}
                        />

                        <span className="acaivis-filters-checkbox-box" />

                        <span className="acaivis-filters-checkbox-label">
                            2 garrafas
                        </span>

                        <span className="acaivis-filters-checkbox-count">
                            {sizeCounts['2 garrafas']}
                        </span>
                    </label>
                </div>

                <div className="acaivis-filters-section">
                    <div className="acaivis-filters-section-title">
                        <div className="acaivis-filters-section-heading">
                            <FaDollarSign />
                            <h3>Preço</h3>
                        </div>

                        <FaChevronUp className="acaivis-filters-chevron" />
                    </div>

                    <div className="acaivis-filters-price">
                        <div className="acaivis-filters-price-track">
                            <div
                                className="acaivis-filters-price-line"
                                style={{
                                    left: `${(minPrice / 40) * 100}%`,
                                    right: `${100 - (maxPrice / 40) * 100}%`,
                                }}
                            />

                            <input
                                type="range"
                                className="acaivis-filters-price-range min"
                                min="0"
                                max="40"
                                step="0.10"
                                value={minPrice}
                                onChange={(event) => {
                                    const value = Number(event.target.value)

                                    if (value < maxPrice) {
                                        onMinPriceChange(value)
                                    }
                                }}
                                aria-label="Preço mínimo"
                            />

                            <input
                                type="range"
                                className="acaivis-filters-price-range max"
                                min="0"
                                max="40"
                                step="0.10"
                                value={maxPrice}
                                onChange={(event) => {
                                    const value = Number(event.target.value)

                                    if (value > minPrice) {
                                        onMaxPriceChange(value)
                                    }
                                }}
                                aria-label="Preço máximo"
                            />
                        </div>

                        <div className="acaivis-filters-price-values">
                            <span>
                                R$ {minPrice.toFixed(2).replace('.', ',')}
                            </span>

                            <span>
                                R$ {maxPrice.toFixed(2).replace('.', ',')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="acaivis-filters-section">
                    <div className="acaivis-filters-section-title">
                        <div className="acaivis-filters-section-heading">
                            <FaBoxOpen />
                            <h3>Disponibilidade</h3>
                        </div>

                        <FaChevronUp className="acaivis-filters-chevron" />
                    </div>

                    <label className="acaivis-filters-checkbox">
                        <input
                            type="checkbox"
                            checked={showOnlyAvailable}
                            onChange={(event) =>
                                onAvailabilityChange(event.target.checked)
                            }
                        />

                        <span className="acaivis-filters-checkbox-box" />

                        <span className="acaivis-filters-checkbox-label">
                            Apenas disponíveis
                        </span>
                    </label>
                </div>

                <div className="acaivis-filters-quality">
                    <img
                        src={mascotImage}
                        alt="Mascote Açaívis"
                    />
                </div>

                </div>

                <div className="acaivis-filters-mobile-actions">
                    <button
                        type="button"
                        className="acaivis-filters-mobile-cancel"
                        onClick={handleMobileClose}
                    >
                        Cancelar
                    </button>

                    <button
                        type="button"
                        className="acaivis-filters-mobile-apply"
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