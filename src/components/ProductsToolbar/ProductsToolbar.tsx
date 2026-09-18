import { useEffect, useRef, useState } from 'react'

import './ProductsToolbar.css'

import {
    FaSearch,
    FaTh,
    FaList,
    FaChevronDown,
    FaSlidersH
} from 'react-icons/fa'


/* ========================================
   PROPS
   ======================================== */

interface ProductsToolbarProps {

    search: string

    onSearchChange: (
        value: string
    ) => void

    onOpenFilters?: () => void

    sortOption:
        | 'best-selling'
        | 'newest'
        | 'price-asc'
        | 'price-desc'
        | 'name-asc'
        | 'name-desc'

    onSortChange: (
        option:
            | 'best-selling'
            | 'newest'
            | 'price-asc'
            | 'price-desc'
            | 'name-asc'
            | 'name-desc'
    ) => void

    viewMode: 'grid' | 'list'

    onViewModeChange: (
        mode: 'grid' | 'list'
    ) => void
}


/* ========================================
   COMPONENTE
   ======================================== */

function ProductsToolbar({

    search,

    onSearchChange,

    onOpenFilters,

    sortOption,

    onSortChange,

    viewMode,

    onViewModeChange

}: ProductsToolbarProps) {

    const [isSortOpen, setIsSortOpen] = useState(false)

    const sortRef = useRef<HTMLDivElement>(null)


    const sortOptions = [
        {
            value: 'best-selling',
            label: 'Mais vendidos'
        },
        {
            value: 'newest',
            label: 'Mais recentes'
        },
        {
            value: 'price-asc',
            label: 'Menor preço'
        },
        {
            value: 'price-desc',
            label: 'Maior preço'
        },
        {
            value: 'name-asc',
            label: 'A → Z'
        },
        {
            value: 'name-desc',
            label: 'Z → A'
        }
    ] as const


    /* ========================================
       FECHAR AO CLICAR FORA
       ======================================== */

    useEffect(() => {

        const handleClickOutside = (
            event: MouseEvent
        ) => {

            if (
                sortRef.current &&
                !sortRef.current.contains(
                    event.target as Node
                )
            ) {

                setIsSortOpen(false)

            }

        }


        document.addEventListener(
            'mousedown',
            handleClickOutside
        )


        return () => {

            document.removeEventListener(
                'mousedown',
                handleClickOutside
            )

        }

    }, [])


    return (

        <div className="products-toolbar">


            {/* ========================================
               BUSCA
               ======================================== */}

            <div className="products-toolbar-search">

                <FaSearch />

                <input
                    type="text"
                    placeholder="Buscar produtos..."
                    value={search}
                    onChange={(event) =>
                        onSearchChange(
                            event.target.value
                        )
                    }
                />

            </div>


            {/* ========================================
               FILTROS
               ======================================== */}

            <button
                type="button"
                className="products-toolbar-filter"
                onClick={onOpenFilters}
            >

                <FaSlidersH />

                <span>
                    Filtros
                </span>

            </button>


            {/* ========================================
               ORDENAÇÃO
               ======================================== */}

            <div
                ref={sortRef}
                className={`products-toolbar-sort ${
                    isSortOpen
                        ? 'open'
                        : ''
                }`}
            >

                <button
                    type="button"
                    className="products-toolbar-sort-trigger"
                    onClick={() =>
                        setIsSortOpen(
                            (open) => !open
                        )
                    }
                    aria-expanded={isSortOpen}
                    aria-haspopup="listbox"
                >

                    <span>
                        Ordenar por
                    </span>

                    <strong>
                        {
                            sortOptions.find(
                                (option) =>
                                    option.value ===
                                    sortOption
                            )?.label
                            || 'Mais vendidos'
                        }
                    </strong>

                    <FaChevronDown />

                </button>


                {isSortOpen && (

                    <div
                        className="products-toolbar-sort-menu"
                        role="listbox"
                        aria-label="Ordenar produtos"
                    >

                        {sortOptions.map(
                            (option) => (

                                <button
                                    key={option.value}
                                    type="button"
                                    role="option"
                                    aria-selected={
                                        sortOption ===
                                        option.value
                                    }
                                    className={`products-toolbar-sort-option ${
                                        sortOption ===
                                        option.value
                                            ? 'active'
                                            : ''
                                    }`}
                                    onClick={() => {

                                        onSortChange(
                                            option.value
                                        )

                                        setIsSortOpen(
                                            false
                                        )

                                    }}
                                >

                                    {option.label}

                                </button>

                            )
                        )}

                    </div>

                )}

            </div>


            {/* ========================================
               VISUALIZAÇÃO
               ======================================== */}

            <div className="products-toolbar-view">

                <button
                    type="button"
                    className={`products-toolbar-view-button ${
                        viewMode === 'grid'
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        onViewModeChange(
                            'grid'
                        )
                    }
                    aria-label="Visualização em grade"
                >

                    <FaTh />

                    <span>
                        Grade
                    </span>

                </button>


                <button
                    type="button"
                    className={`products-toolbar-view-button ${
                        viewMode === 'list'
                            ? 'active'
                            : ''
                    }`}
                    onClick={() =>
                        onViewModeChange(
                            'list'
                        )
                    }
                    aria-label="Visualização em lista"
                >

                    <FaList />

                    <span>
                        Lista
                    </span>

                </button>

            </div>

        </div>
    )
}


export default ProductsToolbar