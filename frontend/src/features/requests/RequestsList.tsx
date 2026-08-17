import { useQuery } from "@tanstack/react-query";
import { Eye, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { getApiErrorMessage } from "../../api/http";
import { requestsApi } from "../../api/requestsApi";
import { StatusBadge } from "../../components/StatusBadge";

export function RequestsList() {
  const query = useQuery({
    queryKey: ["requests"],
    queryFn: requestsApi.list
  });

  if (query.isLoading) {
    return <div className="panel muted">Cargando solicitudes...</div>;
  }

  if (query.isError) {
    return <div className="panel alert">{getApiErrorMessage(query.error)}</div>;
  }

  return (
    <section className="panel">
      <div className="panel-title">
        <h2>Solicitudes creadas</h2>
        <button type="button" className="secondary" onClick={() => query.refetch()}>
          <RefreshCw size={16} />
          Actualizar
        </button>
      </div>

      <div className="request-list">
        {query.data?.map((request) => (
          <article className="request-item" key={request.id}>
            <div className="request-head">
              <div>
                <h3>{request.titulo}</h3>
                <p>{request.solicitante} · {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(request.monto)}</p>
              </div>
              <StatusBadge status={request.estado} />
            </div>

            <div className="request-meta">
              <span>{request.aprobadores.length} aprobadores</span>
              <span>{request.createdAt}</span>
            </div>

            <Link className="link-button" to={`/solicitudes/${request.id}`}>
              <Eye size={16} />
              Ver detalle
            </Link>
          </article>
        ))}
        {query.data?.length === 0 && <p className="muted">Aún no hay solicitudes registradas.</p>}
      </div>
    </section>
  );
}
