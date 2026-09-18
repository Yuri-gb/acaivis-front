import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { auth, api } from '../../services/api';
import './Admin.css';

function Admin() {
  const nav = useNavigate();
  const [summary, setSummary] = useState<any>();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.reportSummary().then(setSummary).catch(e => {
      if (e.status === 401) {
        auth.logout();
        nav('/admin/login');
      }
    });
  }, [nav]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  const logout = () => {
    auth.logout();
    closeMenu();
    nav('/admin/login');
  };

  return (
    <div className="admin-page">
      <div className="admin-shell">
        <header className="admin-mobile-header">
          <div className="admin-mobile-brand">
            <div className="admin-mobile-brand-name">Açaívis</div>
            <div className="admin-mobile-brand-role">Admin</div>
          </div>

          <button
            type="button"
            className={`admin-menu-toggle ${menuOpen ? 'is-open' : ''}`}
            onClick={() => setMenuOpen(value => !value)}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </header>

        <div
          className={`admin-sidebar-overlay ${menuOpen ? 'is-visible' : ''}`}
          onClick={closeMenu}
          aria-hidden="true"
        />

        <aside className={`admin-sidebar ${menuOpen ? 'is-open' : ''}`}>
          <div className="admin-brand">Açaívis Admin</div>

          <nav className="admin-nav">
            <NavLink end to="/admin" onClick={closeMenu}>Dashboard</NavLink>
            <NavLink to="/admin/pedidos" onClick={closeMenu}>Pedidos</NavLink>
            <NavLink to="/admin/produtos" onClick={closeMenu}>Produtos</NavLink>
            <NavLink to="/admin/catalogo" onClick={closeMenu}>Categorias & Bairros</NavLink>
            <NavLink to="/admin/relatorios" onClick={closeMenu}>Relatórios</NavLink>

            <button type="button" onClick={logout}>Sair</button>
          </nav>
        </aside>

        <section className="admin-content">
          <Outlet context={{ summary }} />
        </section>
      </div>
    </div>
  );
}

export default Admin;
