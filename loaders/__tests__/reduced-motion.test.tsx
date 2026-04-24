import { render } from "@testing-library/react";

import { DotMatrixIcon } from "../loaders/dot-matrix-icon";

describe("reduced motion", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      (query: string): MediaQueryList => ({
        media: query,
        matches: true,
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

  it("disables active animation classes when reduced motion is preferred", () => {
    const { container } = render(<DotMatrixIcon animated />);
    expect(container.querySelector(".dmx-ripple")).toBeNull();
    expect(container.querySelector(".dmx-collapse")).toBeNull();
  });
});
