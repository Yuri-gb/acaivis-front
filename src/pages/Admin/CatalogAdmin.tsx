import {useEffect,useMemo,useState} from 'react';import {api,ApiError} from '../../services/api';import type {Category,DeliveryZone} from '../../types/api';import './Admin.css';
const PAGE_SIZE=10;
const money=(n:number)=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
function Pagination({page,totalPages,totalItems,label,onChange}:{page:number;totalPages:number;totalItems:number;label:string;onChange:(page:number)=>void}){
  if(totalItems<=PAGE_SIZE)return null;
  const start=(page-1)*PAGE_SIZE+1;
  const end=Math.min(page*PAGE_SIZE,totalItems);
  return <div className="admin-pagination">
    <span>Mostrando {start} a {end} de {totalItems} {label}</span>
    <div className="admin-page-controls">
      <button type="button" className="admin-page-btn" disabled={page===1} onClick={()=>onChange(page-1)} aria-label="Página anterior">‹</button>
      {Array.from({length:totalPages},(_,i)=>i+1).map(item=><button type="button" key={item} className={"admin-page-btn "+(item===page?'active':'')} onClick={()=>onChange(item)}>{item}</button>)}
      <button type="button" className="admin-page-btn" disabled={page===totalPages} onClick={()=>onChange(page+1)} aria-label="Próxima página">›</button>
    </div>
  </div>
}
export default function CatalogAdmin(){const [cats,setCats]=useState<Category[]>([]),[zones,setZones]=useState<DeliveryZone[]>([]);const [cn,setCn]=useState(''),[zn,setZn]=useState(''),[fee,setFee]=useState('');const [editCat,setEditCat]=useState<number>(),[editZone,setEditZone]=useState<number>();const [error,setError]=useState('');
const [categoryPage,setCategoryPage]=useState(1);
const [zonePage,setZonePage]=useState(1);
const [zoneSearch,setZoneSearch]=useState('');
const [zoneStatus,setZoneStatus]=useState<'ALL'|'ACTIVE'|'INACTIVE'>('ALL');
const [zoneSort,setZoneSort]=useState<'ASC'|'DESC'>('ASC');const load=()=>Promise.all([api.categories(),api.deliveryZones()]).then(([c,z])=>{setCats(c);setZones(z)});useEffect(()=>{load()},[]);const act=async(fn:()=>Promise<unknown>)=>{try{setError('');await fn();await load()}catch(e){setError(e instanceof ApiError?e.message:'Não foi possível concluir a operação.')}};
const categoryTotalPages=Math.max(1,Math.ceil(cats.length/PAGE_SIZE));
const visibleCategories=useMemo(()=>cats.slice((categoryPage-1)*PAGE_SIZE,categoryPage*PAGE_SIZE),[cats,categoryPage]);
const filteredZones=useMemo(()=>{
  const q=zoneSearch.trim().toLocaleLowerCase('pt-BR');
  return [...zones].filter(z=>(!q||z.name.toLocaleLowerCase('pt-BR').includes(q))&&(zoneStatus==='ALL'||(zoneStatus==='ACTIVE'&&z.active)||(zoneStatus==='INACTIVE'&&!z.active))).sort((a,b)=>{
    const result=a.name.localeCompare(b.name,'pt-BR');
    return zoneSort==='ASC'?result:-result;
  });
},[zones,zoneSearch,zoneStatus,zoneSort]);
const zoneTotalPages=Math.max(1,Math.ceil(filteredZones.length/PAGE_SIZE));
const visibleZones=useMemo(()=>filteredZones.slice((zonePage-1)*PAGE_SIZE,zonePage*PAGE_SIZE),[filteredZones,zonePage]);
useEffect(()=>{if(categoryPage>categoryTotalPages)setCategoryPage(categoryTotalPages)},[categoryPage,categoryTotalPages]);
useEffect(()=>{if(zonePage>zoneTotalPages)setZonePage(zoneTotalPages)},[zonePage,zoneTotalPages]);return <><div className="admin-top"><h1>Categorias & Bairros</h1></div>{error&&<div className="admin-error">{error}</div>}<div className="admin-panel"><h2>Categorias</h2><div className="admin-actions"><input placeholder="Nova categoria" value={cn} onChange={e=>setCn(e.target.value)}/><button className="admin-btn" onClick={()=>act(async()=>{if(cn.trim()){await api.createCategory(cn);setCn('');setCategoryPage(1)}})}>Adicionar</button></div>{visibleCategories.map(c=>editCat===c.id?<div className="admin-toolbar" key={c.id}><input value={cn} onChange={e=>setCn(e.target.value)}/><button className="admin-btn" onClick={()=>act(async()=>{await api.updateCategory(c.id,cn);setEditCat(undefined);setCn('')})}>Salvar</button><button className="admin-btn secondary" onClick={()=>{setEditCat(undefined);setCn('')}}>Cancelar</button></div>:<div className="admin-toolbar" key={c.id}><span>{c.name} — {c.active?'ativa':'inativa'}</span><div className="admin-inline-actions"><button className="admin-btn secondary" onClick={()=>{setEditCat(c.id);setCn(c.name)}}>Editar</button>{c.active?<button className="admin-btn danger" onClick={()=>act(()=>api.deleteCategory(c.id))}>Desativar</button>:<button className="admin-btn" onClick={()=>act(()=>api.reactivateCategory(c.id))}>Reativar</button>}</div></div> )}<Pagination page={categoryPage} totalPages={categoryTotalPages} totalItems={cats.length} label={cats.length===1?'categoria':'categorias'} onChange={setCategoryPage}/></div><div className="admin-panel"><h2>Bairros de entrega</h2><p style={{marginTop:'-0.5rem',marginBottom:'1.25rem',opacity:0.72}}>Os bairros de Feira de Santana já ficam cadastrados no sistema. Aqui você define a taxa e ativa ou desativa a entrega.</p><div className="catalog-filters"><input value={zoneSearch} onChange={e=>{setZoneSearch(e.target.value);setZonePage(1)}} placeholder="Buscar bairro..." aria-label="Buscar bairro"/><select value={zoneStatus} onChange={e=>{setZoneStatus(e.target.value as 'ALL'|'ACTIVE'|'INACTIVE');setZonePage(1)}} aria-label="Filtrar bairros"><option value="ALL">Todos os status</option><option value="ACTIVE">Ativas</option><option value="INACTIVE">Inativas</option></select><select value={zoneSort} onChange={e=>{setZoneSort(e.target.value as 'ASC'|'DESC');setZonePage(1)}} aria-label="Ordenar bairros"><option value="ASC">Ordenar por nome</option><option value="DESC">Nome: Z → A</option></select></div>{visibleZones.map(z=>editZone===z.id?<div className="admin-toolbar" key={z.id}><input value={zn} onChange={e=>setZn(e.target.value)} aria-label={`Nome do bairro ${z.name}`}/><input type="number" min="0" step="0.01" value={fee} onChange={e=>setFee(e.target.value)} aria-label={`Taxa de entrega ${z.name}`}/><button className="admin-btn" onClick={()=>act(async()=>{await api.updateZone(z.id,z.name,Number(fee));setEditZone(undefined);setZn('');setFee('')})}>Salvar</button><button className="admin-btn secondary" onClick={()=>{setEditZone(undefined);setZn('');setFee('')}}>Cancelar</button></div>:<div className="admin-toolbar" key={z.id}><span>{z.name} — {money(Number(z.fee))} — {z.active?'ativa':'inativa'}</span><div className="admin-inline-actions"><button className="admin-btn secondary" onClick={()=>{setEditZone(z.id);setFee(String(z.fee))}}>Editar</button>{z.active?<button className="admin-btn danger" onClick={()=>act(()=>api.deleteZone(z.id))}>Desativar</button>:<button className="admin-btn" onClick={()=>act(()=>api.reactivateZone(z.id))}>Ativar</button>}</div></div>)}</div></>}
