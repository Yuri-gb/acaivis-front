import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { api, ApiError } from '../../services/api'
import type { Category, Product } from '../../types/api'
import './Admin.css'

const empty = {
  name: '', size: '', description: '', price: '', imageUrl: '', badge: '',
  stockQuantity: '0', available: true, categoryId: '',
}

type FormState = typeof empty

type ProductFormProps = {
  mode: 'create' | 'edit'
}

export default function ProductForm({ mode }: ProductFormProps) {
  const navigate = useNavigate()
  const { id } = useParams()
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<FormState>(empty)
  const [imageFile, setImageFile] = useState<File>()
  const [imagePreview, setImagePreview] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(mode === 'edit')
  const [error, setError] = useState('')

  const title = mode === 'edit' ? 'Editar produto' : 'Novo produto'
  const submitLabel = mode === 'edit' ? 'Salvar alterações' : 'Cadastrar produto'

  const activeCategories = useMemo(() => categories.filter(category => category.active), [categories])

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const categoriesPromise = api.categories()
        const productPromise = mode === 'edit' && id ? api.product(Number(id)) : Promise.resolve(undefined)
        const [loadedCategories, product] = await Promise.all([categoriesPromise, productPromise])
        if (!mounted) return
        setCategories(loadedCategories)
        if (product) fillProduct(product)
      } catch (e) {
        if (!mounted) return
        setError(e instanceof ApiError ? e.message : 'Não foi possível carregar o produto.')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [mode, id])

  useEffect(() => {
    if (!imageFile) return
    const url = URL.createObjectURL(imageFile)
    setImagePreview(url)
    return () => URL.revokeObjectURL(url)
  }, [imageFile])

  const fillProduct = (product: Product) => {
    setForm({
      name: product.name,
      size: product.size,
      description: product.description,
      price: String(product.price),
      imageUrl: product.imageUrl || '',
      badge: product.badge || '',
      stockQuantity: String(product.stockQuantity),
      available: product.available,
      categoryId: String(product.categoryId),
    })
    setImageFile(undefined)
    setImagePreview('')
  }

  const update = (key: keyof FormState, value: string | boolean) => {
    setForm(current => ({ ...current, [key]: value } as FormState))
  }

  const selectImage = (file?: File) => {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('A imagem deve ser JPG, PNG ou WebP.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('A imagem deve ter no máximo 5 MB.')
      return
    }
    setError('')
    setImageFile(file)
  }

  const save = async () => {
    setError('')
    if (!form.categoryId) {
      setError('Selecione uma categoria.')
      return
    }
    setSaving(true)
    try {
      let imageUrl = form.imageUrl || ''
      if (imageFile) {
        const uploaded = await api.uploadProductImage(imageFile)
        imageUrl = uploaded.imageUrl
      }

      const payload = {
        ...form,
        imageUrl,
        price: Number(form.price),
        stockQuantity: Number(form.stockQuantity),
        categoryId: Number(form.categoryId),
      }

      if (mode === 'edit' && id) await api.updateProduct(Number(id), payload)
      else await api.createProduct(payload)

      navigate('/admin/produtos')
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Não foi possível salvar o produto.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="admin-panel"><p>Carregando produto...</p></div>
  }

  return (
    <>
      <div className="admin-top product-form-header">
        <div>
          <Link to="/admin/produtos" className="admin-back-link"><FaArrowLeft /> Produtos</Link>
          <h1>{title}</h1>
          <p>{mode === 'edit' ? 'Atualize os dados do produto.' : 'Cadastre um novo produto no catálogo.'}</p>
        </div>
      </div>

      <div className="admin-panel">
        <div className="admin-form">
          <label>Nome<input value={form.name} onChange={e => update('name', e.target.value)} required /></label>
          <label>Tamanho<input value={form.size} onChange={e => update('size', e.target.value)} required /></label>
          <label>Preço<input type="number" min="0" step="0.01" value={form.price} onChange={e => update('price', e.target.value)} required /></label>
          <label>Estoque<input type="number" min="0" step="1" value={form.stockQuantity} onChange={e => update('stockQuantity', e.target.value)} required /></label>
          <label>Badge<input value={form.badge} onChange={e => update('badge', e.target.value)} placeholder="Opcional" /></label>

          <div className="admin-image-field">
            <label>Imagem do produto</label>
            <div className="admin-image-upload">
              {imagePreview ? (
                <div className="admin-image-preview">
                  <img src={imagePreview} alt="Pré-visualização do produto" />
                  <div className="admin-image-preview-actions">
                    <label className="admin-btn secondary admin-image-change">Trocar imagem<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => selectImage(e.target.files?.[0])} /></label>
                  </div>
                </div>
              ) : form.imageUrl ? (
                <div className="admin-image-preview">
                  <img src={form.imageUrl} alt={form.name || 'Imagem do produto'} />
                  <div className="admin-image-preview-actions">
                    <label className="admin-btn secondary admin-image-change">Trocar imagem<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => selectImage(e.target.files?.[0])} /></label>
                  </div>
                </div>
              ) : (
                <label className="admin-image-dropzone">
                  <strong>Selecionar imagem</strong>
                  <span>JPG, PNG ou WebP · máximo 5 MB</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => selectImage(e.target.files?.[0])} />
                </label>
              )}
            </div>
          </div>

          <label>Categoria<select value={form.categoryId} onChange={e => update('categoryId', e.target.value)} required>
            <option value="">Selecione</option>
            {activeCategories.map(category => <option key={category.id} value={category.id}>{category.name}</option>)}
          </select></label>

          <label>Disponível<select value={String(form.available)} onChange={e => update('available', e.target.value === 'true')}>
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select></label>

          <label className="full">Descrição<textarea value={form.description} onChange={e => update('description', e.target.value)} required /></label>
        </div>

        {error && <div className="admin-error">{error}</div>}

        <div className="admin-actions product-form-actions">
          <button className="admin-btn secondary" type="button" onClick={() => navigate('/admin/produtos')} disabled={saving}>Cancelar</button>
          <button className="admin-btn" type="button" onClick={save} disabled={saving}>
            {saving ? 'Salvando...' : submitLabel}
          </button>
        </div>
      </div>
    </>
  )
}
