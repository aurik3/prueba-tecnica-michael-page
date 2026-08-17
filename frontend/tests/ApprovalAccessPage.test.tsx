import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { ApprovalAccessPage } from "../src/pages/ApprovalAccessPage";

function LocationView() {
  const location = useLocation();

  return <div>{location.pathname}</div>;
}

describe("ApprovalAccessPage", () => {
  it("navigates using a pasted approval URL", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/aprobacion"]}>
        <Routes>
          <Route path="/aprobacion" element={<ApprovalAccessPage />} />
          <Route path="/aprobacion/:token" element={<LocationView />} />
        </Routes>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText("Link o token"), "http://localhost:5173/aprobacion/token-123456");
    await user.click(screen.getByRole("button", { name: /continuar/i }));

    expect(await screen.findByText("/aprobacion/token-123456")).toBeInTheDocument();
  });
});
