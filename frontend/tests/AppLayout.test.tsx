import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { AppLayout } from "../src/components/AppLayout";

describe("AppLayout", () => {
  it("renders navigation and outlet", () => {
    const router = createMemoryRouter([
      {
        path: "/",
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <div>Contenido</div>
          }
        ]
      }
    ]);

    render(<RouterProvider router={router} />);

    expect(screen.getByText("AMM")).toBeInTheDocument();
    expect(screen.getByText("Solicitudes")).toBeInTheDocument();
    expect(screen.getByText("Nueva solicitud")).toBeInTheDocument();
    expect(screen.getByText("Acceso aprobador")).toBeInTheDocument();
    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });
});
