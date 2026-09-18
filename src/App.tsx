import { lazy, Suspense, useEffect } from 'react'

import {
    BrowserRouter,
    Routes,
    Route,
    useLocation,
    useNavigate,
    Navigate
} from 'react-router-dom'

import Hero from './components/Hero/Hero'
import Navbar from './components/Navbar/Navbar'
import ProductsSection from './components/ProductsSection/ProductsSection'
import HowItWorks from './components/HowItWorks/HowItWorks'
import AboutSection from './components/AboutSection/AboutSection'
import Footer from './components/Footer/Footer'

const Products = lazy(
    () => import('./pages/Products/Products')
)

import ProductDetails from './pages/ProductDetails/ProductDetails'
import Cart from './pages/Cart/Cart'
import Checkout from './pages/Checkout/Checkout'

import Admin from './pages/Admin/Admin'
import AdminLogin from './pages/Admin/AdminLogin'
import Dashboard from './pages/Admin/Dashboard'
import ProductsAdmin from './pages/Admin/ProductsAdmin'
import ProductForm from './pages/Admin/ProductForm'
import OrdersAdmin from './pages/Admin/OrdersAdmin'
import OrderDetailsAdmin from './pages/Admin/OrderDetailsAdmin'

import TrackOrder from './pages/TrackOrder/TrackOrder'
import PaymentResult from './pages/PaymentResult/PaymentResult'
import CatalogAdmin from './pages/Admin/CatalogAdmin'
import ReportsAdmin from './pages/Admin/ReportsAdmin'
import DeliveryAdmin from './pages/Delivery/DeliveryAdmin'

import { auth } from './services/api'

function ScrollToTop() {
    const {
        pathname,
        hash
    } = useLocation()

    useEffect(() => {
        if (hash) {
            const id = decodeURIComponent(
                hash.slice(1)
            )

            const element =
                document.getElementById(id)

            if (element) {
                element.scrollIntoView()
                return
            }
        }

        window.scrollTo(0, 0)
    }, [pathname, hash])

    return null
}

function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <ProductsSection />
            <HowItWorks />
            <AboutSection />
            <Footer />
        </>
    )
}

function DeliveryRoute() {
    const nav = useNavigate()

    const loggedIn = auth.isLoggedIn()
    const role = auth.role()

    useEffect(() => {
        if (!loggedIn || role !== 'DELIVERER') {
            nav('/admin/login', { replace: true })
        }
    }, [loggedIn, role, nav])

    if (!loggedIn || role !== 'DELIVERER') {
        return null
    }

    return <DeliveryAdmin />
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />

            <Suspense fallback={null}>
                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/produtos"
                        element={<Products />}
                    />

                    <Route
                        path="/produtos/:id"
                        element={<ProductDetails />}
                    />

                    <Route
                        path="/carrinho"
                        element={<Cart />}
                    />

                    <Route
                        path="/finalizar-pedido"
                        element={<Checkout />}
                    />

                    <Route
                        path="/rastrear-pedido"
                        element={<TrackOrder />}
                    />

                    <Route
                        path="/resultado-pagamento"
                        element={<PaymentResult />}
                    />

                    <Route
                        path="/admin/login"
                        element={<AdminLogin />}
                    />

                    <Route
                        path="/entrega"
                        element={<DeliveryRoute />}
                    />

                    <Route
                        path="/admin"
                        element={
                            auth.isLoggedIn() &&
                            auth.role() === 'ADMIN'
                                ? <Admin />
                                : <Navigate
                                    to="/admin/login"
                                    replace
                                />
                        }
                    >
                        <Route
                            index
                            element={<Dashboard />}
                        />

                        <Route
                            path="pedidos"
                            element={<OrdersAdmin />}
                        />

                        <Route
                            path="pedidos/:id"
                            element={<OrderDetailsAdmin />}
                        />

                        <Route
                            path="produtos"
                            element={<ProductsAdmin />}
                        />

                        <Route
                            path="produtos/novo"
                            element={
                                <ProductForm mode="create" />
                            }
                        />

                        <Route
                            path="produtos/:id/editar"
                            element={
                                <ProductForm mode="edit" />
                            }
                        />

                        <Route
                            path="catalogo"
                            element={<CatalogAdmin />}
                        />

                        <Route
                            path="relatorios"
                            element={<ReportsAdmin />}
                        />
                    </Route>

                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

export default App