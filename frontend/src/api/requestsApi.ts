import { CreateRequestInput } from "../schemas/requestSchema";
import { ApiResponse, PurchaseRequest } from "./types";
import { http } from "./http";

export const requestsApi = {
  async create(input: CreateRequestInput) {
    const response = await http.post<ApiResponse<PurchaseRequest>>("/solicitudes", input);
    return response.data.data;
  },
  async list() {
    const response = await http.get<ApiResponse<PurchaseRequest[]>>("/solicitudes");
    return response.data.data;
  },
  async detail(id: string) {
    const response = await http.get<ApiResponse<PurchaseRequest>>(`/solicitudes/${id}`);
    return response.data.data;
  }
};
