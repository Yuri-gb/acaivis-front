import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEdit, FaPlus, FaRedo, FaSearch } from 'react-icons/fa'
import { api, ApiError, type AdminProductPage } from '../../services/api'
import type { Category, Product } from '../../types/api'
import './Admin.css'

const money = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ProductsAdmin() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [availability, setAvailability] = useState('')
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)
  const [totalElements, setTotalElements] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadCategories = async () => {
    try {
      setCategories(await api.categories())
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não foi possível carregar as categorias.')
    }
  }

  const loadProducts = async () => {
    setLoading(true)
    try {
      setError('')
      const result: AdminProductPage = await api.adminProductsPage({
        page,
        size,
        search: search.trim() || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        available: availability === '' ? undefined : availability === 'true',
      })
      setProducts(result.content)
      setTotalElements(result.totalElements)
      setTotalPages(result.totalPages)
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não foi possível carregar os produtos.')
      setProducts([])
      setTotalElements(0)
      setTotalPages(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => loadProducts(), 250)
    return () => window.clearTimeout(timer)
  }, [page, size, search, categoryId, availability])

  const changeFilter = (setter: (value: string) => void, value: string) => {
    setPage(0)
    setter(value)
  }

  const reactivate = async (product: Product) => {
    if (!confirm(`Reativar o produto "${product.name}"?`)) return
    try {
      setError('')
      await api.reactivateProduct(product.id)
      await loadProducts()
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não foi possível reativar o produto.')
    }
  }

  const first = totalElements === 0 ? 0 : page * size + 1
  const last = Math.min((page + 1) * size, totalElements)

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index).filter(index => {
    if (totalPages <= 7) return true
    return index === 0 || index === totalPages - 1 || Math.abs(index - page) <= 2
  })

  return (
    <>
      <div className="admin-top products-admin-header">
        <div>
          <h1>Produtos</h1>
          <p>Gerencie o catálogo de produtos da Açaívis.</p>
        </div>
        <Link className="admin-btn" to="/admin/produtos/novo">
          <FaPlus /> Novo produto
        </Link>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <div className="admin-panel products-admin-panel">
        <div className="products-toolbar">
          <div className="products-search-wrap">
            <FaSearch aria-hidden="true" />
            <input
              value={search}
              onChange={e => changeFilter(setSearch, e.target.value)}
              placeholder="Pesquisar produto..."
              aria-label="Pesquisar produto"
            />
          </div>

          <div className="products-filters">
            <select
              value={categoryId}
              onChange={e => changeFilter(setCategoryId, e.target.value)}
              aria-label="Filtrar por categoria"
            >
              <option value="">Todas as categorias</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>

            <select
              value={availability}
              onChange={e => changeFilter(setAvailability, e.target.value)}
              aria-label="Filtrar por status"
            >
              <option value="">Todos</option>
              <option value="true">Disponíveis</option>
              <option value="false">Inativos</option>
            </select>

            <select value={size} onChange={e => { setSize(Number(e.target.value)); setPage(0) }} aria-label="Quantidade por página">
              <option value="10">10 por página</option>
              <option value="20">20 por página</option>
              <option value="50">50 por página</option>
            </select>
          </div>
        </div>

        <div className="products-result-summary">
          <span>{loading ? 'Carregando produtos...' : `Mostrando ${first}–${last} de ${totalElements} produtos`}</span>
          <button className="admin-btn secondary" type="button" onClick={loadProducts} disabled={loading} title="Atualizar lista">
            <FaRedo /> Atualizar
          </button>
        </div>

        <div className="admin-table-wrap">
          <table className="admin-table products-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Categoria</th>
                <th>Preço</th>
                <th>Estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>
                    <div className="product-table-name">
                      {product.imageUrl ? <img src={product.imageUrl} alt="" /> : <span className="product-table-placeholder" />}
                      <div>
                        <strong>{product.name}</strong>
                        <small>{product.size}</small>
                      </div>
                    </div>
                  </td>
                  <td>{product.categoryName}</td>
                  <td>{money(Number(product.price))}</td>
                  <td>{product.stockQuantity}</td>
                  <td><span className={`status ${product.available ? 'AVAILABLE' : 'CANCELLED'}`}>{product.available ? 'Disponível' : 'Inativo'}</span></td>
                  <td>
                    <div className="admin-inline-actions">
                      <Link className="admin-icon-btn" to={`/admin/produtos/${product.id}/editar`} title="Editar">
                        <FaEdit />
                      </Link>
                      {product.available ? (
                        <button
                          className="admin-icon-btn product-deactivate-btn"
                          type="button"
                          title="Desativar"
                          onClick={async () => {
                            if (!confirm(`Desativar o produto "${product.name}"?`)) return
                            try {
                              setError('')
                              await api.deleteProduct(product.id)
                              await loadProducts()
                            } catch (e) {
                              setError(e instanceof ApiError ? e.message : 'Não foi possível desativar o produto.')
                            }
                          }}
                        >
                          ×
                        </button>
                      ) : (
                        <button className="admin-icon-btn" type="button" title="Reativar" onClick={() => reactivate(product)}>
                          <FaRedo />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && products.length === 0 && (
            <div className="products-empty-state">
              <strong>Nenhum produto encontrado.</strong>
              <span>Tente ajustar a pesquisa ou os filtros.</span>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="products-pagination">
            <button className="admin-btn secondary" type="button" disabled={page === 0 || loading} onClick={() => setPage(value => value - 1)}>←</button>
            {pageNumbers.map((pageNumber, index) => {
              const previous = pageNumbers[index - 1]
              const showEllipsis = index > 0 && previous !== undefined && pageNumber - previous > 1
              return (
                <span key={pageNumber} className="products-page-group">
                  {showEllipsis && <span className="products-page-ellipsis">…</span>}
                  <button className={`products-page-btn ${pageNumber === page ? 'active' : ''}`} type="button" onClick={() => setPage(pageNumber)} disabled={loading}>
                    {pageNumber + 1}
                  </button>
                </span>
              )
            })}
            <button className="admin-btn secondary" type="button" disabled={page >= totalPages - 1 || loading} onClick={() => setPage(value => value + 1)}>→</button>
          </div>
        )}
      </div>
    </>
  )
}
