import { render } from "@testing-library/react";

import {
  ReducedMotionOverrideProvider,
  usePrefersReducedMotion
} from "../hooks/use-prefers-reduced-motion";
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

  it("allows scoped override to disable reduced motion for previews", () => {
    function Probe() {
      const reducedMotion = usePrefersReducedMotion();
      return <span data-testid="reduced-motion">{String(reducedMotion)}</span>;
    }

    const { getByTestId } = render(
      <ReducedMotionOverrideProvider reducedMotion={false}>
        <Probe />
      </ReducedMotionOverrideProvider>
    );

    expect(getByTestId("reduced-motion").textContent).toBe("false");
  });
});
