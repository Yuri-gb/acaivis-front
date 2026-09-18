import acaiTradicional from '../assets/images/products/acai-tradicional.webp'
import acaiLeite from '../assets/images/products/acai-leite.webp'
import acaiMorango from '../assets/images/products/acai-morango.webp'
export function productImage(imageUrl:string|null|undefined,name:string){ if(imageUrl) return imageUrl; const n=name.toLowerCase(); if(n.includes('morango')) return acaiMorango; if(n.includes('leite')) return acaiLeite; return acaiTradicional }
