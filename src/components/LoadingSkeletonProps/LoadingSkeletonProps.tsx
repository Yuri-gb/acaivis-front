import './LoadingSkeletonProps.css'

export type LoadingSkeletonType =
    | 'home'
    | 'products'
    | 'details'
    | 'cart'

interface LoadingSkeletonProps {
    type: LoadingSkeletonType
}

/* ========================================
   ELEMENTO BASE
   ======================================== */

function Skeleton({
    className = ''
}: {
    className?: string
}) {
    return (
        <div
            className={`skeleton ${className}`}
        />
    )
}

/* ========================================
   NAVBAR
   ======================================== */

function NavbarSkeleton() {
    return (
        <div className="skeleton-navbar">
            <Skeleton className="skeleton-navbar-logo" />

            <div className="skeleton-navbar-links">
                <Skeleton />
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </div>

            <div className="skeleton-navbar-actions">
                <Skeleton />
                <Skeleton className="skeleton-navbar-cart" />
            </div>

            <Skeleton className="skeleton-navbar-menu" />
        </div>
    )
}

/* ========================================
   PRODUCT CARD
   ======================================== */

function ProductCardSkeleton() {
    return (
        <div className="skeleton-product-card">

            <div className="skeleton-product-image">
                <Skeleton />
            </div>

            <div className="skeleton-product-content">

                <Skeleton className="skeleton-product-title" />

                <Skeleton className="skeleton-product-size" />

                <Skeleton className="skeleton-product-description" />
                <Skeleton className="skeleton-product-description short" />

                <Skeleton className="skeleton-product-price" />

                <Skeleton className="skeleton-product-quantity" />

                <Skeleton className="skeleton-product-button" />

            </div>

        </div>
    )
}

/* ========================================
   HOME
   ======================================== */

function HomeSkeleton() {
    return (
        <main className="loading-skeleton-page">

            <NavbarSkeleton />

            <section className="skeleton-home-hero">
                <div className="skeleton-home-content">
                    <Skeleton className="skeleton-home-small" />
                    <Skeleton className="skeleton-home-title" />
                    <Skeleton className="skeleton-home-title second" />
                    <Skeleton className="skeleton-home-text" />
                    <Skeleton className="skeleton-home-text short" />

                    <div className="skeleton-home-buttons">
                        <Skeleton />
                        <Skeleton />
                    </div>
                </div>
            </section>

            <section className="skeleton-home-section">
                <Skeleton className="skeleton-section-title" />

                <div className="skeleton-home-products">
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                    <ProductCardSkeleton />
                </div>
            </section>

        </main>
    )
}

/* ========================================
   PRODUTOS
   ======================================== */

function ProductsSkeleton() {
    return (
        <main className="loading-skeleton-page">

            <NavbarSkeleton />

            <section className="skeleton-products-page">

                <div className="skeleton-products-banner">
                    <div className="skeleton-products-banner-content">
                        <Skeleton className="skeleton-banner-small" />
                        <Skeleton className="skeleton-banner-title" />
                        <Skeleton className="skeleton-banner-text" />
                        <Skeleton className="skeleton-banner-text short" />
                    </div>
                </div>

                <div className="skeleton-products-toolbar">
                    <Skeleton className="skeleton-toolbar-search" />

                    <div className="skeleton-toolbar-actions">
                        <Skeleton />
                        <Skeleton />
                    </div>
                </div>

                <div className="skeleton-products-catalog">

                    <aside className="skeleton-products-filters">
                        <Skeleton className="skeleton-filter-title" />

                        <Skeleton className="skeleton-filter-line" />
                        <Skeleton className="skeleton-filter-line medium" />
                        <Skeleton className="skeleton-filter-line short" />

                        <Skeleton className="skeleton-filter-title second" />

                        <Skeleton className="skeleton-filter-box" />
                        <Skeleton className="skeleton-filter-box" />
                        <Skeleton className="skeleton-filter-box" />
                    </aside>

                    <div className="skeleton-products-grid">

                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />

                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />
                        <ProductCardSkeleton />

                    </div>

                </div>

            </section>

        </main>
    )
}

/* ========================================
   DETALHES
   ======================================== */

