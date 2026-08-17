import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import { env } from "../../config/env.js";
import { Approver, PurchaseRequest } from "../../database/models.js";
import { AppError } from "../../shared/errors/AppError.js";

export class EvidenceService {
  async generate(request: PurchaseRequest, approvers: Approver[]) {
    const directory = path.resolve(process.cwd(), env.PDF_LOCAL_DIR);
    await fs.promises.mkdir(directory, { recursive: true });
    const filePath = path.join(directory, `${request.id}.pdf`);

    await new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument({ margin: 48 });
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);
      doc.fontSize(20).text("Evidencia de solicitud de compra");
      doc.moveDown();
      doc.fontSize(12).text(`Solicitud: ${request.title}`);
      doc.text(`Descripcion: ${request.description}`);
      doc.text(`Monto: ${Number(request.amount).toLocaleString("es-CO", { style: "currency", currency: "COP" })}`);
      doc.text(`Solicitante: ${request.requesterName}`);
      doc.text(`Fecha de creacion: ${request.createdAt.toISOString()}`);
      doc.moveDown();
      doc.fontSize(14).text("Aprobadores");
      doc.moveDown(0.5);

      approvers.forEach((approver, index) => {
        const date = approver.signedAt ?? approver.rejectedAt;
        doc.fontSize(11).text(`${index + 1}. ${approver.name} <${approver.email}>`);
        doc.text(`Estado: ${approver.status}`);
        doc.text(`Firma registrada: ${date ? date.toISOString() : "Pendiente"}`);
        doc.moveDown(0.5);
      });

      doc.end();

      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    return {
      path: filePath,
      key: `${request.id}.pdf`
    };
  }

  async getReadableFile(request: PurchaseRequest) {
    if (!request.evidencePath) {
      throw new AppError("La evidencia PDF no está disponible", 404, "PDF_NOT_AVAILABLE");
    }

    try {
      await fs.promises.access(request.evidencePath, fs.constants.R_OK);
      return request.evidencePath;
    } catch {
      throw new AppError("La evidencia PDF no está disponible", 404, "PDF_NOT_AVAILABLE");
    }
  }
}

export const evidenceService = new EvidenceService();
