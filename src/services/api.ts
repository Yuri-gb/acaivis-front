import type { Category, DeliveryZone, DeliveryCalculation, Order, OrderStatus, Product, ReportSummary, PaymentMethod, OrderStatusHistory, TrackingOrder, AdminOrderPage, DeliveryOrder } from '../types/api'

export interface AdminProductPage {
    content: Product[]
    totalElements: number
    totalPages: number
    currentPage: number
    pageSize: number
}

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080/api').replace(/\/$/, '')
const TOKEN_KEY = 'acaivis_admin_token'

export class ApiError extends Error { status: number; constructor(message: string, status: number) { super(message); this.status = status } }

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem(TOKEN_KEY)
    const headers = new Headers(options.headers)
    if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')
    if (token) headers.set('Authorization', `Bearer ${token}`)
    const response = await fetch(`${API_URL}${path}`, { ...options, headers })
    if (response.status === 204) return undefined as T
    const text = await response.text()
    let data: any = null
    try { data = text ? JSON.parse(text) : null } catch { data = text }
    if (!response.ok) {
        if (response.status === 401 && path !== '/auth/login') localStorage.removeItem(TOKEN_KEY)
        throw new ApiError(data?.message || data?.error || 'Não foi possível concluir a operação.', response.status)
    }
    return data as T
}

