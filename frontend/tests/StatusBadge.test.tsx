import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "../src/components/StatusBadge";

describe("StatusBadge", () => {
  it("renders pending label", () => {
    render(<StatusBadge status="PENDING" />);

    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  it("renders completed label", () => {
    render(<StatusBadge status="COMPLETED" />);

    expect(screen.getByText("Completada")).toBeInTheDocument();
  });
});
