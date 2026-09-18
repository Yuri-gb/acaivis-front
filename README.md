# Açaívis Frontend

Frontend da loja Açaívis integrado à Açaívis API.

## Stack
- React + TypeScript + Vite
- React Router
- React Icons
- API REST em Spring Boot
- MercadoPago.js para tokenização segura de cartões

## Configuração
Crie `.env` na raiz:

```env
VITE_API_URL=http://localhost:8080/api
VITE_MERCADOPAGO_PUBLIC_KEY=SUA_PUBLIC_KEY_DE_TESTE
```

A Public Key pode ficar no frontend. O Access Token do Mercado Pago **não** deve ser colocado neste projeto; ele permanece somente no backend.

Depois:

```bash
npm install
npm run dev
```

## Checkout
A tela `/finalizar-pedido` segue a referência visual oficial do Açaívis e já está preparada para:

- Dados pessoais e CPF
- Consulta automática de CEP via ViaCEP
- Endereço e região de entrega
- Pix com QR Code e código copia e cola
- Cartão de crédito e débito com CardForm do Mercado Pago
- Tokenização do cartão no navegador
- Criação do pedido na Açaívis API
- Criação do pagamento pela Açaívis API
- Resumo do carrinho e alteração de quantidades
- Acompanhamento do pedido após a criação

O MercadoPago.js é carregado pelo SDK oficial no navegador, usando a Public Key configurada em `VITE_MERCADOPAGO_PUBLIC_KEY`.

## Rotas
- `/` — loja
- `/produtos` — catálogo consumindo a API
- `/produtos/:id` — detalhe do produto
- `/carrinho` — carrinho local
- `/finalizar-pedido` — checkout integrado
- `/rastrear-pedido` — rastreamento
- `/admin/login` — login administrativo
- `/admin` — painel administrativo

O carrinho continua no `localStorage`; o preço, estoque, taxa de entrega e total do pedido são recalculados pelo backend no checkout.

## Observações
- O Webhook do Mercado Pago continua sendo uma etapa posterior, quando a API estiver publicada em uma URL HTTPS acessível externamente.
- O Access Token do Mercado Pago nunca deve ser exposto no frontend.
- As imagens existentes do projeto continuam sendo usadas como fallback quando `imageUrl` do produto vier vazio.
