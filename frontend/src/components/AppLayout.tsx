import { FileSignature, KeyRound, ListChecks, PlusCircle } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";

export function AppLayout() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <FileSignature size={24} />
          <span>Prueba Tecnica Michael Page</span>
        </div>
        <nav className="nav">
          <NavLink to="/solicitudes">
            <ListChecks size={18} />
            Solicitudes
          </NavLink>
          <NavLink to="/solicitudes/nueva">
            <PlusCircle size={18} />
            Nueva solicitud
          </NavLink>
          <NavLink to="/aprobacion">
            <KeyRound size={18} />
            Acceso aprobador
          </NavLink>
        </nav>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
