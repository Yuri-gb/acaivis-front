import { FormEvent, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaArrowLeft, FaBoxOpen, FaCheck, FaCheckCircle, FaCircle, FaCopy, FaMapMarkerAlt, FaSearch, FaTimesCircle } from 'react-icons/fa';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import pedidoImage from '../../assets/images/pedido.png';
import { api, ApiError } from '../../services/api';
import type { OrderStatus, TrackingOrder } from '../../types/api';
import './TrackOrder.css';

const steps: OrderStatus[] = ['PAID', 'PREPARING', 'READY', 'OUT_FOR_DELIVERY', 'DELIVERED'];

const labels: Record<string, string> = {
  PENDING_PAYMENT: 'Pedido recebido',
  PAYMENT_PROMISED: 'Pedido confirmado',
  PAID: 'Pedido confirmado',
  PREPARING: 'Em preparação',
  READY: 'Pedido pronto',
  OUT_FOR_DELIVERY: 'Saiu para entrega',
  DELIVERED: 'Entregue',
  CANCELLED: 'Pedido cancelado',
};

const money = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export default function TrackOrder() {
  const [params] = useSearchParams();
  const [code, setCode] = useState(params.get('codigo') || '');
  const [order, setOrder] = useState<TrackingOrder>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const search = async (e?: FormEvent) => {
    e?.preventDefault();
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) return;

    setLoading(true);
    setError('');
    try {
      setOrder(await api.trackOrder(normalizedCode));
    } catch (e) {
      setOrder(undefined);
      setError(e instanceof ApiError ? e.message : 'Não foi possível localizar o pedido.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.get('codigo')) search();
  }, []);

  const copyCode = async () => {
    if (!order?.trackingCode) return;
    try {
      await navigator.clipboard.writeText(order.trackingCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be unavailable in some browser contexts.
    }
  };

  const currentIndex = order ? steps.indexOf(order.status) : -1;
  const isCancelled = order?.status === 'CANCELLED';
  const statusClass = isCancelled ? 'cancelled' : 'active';

  return (
    <>
      <Navbar />
      <main className="tracking-page">
        <div className="tracking-container">
          <div className="tracking-header">
            <Link to="/">
              <FaArrowLeft />
              <span>Voltar</span>
            </Link>
            <h1>
              Acompanhe seu
              <img className="tracking-title-image" src={pedidoImage} alt="pedido" />
            </h1>
            <p>Acompanhe o status do seu pedido sem precisar criar uma conta.</p>
          </div>

          <form className="tracking-search" onSubmit={search}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Ex.: AC7K4P2M"
              aria-label="Código do pedido"
              autoComplete="off"
            />
            <button type="submit" disabled={loading || !code.trim()}>
              <FaSearch />
              <span>{loading ? 'Consultando...' : 'Acompanhar pedido'}</span>
            </button>
          </form>

          {error && <div className="tracking-error">{error}</div>}

          {!order && !error && (
            <section className="tracking-empty">
              <div className="tracking-empty-icon">
                <FaBoxOpen aria-hidden="true" />
              </div>
              <h2>Digite o código do seu pedido</h2>
              <p>
                Informe o código que você recebeu no final da compra
                <br className="desktop-only" />
                para acompanhar o status em tempo real.
              </p>
            </section>
          )}

          {order && (
            <section className={`tracking-result ${isCancelled ? 'is-cancelled' : ''}`}>
              <header className="tracking-result-head">
                <div className="tracking-code-block">
                  <span>Pedido</span>
                  <div className="tracking-code-line">
                    <strong>{order.trackingCode}</strong>
                    <button type="button" className="copy-code" onClick={copyCode} aria-label="Copiar código do pedido" title="Copiar código">
                      {copied ? <FaCheck /> : <FaCopy />}
                    </button>
                    {copied && <small className="copy-feedback">Copiado</small>}
                  </div>
                </div>

                <div className={`tracking-status ${statusClass}`}>
                  <span>Status</span>
                  <strong>
                    {isCancelled ? <FaTimesCircle /> : <FaCheckCircle />}
                    {labels[order.status]}
                  </strong>
                </div>
              </header>

              {isCancelled ? (
                <div className="tracking-cancelled">
                  <div className="cancelled-icon"><FaTimesCircle /></div>
                  <div>
                    <strong>Este pedido foi cancelado.</strong>
                    <p>Se tiver dúvidas, entre em contato com o nosso time de suporte.</p>
                  </div>
                </div>
              ) : (
                <div className="tracking-timeline">
                    {steps.map((step, index) => {
                      const done = currentIndex >= index;
                      const current = order.status === step;
                      return (
                        <div className={`tracking-step ${done ? 'done' : ''} ${current ? 'current' : ''}`} key={step}>
                          <div className="tracking-step-marker">{done ? <FaCheck /> : <FaCircle />}</div>
                          <div className="tracking-step-content">
                            <strong>{labels[step]}</strong>
                            {current && <small>Status atual</small>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
              )}

              <div className="tracking-order-grid">
                <div className="tracking-items-column">
                  <h2>Itens do pedido</h2>
                  {order.items.map((item) => (
                    <div className="tracking-item" key={`${item.productId}-${item.size}`}>
                      <div className="tracking-item-info">
                        <span>{item.quantity}× {item.productName}</span>
                        <small>{item.size}</small>
                      </div>
                      <strong>{money(Number(item.subtotal))}</strong>
                    </div>
                  ))}
                  <div className="tracking-total">
                    <span>Total</span>
                    <strong>{money(Number(order.total))}</strong>
                  </div>
                </div>

                <div className="tracking-delivery-column">
                  <h2>Entrega</h2>
                  <div className="delivery-detail">
                    <FaMapMarkerAlt />
                    <div>
                      <strong>Endereço</strong>
                      <p>{order.address}</p>
                    </div>
                  </div>
                  <div className="delivery-detail">
                    <span className="delivery-map-icon">⌁</span>
                    <div>
                      <strong>Bairro</strong>
                      <p>{order.deliveryZoneName}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
