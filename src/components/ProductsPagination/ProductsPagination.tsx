import './ProductsPagination.css'

import {
    FaChevronLeft,
    FaChevronRight
} from 'react-icons/fa'


interface ProductsPaginationProps {
    currentPage: number
    totalPages: number
    totalProducts: number
    productsPerPage: number
    onPageChange: (page: number) => void
}


function ProductsPagination({
    currentPage,
    totalPages,
    totalProducts,
    productsPerPage,
    onPageChange
}: ProductsPaginationProps) {

    const firstProduct =
        (currentPage - 1) * productsPerPage + 1

    const lastProduct =
        Math.min(
            currentPage * productsPerPage,
            totalProducts
        )


    const goToPreviousPage = () => {

        if (currentPage > 1) {
            onPageChange(currentPage - 1)
        }

    }


    const goToNextPage = () => {

        if (currentPage < totalPages) {
            onPageChange(currentPage + 1)
        }

    }


    return (

        <div className="products-pagination">

            <span className="products-pagination-info">

                Mostrando {firstProduct}–{lastProduct} de{' '}
                {totalProducts} produtos

            </span>


            <div className="products-pagination-controls">

                <button
                    type="button"
                    className="products-pagination-arrow"
                    aria-label="Página anterior"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                >
                    <FaChevronLeft />
                </button>


                {Array.from(
                    { length: totalPages },
                    (_, index) => {

                        const page =
                            index + 1

                        return (

                            <button
                                key={page}
                                type="button"
                                className={
                                    `products-pagination-page ${
                                        currentPage === page
                                            ? 'active'
                                            : ''
                                    }`
                                }
                                onClick={() =>
                                    onPageChange(page)
                                }
                            >
                                {page}
                            </button>

                        )

                    }
                )}


                <button
                    type="button"
                    className="products-pagination-arrow"
                    aria-label="Próxima página"
                    onClick={goToNextPage}
                    disabled={
                        currentPage === totalPages
                    }
                >
                    <FaChevronRight />
                </button>

            </div>

        </div>

    )
}


export default ProductsPagination