export const api = {
    get products() { return request<Product[]>('/products?available=false') },
    get availableProducts() { return request<Product[]>('/products') },
    product: (id: number) => request<Product>(`/products/${id}`),
    categories: () => request<Category[]>('/categories'),
    deliveryZones: () => request<DeliveryZone[]>('/delivery-zones'),
    calculateDelivery: (zipCode:string) => request<DeliveryCalculation>(`/delivery/calculate?zipCode=${encodeURIComponent(zipCode)}`),
    createOrder: (payload: { customerName:string; customerPhone:string; customerEmail?:string; street:string; number:string; complement:string; neighborhood:string; city:string; state:string; zipCode:string; deliveryZoneId:number; paymentMethod:PaymentMethod; notes?:string; items:{productId:number;quantity:number}[] }) => request<Order>('/orders', { method:'POST', body:JSON.stringify(payload) }),
    createMercadoPagoPayment: (orderId:number, payload: { paymentMethodId:string; paymentMethodType:string; token:string|null; installments:number|null; payerEmail:string; idempotencyKey?:string }) => request<import('../types/api').MercadoPagoPaymentResponse>(`/payments/orders/${orderId}`, { method:'POST', body:JSON.stringify(payload) }),
    cardCheckoutStatus: (mercadoPagoOrderId:string) => request<import('../types/api').MercadoPagoCardCheckoutResponse>(`/payments/card-checkout/${encodeURIComponent(mercadoPagoOrderId)}`),
    createMercadoPagoCardCheckout: (payload: { order: { customerName:string; customerPhone:string; customerEmail?:string; street:string; number:string; complement:string; neighborhood:string; city:string; state:string; zipCode:string; deliveryZoneId:number; paymentMethod:PaymentMethod; notes?:string; items:{productId:number;quantity:number}[] }; payment: { paymentMethodId:string; paymentMethodType:string; token:string|null; installments:number|null; payerEmail:string; idempotencyKey?:string } }) => request<import('../types/api').MercadoPagoCardCheckoutResponse>('/payments/card-checkout', { method:'POST', body:JSON.stringify(payload) }),
    paymentStatus: (trackingCode:string) => request<import('../types/api').MercadoPagoPaymentResponse>(`/payments/orders/tracking/${encodeURIComponent(trackingCode)}`),
    login: (email:string, password:string) => request<{token:string;type:string;role:'ADMIN'|'DELIVERER'}>('/auth/login', {method:'POST', body:JSON.stringify({email,password})}),
    adminProducts: () => request<Product[]>('/products?available=false'),
    adminProductsPage: (params: {page:number; size:number; search?:string; categoryId?:number; available?:boolean}) => {
        const query = new URLSearchParams({ page: String(params.page), size: String(params.size) })
        if (params.search) query.set('search', params.search)
        if (params.categoryId !== undefined) query.set('categoryId', String(params.categoryId))
        if (params.available !== undefined) query.set('available', String(params.available))
        return request<AdminProductPage>(`/admin/products?${query.toString()}`)
    },
    reactivateProduct: (id:number) => request<Product>(`/admin/products/${id}/reactivate`, {method:'PATCH'}),
    createProduct: (payload: object) => request<Product>('/products', {method:'POST', body:JSON.stringify(payload)}),
    uploadProductImage: (file: File) => { const form = new FormData(); form.append('file', file); return request<{imageUrl:string;path:string}>('/products/upload-image', {method:'POST', body:form}); },
    updateProduct: (id:number,payload:object) => request<Product>(`/products/${id}`, {method:'PUT',body:JSON.stringify(payload)}),
    deleteProduct: (id:number) => request<void>(`/products/${id}`, {method:'DELETE'}),
    createCategory: (name:string) => request<Category>('/categories',{method:'POST',body:JSON.stringify({name})}),
    updateCategory: (id:number,name:string) => request<Category>(`/categories/${id}`,{method:'PUT',body:JSON.stringify({name})}),
    deleteCategory: (id:number) => request<void>(`/categories/${id}`,{method:'DELETE'}),
    reactivateCategory: (id:number) => request<Category>(`/categories/${id}/reactivate`,{method:'PATCH'}),
    createZone: (name:string,fee:number) => request<DeliveryZone>('/delivery-zones',{method:'POST',body:JSON.stringify({name,fee})}),
    updateZone: (id:number,name:string,fee:number) => request<DeliveryZone>(`/delivery-zones/${id}`,{method:'PUT',body:JSON.stringify({name,fee})}),
    deleteZone: (id:number) => request<void>(`/delivery-zones/${id}`,{method:'DELETE'}),
    reactivateZone: (id:number) => request<DeliveryZone>(`/delivery-zones/${id}/reactivate`,{method:'PATCH'}),
    orders: () => request<Order[]>('/orders'),
    adminOrdersPage: (params: { page?: number; size?: number; search?: string; status?: OrderStatus }) => {
        const query = new URLSearchParams()
        query.set('page', String(params.page ?? 0))
        query.set('size', String(params.size ?? 10))
        if (params.search?.trim()) query.set('search', params.search.trim())
        if (params.status) query.set('status', params.status)
        return request<AdminOrderPage>(`/admin/orders?${query.toString()}`)
    },
    order: (id:number) => request<Order>(`/orders/${id}`),
    orderHistory: (id:number) => request<OrderStatusHistory[]>(`/orders/${id}/history`),
    customerHistory: (id:number) => request<Order[]>(`/orders/${id}/customer-history`),
    trackOrder: (code:string) => request<TrackingOrder>(`/orders/tracking/${encodeURIComponent(code)}`),
    orderStatus: (id:number,status:OrderStatus) => request<Order>(`/orders/${id}/status?status=${status}`,{method:'PATCH'}),
    markPaymentOnDeliveryAsPaid: (id:number) => request<Order>(`/admin/orders/${id}/mark-paid`,{method:'PATCH'}),
    deliveryOrders: () => request<DeliveryOrder[]>('/delivery/orders'),
    setDeliveryRouteOrder: (id:number,order:number) => request<DeliveryOrder>(`/delivery/orders/${id}/route?order=${order}`,{method:'PATCH'}),
    deliverOrder: (id:number,proof:File) => { const form=new FormData(); form.append('proof',proof); return request<DeliveryOrder>(`/delivery/orders/${id}/deliver`,{method:'POST',body:form}); },
    reportSummary: () => request<ReportSummary>('/admin/reports/summary'),
}

export const auth = { tokenKey: TOKEN_KEY, roleKey: 'acaivis_role', isLoggedIn: () => Boolean(localStorage.getItem(TOKEN_KEY)), role: () => localStorage.getItem('acaivis_role') as 'ADMIN'|'DELIVERER'|null, logout: () => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem('acaivis_role') } }
export { API_URL }
