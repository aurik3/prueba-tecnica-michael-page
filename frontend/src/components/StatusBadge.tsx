import { ApproverStatus, RequestStatus } from "../api/types";

type Props = {
  status: RequestStatus | ApproverStatus;
};

const labels: Record<RequestStatus | ApproverStatus, string> = {
  PENDING: "Pendiente",
  SIGNED: "Firmado",
  REJECTED: "Rechazado",
  COMPLETED: "Completada"
};

export function StatusBadge({ status }: Props) {
  return <span className={`status status-${status.toLowerCase()}`}>{labels[status]}</span>;
}
