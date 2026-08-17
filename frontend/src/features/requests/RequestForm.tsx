import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { getApiErrorMessage } from "../../api/http";
import { requestsApi } from "../../api/requestsApi";
import { CreateRequestInput, createRequestSchema } from "../../schemas/requestSchema";

const defaultValues: CreateRequestInput = {
  titulo: "",
  descripcion: "",
  monto: 0,
  solicitante: "",
  aprobadores: [
    { nombre: "", email: "" },
    { nombre: "", email: "" },
    { nombre: "", email: "" }
  ]
};

type Props = {
  onCreated?: () => void;
};

export function RequestForm({ onCreated }: Props) {
  const queryClient = useQueryClient();
  const form = useForm<CreateRequestInput>({
    resolver: zodResolver(createRequestSchema),
    defaultValues
  });

  const mutation = useMutation({
    mutationFn: requestsApi.create,
    onSuccess: async () => {
      form.reset(defaultValues);
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
      onCreated?.();
    }
  });

  const onSubmit = form.handleSubmit((values) => mutation.mutate(values));

  return (
    <form className="panel form-panel" onSubmit={onSubmit}>
      <div className="panel-title">
        <h2>Nueva solicitud</h2>
        <button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? <Loader2 size={16} className="spin" /> : <Plus size={16} />}
          Crear
        </button>
      </div>

      {mutation.isError && <p className="alert">{getApiErrorMessage(mutation.error)}</p>}

      <div className="form-grid">
        <label>
          Solicitante
          <input {...form.register("solicitante")} />
          <span>{form.formState.errors.solicitante?.message}</span>
        </label>
        <label>
          Monto
          <input type="number" step="0.01" {...form.register("monto")} />
          <span>{form.formState.errors.monto?.message}</span>
        </label>
      </div>

      <label>
        Título
        <input {...form.register("titulo")} />
        <span>{form.formState.errors.titulo?.message}</span>
      </label>

      <label>
        Descripción
        <textarea rows={4} {...form.register("descripcion")} />
        <span>{form.formState.errors.descripcion?.message}</span>
      </label>

      <div className="approver-grid">
        {defaultValues.aprobadores.map((_, index) => (
          <div className="approver-box" key={index}>
            <strong>Aprobador {index + 1}</strong>
            <label>
              Nombre
              <input {...form.register(`aprobadores.${index}.nombre`)} />
              <span>{form.formState.errors.aprobadores?.[index]?.nombre?.message}</span>
            </label>
            <label>
              Correo
              <input {...form.register(`aprobadores.${index}.email`)} />
              <span>{form.formState.errors.aprobadores?.[index]?.email?.message}</span>
            </label>
          </div>
        ))}
      </div>
    </form>
  );
}
