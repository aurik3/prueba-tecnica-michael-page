import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const accessSchema = z.object({
  tokenOrUrl: z.string().trim().min(10, "Ingresa un token o enlace válido")
});

type AccessInput = z.infer<typeof accessSchema>;

export function ApprovalAccessPage() {
  const navigate = useNavigate();
  const form = useForm<AccessInput>({
    resolver: zodResolver(accessSchema),
    defaultValues: {
      tokenOrUrl: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    const token = values.tokenOrUrl.split("/").filter(Boolean).at(-1) ?? values.tokenOrUrl;
    navigate(`/aprobacion/${token}`);
  });

  return (
    <div className="page-grid">
      <section className="page-header">
        <div>
          <h1>Acceso de aprobadores</h1>
          <p>Ingresa el enlace único o token de aprobación para continuar con OTP.</p>
        </div>
      </section>
      <form className="panel access-panel" onSubmit={onSubmit}>
        <div className="panel-title">
          <h2>Validar enlace</h2>
          <KeyRound size={22} />
        </div>
        <label>
          Link o token
          <input {...form.register("tokenOrUrl")} />
          <span>{form.formState.errors.tokenOrUrl?.message}</span>
        </label>
        <button type="submit">
          <ArrowRight size={16} />
          Continuar
        </button>
      </form>
    </div>
  );
}