function DetailsSkeleton() {
    return (
        <main className="loading-skeleton-page">

            <NavbarSkeleton />

            <section className="skeleton-details-page">

                <div className="skeleton-details-breadcrumb">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>

                <div className="skeleton-details-main">

                    <div className="skeleton-details-gallery">

                        <Skeleton className="skeleton-details-main-image" />

                        <div className="skeleton-details-thumbnails">
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                            <Skeleton />
                        </div>

                    </div>

                    <div className="skeleton-details-info">

                        <Skeleton className="skeleton-details-title" />
                        <Skeleton className="skeleton-details-title short" />

                        <Skeleton className="skeleton-details-size" />

                        <div className="skeleton-details-rating">
                            <Skeleton />
                            <Skeleton />
                        </div>

                        <Skeleton className="skeleton-details-price" />

                        <Skeleton className="skeleton-details-description" />
                        <Skeleton className="skeleton-details-description" />
                        <Skeleton className="skeleton-details-description short" />

                        <Skeleton className="skeleton-details-favorite" />

                        <Skeleton className="skeleton-details-quantity" />

                        <Skeleton className="skeleton-details-add" />

                    </div>

                </div>

                <div className="skeleton-details-benefits">

                    <div>
                        <Skeleton />
                        <Skeleton />
                    </div>

                    <div>
                        <Skeleton />
                        <Skeleton />
                    </div>

                    <div>
                        <Skeleton />
                        <Skeleton />
                    </div>

                    <div>
                        <Skeleton />
                        <Skeleton />
                    </div>

                </div>

                <div className="skeleton-details-section">

                    <Skeleton className="skeleton-details-section-title" />

                    <Skeleton className="skeleton-details-section-line" />
                    <Skeleton className="skeleton-details-section-line" />
                    <Skeleton className="skeleton-details-section-line short" />

                </div>

                <div className="skeleton-details-section">

                    <Skeleton className="skeleton-details-section-title" />

                    <div className="skeleton-nutrition-grid">
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                    </div>

                </div>

            </section>

        </main>
    )
}

/* ========================================
   CARRINHO
   ======================================== */

function CartSkeleton() {
    return (
        <main className="loading-skeleton-page">

            <NavbarSkeleton />

            <section className="skeleton-cart-page">

                <div className="skeleton-cart-breadcrumb">
                    <Skeleton />
                    <Skeleton />
                    <Skeleton />
                </div>

                <div className="skeleton-cart-hero">

                    <div className="skeleton-cart-hero-content">
                        <Skeleton className="skeleton-cart-label" />
                        <Skeleton className="skeleton-cart-title" />
                        <Skeleton className="skeleton-cart-title short" />
                        <Skeleton className="skeleton-cart-text" />
                    </div>

                    <Skeleton className="skeleton-cart-art" />

                </div>

                <div className="skeleton-cart-layout">

                    <div className="skeleton-cart-products">

                        <div className="skeleton-cart-products-header">
                            <Skeleton />
                            <Skeleton />
                        </div>

                        <div className="skeleton-cart-item">
                            <Skeleton className="skeleton-cart-item-image" />

                            <div>
                                <Skeleton className="skeleton-cart-item-title" />
                                <Skeleton className="skeleton-cart-item-text" />
                                <Skeleton className="skeleton-cart-item-price" />
                            </div>

                            <Skeleton className="skeleton-cart-item-quantity" />
                            <Skeleton className="skeleton-cart-item-remove" />
                        </div>

                        <div className="skeleton-cart-item">
                            <Skeleton className="skeleton-cart-item-image" />

                            <div>
                                <Skeleton className="skeleton-cart-item-title" />
                                <Skeleton className="skeleton-cart-item-text" />
                                <Skeleton className="skeleton-cart-item-price" />
                            </div>

                            <Skeleton className="skeleton-cart-item-quantity" />
                            <Skeleton className="skeleton-cart-item-remove" />
                        </div>

                    </div>

                    <aside className="skeleton-cart-sidebar">

                        <div className="skeleton-cart-summary">

                            <div className="skeleton-summary-title">
                                <Skeleton />
                                <Skeleton />
                            </div>

                            <Skeleton className="skeleton-summary-line" />
                            <Skeleton className="skeleton-summary-line" />
                            <Skeleton className="skeleton-summary-line" />

                            <Skeleton className="skeleton-summary-divider" />

                            <Skeleton className="skeleton-summary-total" />

                            <Skeleton className="skeleton-summary-button" />

                        </div>

                        <div className="skeleton-cart-secure">
                            <Skeleton />
                            <div>
                                <Skeleton />
                                <Skeleton />
                            </div>
                        </div>

                    </aside>

                </div>

            </section>

        </main>
    )
}

/* ========================================
   COMPONENTE PRINCIPAL
   ======================================== */

export default function LoadingSkeleton({
    type
}: LoadingSkeletonProps) {

    if (type === 'products') {
        return <ProductsSkeleton />
    }

    if (type === 'details') {
        return <DetailsSkeleton />
    }

    if (type === 'cart') {
        return <CartSkeleton />
    }

    return <HomeSkeleton />
}