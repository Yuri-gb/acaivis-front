Acaivis - reestruturacao da tela de Produtos Admin

Substitua somente estes arquivos no frontend existente:
- src/App.tsx
- src/services/api.ts
- src/pages/Admin/Admin.css
- src/pages/Admin/ProductsAdmin.tsx
- src/pages/Admin/ProductForm.tsx (novo)

Nao altera src/types/api.ts.

Rotas adicionadas:
- /admin/produtos
- /admin/produtos/novo
- /admin/produtos/:id/editar

API usada para a listagem administrativa:
GET /api/admin/products?page=0&size=10&search=...&categoryId=...&available=...

Acoes administrativas de reativacao:
PATCH /api/admin/products/{id}/reactivate
