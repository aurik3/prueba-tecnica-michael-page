import { RequestsList } from "../features/requests/RequestsList";

export function RequestsListPage() {
  return (
    <div className="page-grid">
      <section className="page-header">
        <div>
          <h1>Panel de solicitudes</h1>
          <p>Consulta el avance de cada solicitud y descarga la evidencia al completarse.</p>
        </div>
      </section>
      <RequestsList />
    </div>
  );
}
