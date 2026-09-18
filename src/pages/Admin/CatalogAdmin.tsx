import { useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '../../services/api';
import type { Category, DeliveryZone } from '../../types/api';
import './Admin.css';

const PAGE_SIZE = 10;
const money = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function Pagination({
  page,
  totalPages,
  totalItems,
  label,
  onChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  label: string;
  onChange: (page: number) => void;
}) {
  if (totalItems <= PAGE_SIZE) return null;

  const start = (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, totalItems);

  return (
    <div className="admin-pagination">
      <span>Mostrando {start} a {end} de {totalItems} {label}</span>
      <div className="admin-page-controls">
        <button type="button" className="admin-page-btn" disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Página anterior">‹</button>
        {Array.from({ length: totalPages }, (_, index) => index + 1).map((item) => (
          <button type="button" key={item} className={`admin-page-btn ${item === page ? 'active' : ''}`} onClick={() => onChange(item)}>
            {item}
          </button>
        ))}
        <button type="button" className="admin-page-btn" disabled={page === totalPages} onClick={() => onChange(page + 1)} aria-label="Próxima página">›</button>
      </div>
    </div>
  );
}

export default function CatalogAdmin() {
  const [cats, setCats] = useState<Category[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [cn, setCn] = useState('');
  const [fee, setFee] = useState('');
  const [editCat, setEditCat] = useState<number>();
  const [editZone, setEditZone] = useState<number>();
  const [error, setError] = useState('');

  const [categoryPage, setCategoryPage] = useState(1);
  const [zonePage, setZonePage] = useState(1);
  const [zoneSearch, setZoneSearch] = useState('');
  const [zoneStatus, setZoneStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');
  const [zoneSort, setZoneSort] = useState<'ASC' | 'DESC'>('ASC');

  const load = () => Promise.all([api.categories(), api.deliveryZones()]).then(([categories, deliveryZones]) => {
    setCats(categories);
    setZones(deliveryZones);
  });

  useEffect(() => {
    load();
  }, []);

  const act = async (fn: () => Promise<unknown>) => {
    try {
      setError('');
      await fn();
      await load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não foi possível concluir a operação.');
    }
  };

  const categoryTotalPages = Math.max(1, Math.ceil(cats.length / PAGE_SIZE));
  const visibleCategories = useMemo(
    () => cats.slice((categoryPage - 1) * PAGE_SIZE, categoryPage * PAGE_SIZE),
    [cats, categoryPage],
  );

  const filteredZones = useMemo(() => {
    const query = zoneSearch.trim().toLocaleLowerCase('pt-BR');

    return [...zones]
      .filter((zone) => {
        const matchesSearch = !query || zone.name.toLocaleLowerCase('pt-BR').includes(query);
        const matchesStatus =
          zoneStatus === 'ALL' ||
          (zoneStatus === 'ACTIVE' && zone.active) ||
          (zoneStatus === 'INACTIVE' && !zone.active);

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const comparison = a.name.localeCompare(b.name, 'pt-BR');
        return zoneSort === 'ASC' ? comparison : -comparison;
      });
  }, [zones, zoneSearch, zoneStatus, zoneSort]);

  const zoneTotalPages = Math.max(1, Math.ceil(filteredZones.length / PAGE_SIZE));
  const visibleZones = useMemo(
    () => filteredZones.slice((zonePage - 1) * PAGE_SIZE, zonePage * PAGE_SIZE),
    [filteredZones, zonePage],
  );

  useEffect(() => {
    if (categoryPage > categoryTotalPages) setCategoryPage(categoryTotalPages);
  }, [categoryPage, categoryTotalPages]);

  useEffect(() => {
    if (zonePage > zoneTotalPages) setZonePage(zoneTotalPages);
  }, [zonePage, zoneTotalPages]);

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Categorias &amp; Bairros</h1>
          <p className="admin-page-subtitle">Gerencie as categorias dos produtos e as configurações de entrega.</p>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-panel catalog-panel">
        <div className="catalog-section-header">
          <div>
            <h2>Categorias</h2>
            <p>Crie e gerencie as categorias dos seus produtos.</p>
          </div>
        </div>

        <div className="admin-actions">
          <input placeholder="Nome da categoria..." value={cn} onChange={(e) => setCn(e.target.value)} />
          <button type="button" className="admin-btn" onClick={() => act(async () => {
            if (cn.trim()) {
              await api.createCategory(cn.trim());
              setCn('');
              setCategoryPage(1);
            }
          })}>
            Adicionar
          </button>
        </div>

        <div className="catalog-list-head">
          <span>Nome</span>
          <span>Status</span>
          <span>Ações</span>
        </div>

        {visibleCategories.map((category) =>
          editCat === category.id ? (
            <div className="admin-toolbar catalog-row" key={category.id}>
              <input value={cn} onChange={(e) => setCn(e.target.value)} aria-label={`Nome da categoria ${category.name}`} />
              <div className="admin-inline-actions">
                <button type="button" className="admin-btn" onClick={() => act(async () => {
                  await api.updateCategory(category.id, cn.trim());
                  setEditCat(undefined);
                  setCn('');
                })}>Salvar</button>
                <button type="button" className="admin-btn secondary" onClick={() => {
                  setEditCat(undefined);
                  setCn('');
                }}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="admin-toolbar catalog-row" key={category.id}>
              <span className="catalog-name">{category.name}</span>
              <span className={`status ${category.active ? 'ACTIVE' : 'INACTIVE'}`}>
                {category.active ? 'Ativa' : 'Inativa'}
              </span>
              <div className="admin-inline-actions">
                <button type="button" className="admin-btn secondary" onClick={() => {
                  setEditCat(category.id);
                  setCn(category.name);
                }}>Editar</button>
                {category.active ? (
                  <button type="button" className="admin-btn danger" onClick={() => act(() => api.deleteCategory(category.id))}>Desativar</button>
                ) : (
                  <button type="button" className="admin-btn" onClick={() => act(() => api.reactivateCategory(category.id))}>Ativar</button>
                )}
              </div>
            </div>
          ),
        )}

        {visibleCategories.length === 0 && <div className="catalog-empty">Nenhuma categoria cadastrada.</div>}

        <Pagination
          page={categoryPage}
          totalPages={categoryTotalPages}
          totalItems={cats.length}
          label={cats.length === 1 ? 'categoria' : 'categorias'}
          onChange={setCategoryPage}
        />
      </div>

      <div className="admin-panel catalog-panel">
        <div className="catalog-section-header">
          <div>
            <h2>Bairros de entrega</h2>
            <p>Os bairros de Feira de Santana já estão cadastrados no sistema. Aqui você define a taxa e ativa ou desativa a entrega.</p>
          </div>
        </div>

        <div className="catalog-filters">
          <input
            value={zoneSearch}
            onChange={(e) => {
              setZoneSearch(e.target.value);
              setZonePage(1);
            }}
            placeholder="Buscar bairro..."
            aria-label="Buscar bairro"
          />
          <select value={zoneStatus} onChange={(e) => {
            setZoneStatus(e.target.value as 'ALL' | 'ACTIVE' | 'INACTIVE');
            setZonePage(1);
          }} aria-label="Filtrar bairros por status">
            <option value="ALL">Todos os status</option>
            <option value="ACTIVE">Ativas</option>
            <option value="INACTIVE">Inativas</option>
          </select>
          <select value={zoneSort} onChange={(e) => {
            setZoneSort(e.target.value as 'ASC' | 'DESC');
            setZonePage(1);
          }} aria-label="Ordenar bairros">
            <option value="ASC">Ordenar por nome</option>
            <option value="DESC">Nome: Z → A</option>
          </select>
        </div>

        <div className="catalog-list-head zone-head">
          <span>Bairro</span>
          <span>Taxa de entrega</span>
          <span>Status</span>
          <span>Ações</span>
        </div>

        {visibleZones.map((zone) =>
          editZone === zone.id ? (
            <div className="admin-toolbar catalog-row zone-row" key={zone.id}>
              <span className="catalog-name">{zone.name}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                aria-label={`Taxa de entrega ${zone.name}`}
              />
              <span className={`status ${zone.active ? 'ACTIVE' : 'INACTIVE'}`}>
                {zone.active ? 'Ativa' : 'Inativa'}
              </span>
              <div className="admin-inline-actions">
                <button type="button" className="admin-btn" onClick={() => act(async () => {
                  await api.updateZone(zone.id, zone.name, Number(fee));
                  setEditZone(undefined);
                  setFee('');
                })}>Salvar</button>
                <button type="button" className="admin-btn secondary" onClick={() => {
                  setEditZone(undefined);
                  setFee('');
                }}>Cancelar</button>
              </div>
            </div>
          ) : (
            <div className="admin-toolbar catalog-row zone-row" key={zone.id}>
              <span className="catalog-name">{zone.name}</span>
              <span>{money(Number(zone.fee))}</span>
              <span className={`status ${zone.active ? 'ACTIVE' : 'INACTIVE'}`}>
                {zone.active ? 'Ativa' : 'Inativa'}
              </span>
              <div className="admin-inline-actions">
                <button type="button" className="admin-btn secondary" onClick={() => {
                  setEditZone(zone.id);
                  setFee(String(zone.fee));
                }}>Editar</button>
                {zone.active ? (
                  <button type="button" className="admin-btn danger" onClick={() => act(() => api.deleteZone(zone.id))}>Desativar</button>
                ) : (
                  <button type="button" className="admin-btn" onClick={() => act(() => api.reactivateZone(zone.id))}>Ativar</button>
                )}
              </div>
            </div>
          ),
        )}

        {visibleZones.length === 0 && <div className="catalog-empty">Nenhum bairro encontrado.</div>}

        <Pagination
          page={zonePage}
          totalPages={zoneTotalPages}
          totalItems={filteredZones.length}
          label={filteredZones.length === 1 ? 'bairro' : 'bairros'}
          onChange={setZonePage}
        />
      </div>
    </>
  );
}
