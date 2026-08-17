import { ApiResponse, ApprovalDetail, PurchaseRequest } from "./types";
import { http } from "./http";

export const approvalsApi = {
  async detail(token: string) {
    const response = await http.get<ApiResponse<ApprovalDetail>>(`/aprobaciones/${token}`);
    return response.data.data;
  },
  async requestOtp(token: string) {
    const response = await http.post<ApiResponse<{ expiresAt: string; delivery: string; code: string }>>(`/aprobaciones/${token}/request-otp`);
    return response.data.data;
  },
  async verifyOtp(token: string, code: string) {
    const response = await http.post<ApiResponse<{ validatedUntil: string }>>(`/aprobaciones/${token}/verify-otp`, { code });
    return response.data.data;
  },
  async approve(token: string) {
    const response = await http.post<ApiResponse<PurchaseRequest>>(`/aprobaciones/${token}/approve`);
    return response.data.data;
  },
  async reject(token: string) {
    const response = await http.post<ApiResponse<PurchaseRequest>>(`/aprobaciones/${token}/reject`);
    return response.data.data;
  }
};
