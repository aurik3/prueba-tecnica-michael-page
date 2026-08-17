import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Download, ExternalLink, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { getApiErrorMessage } from "../api/http";
import { requestsApi } from "../api/requestsApi";
import { StatusBadge } from "../components/StatusBadge";

export function RequestDetailPage() {
  const { id = "" } = useParams();
  const query = useQuery({
    queryKey: ["request", id],
    queryFn: () => requestsApi.detail(id),
    enabled: Boolean(id)
  });

  if (query.isLoading) {
    return <div className="panel muted">Cargando detalle...</div>;
  }

  if (query.isError) {
    return <div className="panel alert">{getApiErrorMessage(query.error)}</div>;
  }

  if (!query.data) {
    return <div className="panel alert">No se encontró la solicitud.</div>;
  }

  const request = query.data;

  return (
    <div className="page-grid">
      <section className="page-header">
        <div>
          <h1>{request.titulo}</h1>
          <p>{request.solicitante} · {new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(request.monto)}</p>
        </div>
        <StatusBadge status={request.estado} />
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>Detalle de solicitud</h2>
          <div className="actions">
            <Link className="link-button secondary" to="/solicitudes">
              <ArrowLeft size={16} />
              Volver
            </Link>
            <button type="button" className="secondary" onClick={() => query.refetch()}>
              <RefreshCw size={16} />
              Actualizar
            </button>
          </div>
        </div>

        <dl className="details">
          <div>
            <dt>Descripción</dt>
            <dd>{request.descripcion}</dd>
          </div>
          <div>
            <dt>Fecha</dt>
            <dd>{request.createdAt}</dd>
          </div>
          <div>
            <dt>Estado</dt>
            <dd><StatusBadge status={request.estado} /></dd>
          </div>
        </dl>

        {request.evidenciaUrl && (
          <a className="download" href={request.evidenciaUrl} target="_blank" rel="noreferrer">
            <Download size={16} />
            Descargar PDF
          </a>
        )}
      </section>

      <section className="panel">
        <div className="panel-title">
          <h2>Estado de aprobadores</h2>
        </div>
        <div className="approver-statuses">
          {request.aprobadores.map((approver) => (
            <div key={approver.id} className="approver-status detail-approver">
              <span>{approver.nombre}</span>
              <StatusBadge status={approver.estado} />
              <small>{approver.signedAt ?? approver.rejectedAt ?? "Pendiente de firma"}</small>
              <a href={approver.enlaceAprobacion} target="_blank" rel="noreferrer">
                <ExternalLink size={15} />
              </a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
