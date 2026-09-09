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
}


/* ========================================
   COMPONENTE
   ======================================== */

function ProductsToolbar({

    search,

    onSearchChange,

    onOpenFilters

}: ProductsToolbarProps) {

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

            <button
                type="button"
                className="products-toolbar-sort"
            >

                <span>
                    Ordenar por
                </span>

                <strong>
                    Mais vendidos
                </strong>

                <FaChevronDown />

            </button>


            {/* ========================================
               VISUALIZAÇÃO
               ======================================== */}

            <div className="products-toolbar-view">

                <button
                    type="button"
                    className="products-toolbar-view-button active"
                    aria-label="Visualização em grade"
                >

                    <FaTh />

                    <span>
                        Grade
                    </span>

                </button>


                <button
                    type="button"
                    className="products-toolbar-view-button"
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