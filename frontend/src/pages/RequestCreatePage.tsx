import { useNavigate } from "react-router-dom";
import { RequestForm } from "../features/requests/RequestForm";

export function RequestCreatePage() {
  const navigate = useNavigate();

  return (
    <div className="page-grid">
      <section className="page-header">
        <div>
          <h1>Nueva solicitud</h1>
          <p>Registra la compra y asigna exactamente tres aprobadores.</p>
        </div>
      </section>
      <RequestForm onCreated={() => navigate("/solicitudes")} />
    </div>
  );
}
