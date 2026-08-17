import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../components/AppLayout";
import { ApprovalAccessPage } from "../pages/ApprovalAccessPage";
import { ApprovalPage } from "../pages/ApprovalPage";
import { RequestCreatePage } from "../pages/RequestCreatePage";
import { RequestDetailPage } from "../pages/RequestDetailPage";
import { RequestsListPage } from "../pages/RequestsListPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <RequestsListPage />
      },
      {
        path: "solicitudes",
        element: <RequestsListPage />
      },
      {
        path: "solicitudes/nueva",
        element: <RequestCreatePage />
      },
      {
        path: "solicitudes/:id",
        element: <RequestDetailPage />
      },
      {
        path: "aprobacion",
        element: <ApprovalAccessPage />
      },
      {
        path: "aprobacion/:token",
        element: <ApprovalPage />
      },
      {
        path: "approval/:token",
        element: <ApprovalPage />
      }
    ]
  }
]);
