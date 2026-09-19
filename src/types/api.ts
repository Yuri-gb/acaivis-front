export interface Category { id: number; name: string; active: boolean }
export interface DeliveryZone { id: number; name: string; fee: number; active: boolean }
export interface DeliveryCalculation { zipCode: string; deliveryZoneId: number; deliveryZoneName: string; deliveryFee: number }
export interface Product { id: number; name: string; size: string; description: string; price: number; imageUrl?: string | null; badge?: string | null; stockQuantity: number; available: boolean; categoryId: number; categoryName: string; createdAt: string; updatedAt: string }
export interface OrderItem { productId: number; productName: string; size: string; unitPrice: number; quantity: number; subtotal: number }
export type OrderStatus = 'PENDING_PAYMENT'|'PAYMENT_PROMISED'|'PAID'|'PREPARING'|'READY'|'OUT_FOR_DELIVERY'|'DELIVERED'|'CANCELLED'
export type PaymentMethod = 'PIX'|'CREDIT_CARD'|'DEBIT_CARD'|'CASH'
export interface Order { id: number; trackingCode: string; comandaNumber: number; customerName: string; customerPhone: string; customerEmail?: string | null; address: string; street: string; number: string; complement?: string | null; neighborhood: string; city: string; state: string; zipCode: string; deliveryZoneId: number; deliveryZoneName: string; subtotal: number; deliveryFee: number; discount: number; total: number; paymentMethod: PaymentMethod; paymentConfirmed: boolean; status: OrderStatus; createdAt: string; notes?: string | null; items: OrderItem[]; deliveryRouteOrder?: number | null; deliveryProofUrl?: string | null; deliveredAt?: string | null; deliveredBy?: string | null }
export interface OrderStatusHistory { status: OrderStatus; createdAt: string }
export interface TrackingOrder { trackingCode: string; status: OrderStatus; createdAt: string; subtotal: number; deliveryFee: number; total: number; deliveryZoneName: string; address: string; paymentMethod: PaymentMethod; paymentConfirmed: boolean; items: OrderItem[] }
export interface CartItem { id: number; productId: number; image: string; name: string; description: string; unitPrice: number; quantity: number }
export interface AdminOrderPage { content: Order[]; totalElements: number; totalPages: number; currentPage: number; pageSize: number }
export interface ReportSummary { totalOrders: number; deliveredOrders: number; cancelledOrders: number; productsInCatalog: number; availableProducts: number }

export interface MercadoPagoPaymentRequest {
    paymentMethodId: string
    paymentMethodType: string
    token: string | null
    installments: number | null
    payerEmail: string
    idempotencyKey?: string
}

export interface MercadoPagoCardCheckoutResponse {\n    payment: MercadoPagoPaymentResponse\n    order: Order | null\n}\n\nexport interface MercadoPagoPaymentResponse {
    orderId: string
    paymentId: string
    status: string
    statusDetail: string
    qrCode?: string | null
    qrCodeBase64?: string | null
    ticketUrl?: string | null
    expiresAt?: string | null
}

export interface DeliveryOrder { id:number; trackingCode:string; customerName:string; customerPhone:string; address:string; neighborhood:string; city:string; state:string; zipCode:string; total:number; paymentMethod:PaymentMethod; paymentConfirmed:boolean; status:OrderStatus; items:OrderItem[]; routeOrder?:number|null; deliveryProofUrl?:string|null; deliveredAt?:string|null; deliveredBy?:string|null }
