import { render, screen } from "@testing-library/react";

import { DotMatrixIcon } from "../loaders/dot-matrix-icon";

describe("DotMatrixIcon", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      (query: string): MediaQueryList => ({
        media: query,
        matches: false,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn()
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders with role=status and aria label", () => {
    render(<DotMatrixIcon ariaLabel="Matrix loading" />);
    expect(screen.getByRole("status", { name: "Matrix loading" })).toBeTruthy();
  });
});
