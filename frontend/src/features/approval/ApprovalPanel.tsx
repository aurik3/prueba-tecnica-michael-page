import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, KeyRound, Loader2, Send, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { approvalsApi } from "../../api/approvalsApi";
import { getApiErrorMessage } from "../../api/http";
import { StatusBadge } from "../../components/StatusBadge";
import { OtpInput, otpSchema } from "../../schemas/approvalSchema";

export function ApprovalPanel() {
  const { token = "" } = useParams();
  const queryClient = useQueryClient();
  const form = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      code: ""
    }
  });

  const detailQuery = useQuery({
    queryKey: ["approval", token],
    queryFn: () => approvalsApi.detail(token),
    enabled: Boolean(token)
  });

  const otpMutation = useMutation({
    mutationFn: () => approvalsApi.requestOtp(token)
  });

  const verifyMutation = useMutation({
    mutationFn: (input: OtpInput) => approvalsApi.verifyOtp(token, input.code),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["approval", token] });
    }
  });

  const approveMutation = useMutation({
    mutationFn: () => approvalsApi.approve(token),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["approval", token] });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: () => approvalsApi.reject(token),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["approval", token] });
    }
  });

  const approval = detailQuery.data;
  const canAct = approval?.estado === "PENDING" && approval.solicitud?.estado === "PENDING";
  const hasOtp = approval?.otpValidatedUntil && new Date(approval.otpValidatedUntil).getTime() > Date.now();
  const pendingAction = approveMutation.isPending || rejectMutation.isPending;

  if (detailQuery.isLoading) {
    return <div className="approval-shell"><div className="panel muted">Cargando aprobación...</div></div>;
  }

  if (detailQuery.isError) {
    return <div className="approval-shell"><div className="panel alert">{getApiErrorMessage(detailQuery.error)}</div></div>;
  }

  if (!approval || !approval.solicitud) {
    return <div className="approval-shell"><div className="panel alert">No se encontró la aprobación.</div></div>;
  }

  return (
    <div className="approval-shell">
      <section className="panel approval-panel">
        <div className="panel-title">
          <div>
            <h1>{approval.solicitud.titulo}</h1>
            <p>{approval.solicitud.solicitante}</p>
          </div>
          <StatusBadge status={approval.estado} />
        </div>

        <dl className="details">
          <div>
            <dt>Monto</dt>
            <dd>{new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(approval.solicitud.monto)}</dd>
          </div>
          <div>
            <dt>Descripción</dt>
            <dd>{approval.solicitud.descripcion}</dd>
          </div>
          <div>
            <dt>Aprobador</dt>
            <dd>{approval.nombre} · {approval.email}</dd>
          </div>
        </dl>

        {canAct && (
          <div className="otp-box">
            <button className="secondary" type="button" onClick={() => otpMutation.mutate()} disabled={otpMutation.isPending}>
              {otpMutation.isPending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
              Solicitar OTP
            </button>

            {otpMutation.data && (
              <div className="otp-code">
                <KeyRound size={16} />
                <span>{otpMutation.data.code}</span>
              </div>
            )}

            {otpMutation.isError && <p className="alert">{getApiErrorMessage(otpMutation.error)}</p>}

            <form className="otp-form" onSubmit={form.handleSubmit((values) => verifyMutation.mutate(values))}>
              <label>
                Código OTP
                <input maxLength={6} {...form.register("code")} />
                <span>{form.formState.errors.code?.message}</span>
              </label>
              <button type="submit" disabled={verifyMutation.isPending}>
                {verifyMutation.isPending ? <Loader2 size={16} className="spin" /> : <KeyRound size={16} />}
                Validar
              </button>
            </form>

            {verifyMutation.isError && <p className="alert">{getApiErrorMessage(verifyMutation.error)}</p>}
            {hasOtp && <p className="success">OTP validado. Puedes registrar tu decisión.</p>}
          </div>
        )}

        {canAct && (
          <div className="decision-bar">
            <button type="button" onClick={() => approveMutation.mutate()} disabled={!hasOtp || pendingAction}>
              {approveMutation.isPending ? <Loader2 size={16} className="spin" /> : <Check size={16} />}
              Aprobar
            </button>
            <button type="button" className="danger" onClick={() => rejectMutation.mutate()} disabled={!hasOtp || pendingAction}>
              {rejectMutation.isPending ? <Loader2 size={16} className="spin" /> : <X size={16} />}
              Rechazar
            </button>
          </div>
        )}

        {(approveMutation.isError || rejectMutation.isError) && (
          <p className="alert">{getApiErrorMessage(approveMutation.error ?? rejectMutation.error)}</p>
        )}

        {!canAct && <p className="muted">Esta aprobación ya no admite cambios.</p>}
      </section>
    </div>
  );
}
