import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type PointerEvent
} from 'react'

import {
    FaCamera,
    FaCheck,
    FaRoute,
    FaSearch,
    FaSignOutAlt
} from 'react-icons/fa'

import {
    api,
    auth,
    ApiError
} from '../../services/api'

import type {
    DeliveryOrder
} from '../../types/api'

import './DeliveryAdmin.css'


const money = (n: number) =>
    n.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })


const paymentLabel = (m: string) =>
    m === 'CASH'
        ? 'Pagamento na entrega'
        : m === 'PIX'
            ? 'PIX'
            : m === 'CREDIT_CARD'
                ? 'Cartão de crédito'
                : 'Cartão de débito'


export default function DeliveryAdmin() {

    const [orders, setOrders] =
        useState<DeliveryOrder[]>([])

    const [search, setSearch] =
        useState('')

    const [loading, setLoading] =
        useState(false)

    const [selected, setSelected] =
        useState<DeliveryOrder | null>(null)

    const [photo, setPhoto] =
        useState<File | null>(null)

    const [preview, setPreview] =
        useState('')

    const [error, setError] =
        useState('')

    const [draggingId, setDraggingId] =
        useState<number | null>(null)

    const [dragOverIndex, setDragOverIndex] =
        useState<number | null>(null)

    const [savingRoute, setSavingRoute] =
        useState(false)

    /*
     * Distância que o card acompanha o dedo.
     */
    const [dragOffset, setDragOffset] =
        useState({
            x: 0,
            y: 0
        })

    /*
     * Posição inicial do dedo.
     */
    const dragStartPoint = useRef({
        x: 0,
        y: 0
    })

    const inputRef =
        useRef<HTMLInputElement>(null)

    const dragPointerId =
        useRef<number | null>(null)


    const load = async () => {

        setLoading(true)

        try {

            setOrders(
                await api.deliveryOrders()
            )

        } catch (e) {

            setError(
                e instanceof ApiError
                    ? e.message
                    : 'Não foi possível carregar as entregas.'
            )

        } finally {

            setLoading(false)

        }
    }


    useEffect(() => {
        load()
    }, [])


    const filtered = useMemo(() => {

        const q =
            search
                .trim()
                .toUpperCase()

        if (!q) {
            return orders
        }

        return orders.filter(o =>
            o.trackingCode
                .toUpperCase()
                .includes(q) ||

            o.trackingCode
                .replace(/^AC-/, '')
                .includes(q) ||

            o.customerName
                .toUpperCase()
                .includes(q) ||

            o.neighborhood
                .toUpperCase()
                .includes(q)
        )

    }, [orders, search])


    const choosePhoto = (file?: File) => {

        if (!file) {
            return
        }

        setPhoto(file)

        setPreview(
            URL.createObjectURL(file)
        )

        setError('')
    }


    const deliver = async () => {

        if (!selected || !photo) {
            return
        }

        setLoading(true)

        try {

            await api.deliverOrder(
                selected.id,
                photo
            )

            setSelected(null)

            setPhoto(null)

            setPreview('')

            await load()

        } catch (e) {

            setError(
                e instanceof ApiError
                    ? e.message
                    : 'Não foi possível registrar a entrega.'
            )

        } finally {

            setLoading(false)

        }
    }


    /*
     * =========================
     * INÍCIO DO ARRASTE
     * =========================
     */

    const handleDragStart = (
        e: PointerEvent<HTMLElement>,
        orderId: number,
        index: number
    ) => {

        if (savingRoute) {
            return
        }

        e.currentTarget.setPointerCapture(
            e.pointerId
        )

        dragPointerId.current =
            e.pointerId

        /*
         * Guarda onde o dedo começou.
         */

        dragStartPoint.current = {
            x: e.clientX,
            y: e.clientY
        }

        /*
         * Começa sem deslocamento.
         */

        setDragOffset({
            x: 0,
            y: 0
        })

        setDraggingId(orderId)

        setDragOverIndex(index)

        setError('')
    }


    /*
     * =========================
     * MOVIMENTO DO ARRASTE
     * =========================
     */

    const handleDragMove = (
        e: PointerEvent<HTMLElement>
    ) => {

        if (
            draggingId === null ||
            dragPointerId.current !== e.pointerId
        ) {
            return
        }

        /*
         * Calcula quanto o dedo se moveu.
         */

        const deltaX =
            e.clientX -
            dragStartPoint.current.x

        const deltaY =
            e.clientY -
            dragStartPoint.current.y

        /*
         * O card acompanha o dedo.
         *
         * Limitamos um pouco o movimento horizontal
         * para evitar que ele saia demais da tela.
         */

        const limitedX =
            Math.max(
                -70,
                Math.min(70, deltaX)
            )

        setDragOffset({
            x: limitedX,
            y: deltaY
        })

        /*
         * Descobre sobre qual card o dedo está.
         */

        const element =
            document.elementFromPoint(
                e.clientX,
                e.clientY
            )

        const card =
            element?.closest(
                '[data-delivery-index]'
            ) as HTMLElement | null

        if (!card) {
            return
        }

        const index =
            Number(
                card.dataset.deliveryIndex
            )

        if (!Number.isNaN(index)) {
            setDragOverIndex(index)
        }
    }


    /*
     * =========================
     * FIM DO ARRASTE
     * =========================
     */

    const handleDragEnd = async (
        e: PointerEvent<HTMLElement>
    ) => {

        if (
            draggingId === null ||
            dragPointerId.current !== e.pointerId
        ) {
            return
        }

        const currentDraggingId =
            draggingId

        const currentOverIndex =
            dragOverIndex

        /*
         * Guarda o card que estava sendo arrastado.
         */

        const currentElement =
            e.currentTarget

        /*
         * Remove imediatamente o estado de arraste.
         */

        setDraggingId(null)

        setDragOverIndex(null)

        dragPointerId.current = null

        /*
         * Faz o card voltar visualmente.
         */

        setDragOffset({
            x: 0,
            y: 0
        })

        if (
            currentOverIndex === null
        ) {
            return
        }

        const visibleIndex =
            filtered.findIndex(
                o =>
                    o.id ===
                    currentDraggingId
            )

        if (
            visibleIndex === -1 ||
            visibleIndex ===
                currentOverIndex
        ) {
            return
        }

        /*
         * Reordena os cards atualmente visíveis.
         */

        const reorderedFiltered = [
            ...filtered
        ]

        const [movedOrder] =
            reorderedFiltered.splice(
                visibleIndex,
                1
            )

        reorderedFiltered.splice(
            currentOverIndex,
            0,
            movedOrder
        )

        /*
         * Se houver uma busca ativa,
         * preservamos os demais pedidos.
         */

        const visibleIds =
            new Set(
                filtered.map(
                    o => o.id
                )
            )

        const reorderedIds =
            reorderedFiltered.map(
                o => o.id
            )

        let reorderedOrders:
            DeliveryOrder[]

        if (search.trim()) {

            let filteredPosition = 0

            reorderedOrders =
                orders.map(order => {

                    if (
                        !visibleIds.has(
                            order.id
                        )
                    ) {
                        return order
                    }

                    const replacementId =
                        reorderedIds[
                            filteredPosition++
                        ]

                    return (
                        orders.find(
                            o =>
                                o.id ===
                                replacementId
                        ) ?? order
                    )
                })

        } else {

            reorderedOrders =
                reorderedFiltered
        }

        /*
         * Atualização visual imediata.
         */

        setOrders(
            reorderedOrders
        )

        /*
         * Persiste a nova rota.
         */

        setSavingRoute(true)

        try {

            for (
                let index = 0;
                index <
                reorderedOrders.length;
                index++
            ) {

                const order =
                    reorderedOrders[index]

                const newRouteOrder =
                    index + 1

                if (
                    order.routeOrder !==
                    newRouteOrder
                ) {

                    await api.setDeliveryRouteOrder(
                        order.id,
                        newRouteOrder
                    )
                }
            }

            await load()

        } catch (err) {

            setError(
                err instanceof ApiError
                    ? err.message
                    : 'Não foi possível salvar a rota.'
            )

            await load()

        } finally {

            setSavingRoute(false)
        }

        /*
         * Evita o warning de referência não utilizada
         * em alguns ambientes.
         */

        void currentElement
    }


    return (
        <div className="delivery-page">

            <header className="delivery-header">

                <div>

                    <div className="delivery-brand">
                        Açaívis
                    </div>

                    <div className="delivery-role">
                        Entregas
                    </div>

                </div>

                <button
                    onClick={() => {

                        auth.logout()

                        location.href =
                            '/admin/login'

                    }}
                    title="Sair"
                >
                    <FaSignOutAlt />
                </button>

            </header>


            <main className="delivery-main">

                <div className="delivery-top">

                    <div>

                        <h1>
                            Minhas entregas
                        </h1>

                        <p>
                            Organize sua rota e registre cada entrega.
                        </p>

                    </div>

                    <button
                        className="delivery-refresh"
                        onClick={load}
                        disabled={
                            loading ||
                            savingRoute
                        }
                    >

                        {loading
                            ? 'Atualizando...'
                            : 'Atualizar'}

                    </button>

                </div>


                {error && (
                    <div className="delivery-error">
                        {error}
                    </div>
                )}


                <div className="delivery-search">

                    <FaSearch />

                    <input
                        value={search}
                        onChange={e =>
                            setSearch(
                                e.target.value
                            )
                        }
                        placeholder="Buscar pelos últimos 6 caracteres do pedido..."
                    />

                    <small>
                        Ex.: 7F2K9A ou AC-7F2K9A
                    </small>

                </div>


                <div className="delivery-list">

                    {filtered.map(
                        (o, index) => {

                            const isDragging =
                                draggingId ===
                                o.id

                            const isDragOver =
                                dragOverIndex ===
                                    index &&
                                draggingId !==
                                    null &&
                                draggingId !==
                                    o.id

                            /*
                             * Inclinação baseada no movimento
                             * horizontal do dedo.
                             */

                            const rotation =
                                isDragging
                                    ? dragOffset.x *
                                      0.035
                                    : 0

                            return (
                                <article
                                    className={[
                                        'delivery-card',

                                        isDragging
                                            ? 'delivery-card-dragging'
                                            : '',

                                        isDragOver
                                            ? 'delivery-card-drag-over'
                                            : ''
                                    ].join(' ')}

                                    key={o.id}

                                    data-delivery-index={
                                        index
                                    }

                                    onPointerDown={e =>
                                        handleDragStart(
                                            e,
                                            o.id,
                                            index
                                        )
                                    }

                                    onPointerMove={
                                        handleDragMove
                                    }

                                    onPointerUp={
                                        handleDragEnd
                                    }

                                    onPointerCancel={
                                        handleDragEnd
                                    }

                                    style={{
                                        touchAction:
                                            'none',

                                        userSelect:
                                            'none',

                                        transform:
                                            isDragging
                                                ? `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) scale(1.035) rotate(${rotation}deg)`
                                                : undefined,

                                        zIndex:
                                            isDragging
                                                ? 50
                                                : undefined
                                    }}
                                >

                                    <div className="delivery-card-head">

                                        <div>

                                            <strong>
                                                {o.trackingCode}
                                            </strong>

                                            <span>
                                                {o.customerName}
                                            </span>

                                        </div>

                                        <span className="delivery-order-number">
                                            #{index + 1}
                                        </span>

                                    </div>


                                    <div className="delivery-address">

                                        <strong>
                                            {o.neighborhood}
                                        </strong>

                                        <span>
                                            {o.address}
                                        </span>

                                    </div>


                                    <div className="delivery-meta">

                                        <span>
                                            {money(
                                                Number(
                                                    o.total
                                                )
                                            )}
                                        </span>

                                        <span>
                                            {paymentLabel(
                                                o.paymentMethod
                                            )}
                                        </span>

                                    </div>


                                    <div className="delivery-actions">

                                        <div className="route-control">

                                            <FaRoute />

                                            <span
                                                style={{
                                                    fontSize:
                                                        '11px',

                                                    opacity:
                                                        0.65
                                                }}
                                            >
                                                Arraste para organizar
                                            </span>

                                        </div>


                                        <button
                                            className="delivery-btn"

                                            onPointerDown={
                                                e =>
                                                    e.stopPropagation()
                                            }

                                            onClick={() => {

                                                setSelected(
                                                    o
                                                )

                                                setPhoto(
                                                    null
                                                )

                                                setPreview(
                                                    ''
                                                )

                                            }}
                                        >

                                            <FaCamera />

                                            Registrar entrega

                                        </button>

                                    </div>

                                </article>
                            )
                        }
                    )}


                    {filtered.length ===
                        0 &&
                        !loading && (
                            <div className="delivery-empty">
                                Nenhuma entrega encontrada.
                            </div>
                        )}

                </div>

            </main>


            {selected && (

                <div className="delivery-modal-backdrop">

                    <section className="delivery-modal">

                        <button
                            className="delivery-modal-close"
                            onClick={() =>
                                setSelected(
                                    null
                                )
                            }
                        >
                            ×
                        </button>


                        <h2>
                            Registrar entrega
                        </h2>


                        <p>

                            <strong>
                                {selected.trackingCode}
                            </strong>

                            {' · '}

                            {selected.customerName}

                        </p>


                        <div className="delivery-confirm-box">

                            <span>
                                Total
                            </span>

                            <strong>
                                {money(
                                    Number(
                                        selected.total
                                    )
                                )}
                            </strong>

                            <small>
                                {paymentLabel(
                                    selected.paymentMethod
                                )}
                            </small>

                        </div>


                        {selected.paymentMethod ===
                            'CASH' &&
                            !selected.paymentConfirmed && (

                                <div className="delivery-cash-warning">

                                    Confirme o recebimento de{' '}

                                    <strong>
                                        {money(
                                            Number(
                                                selected.total
                                            )
                                        )}
                                    </strong>{' '}

                                    antes de concluir.

                                </div>

                            )}


                        {/*
                         * Input invisível.
                         *
                         * capture="environment"
                         * solicita a câmera traseira
                         * em dispositivos móveis.
                         */}

                        <input
                            ref={inputRef}
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="delivery-file"
                            onChange={e =>
                                choosePhoto(
                                    e.target.files?.[0]
                                )
                            }
                        />


                        {preview ? (

                            <img
                                className="delivery-preview"
                                src={preview}
                                alt="Prévia da foto da entrega"
                            />

                        ) : (

                            <button
                                type="button"
                                className="delivery-photo-placeholder"
                                onClick={() =>
                                    inputRef.current?.click()
                                }
                            >

                                <FaCamera />

                                <span>
                                    Tirar foto da entrega
                                </span>

                                <small>
                                    A foto é obrigatória.
                                </small>

                            </button>

                        )}


                        <div className="delivery-modal-actions">

                            <button
                                className="delivery-secondary"
                                onClick={() =>
                                    setSelected(
                                        null
                                    )
                                }
                            >
                                Voltar
                            </button>


                            <button
                                className="delivery-btn"
                                disabled={
                                    !photo ||
                                    loading
                                }
                                onClick={deliver}
                            >

                                <FaCheck />

                                {loading
                                    ? 'Registrando...'
                                    : 'Confirmar entrega'}

                            </button>

                        </div>

                    </section>

                </div>

            )}

        </div>
    )
}