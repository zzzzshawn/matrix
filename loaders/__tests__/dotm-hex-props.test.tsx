import { render, screen } from "@testing-library/react";
import type { ComponentType } from "react";

import { DotmHex1 } from "../loaders/dotm-hex-1";
import { DotmHex10 } from "../loaders/dotm-hex-10";
import { DotmHex2 } from "../loaders/dotm-hex-2";
import { DotmHex3 } from "../loaders/dotm-hex-3";
import { DotmHex4 } from "../loaders/dotm-hex-4";
import { DotmHex5 } from "../loaders/dotm-hex-5";
import { DotmHex6 } from "../loaders/dotm-hex-6";
import { DotmHex7 } from "../loaders/dotm-hex-7";
import { DotmHex8 } from "../loaders/dotm-hex-8";
import { DotmHex9 } from "../loaders/dotm-hex-9";
import type { DotMatrixCommonProps } from "../types";

const hexLoaders: Array<[string, ComponentType<DotMatrixCommonProps>]> = [
  ["DotmHex1", DotmHex1],
  ["DotmHex2", DotmHex2],
  ["DotmHex3", DotmHex3],
  ["DotmHex4", DotmHex4],
  ["DotmHex5", DotmHex5],
  ["DotmHex6", DotmHex6],
  ["DotmHex7", DotmHex7],
  ["DotmHex8", DotmHex8],
  ["DotmHex9", DotmHex9],
  ["DotmHex10", DotmHex10]
];

describe("dotm hex loaders", () => {
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

  it.each(hexLoaders)("%s wires shared visual and layout props", (_name, Loader) => {
    const { container } = render(
      <Loader
        ariaLabel="Hex loading"
        animated={false}
        boxSize={80}
        cellPadding={4}
        className="outer-slot"
        color="rgb(12, 34, 56)"
        dotClassName="custom-dot"
        dotShape="hearts"
        dotSize={6}
        minSize={64}
        muted
        opacityBase={0.11}
        opacityMid={0.44}
        opacityPeak={0.88}
        pattern="cross"
        size={48}
        speed={2}
      />
    );

    const status = screen.getByRole("status", { name: "Hex loading" });
    expect(status.classList.contains("outer-slot")).toBe(true);
    expect(status.style.width).toBe("80px");
    expect(status.style.height).toBe("80px");
    expect(status.style.minWidth).toBe("64px");
    expect(status.style.minHeight).toBe("64px");

    const matrix = container.querySelector<HTMLElement>(".dmx-root");
    expect(matrix).toBeTruthy();
    expect(matrix?.classList.contains("dmx-muted")).toBe(true);
    expect(matrix?.classList.contains("dmx-dot-shape-hearts")).toBe(true);
    expect(matrix?.style.color).toBe("rgb(12, 34, 56)");
    expect(matrix?.style.getPropertyValue("--dmx-opacity-base")).toBe("0.11");
    expect(matrix?.style.getPropertyValue("--dmx-opacity-mid")).toBe("0.44");
    expect(matrix?.style.getPropertyValue("--dmx-opacity-peak")).toBe("0.88");
    expect(matrix?.style.transform).toContain("scale");

    const dots = Array.from(container.querySelectorAll<HTMLElement>(".dmx-dot"));
    expect(dots).toHaveLength(19);
    expect(dots.every((dot) => dot.classList.contains("custom-dot"))).toBe(true);
    expect(dots.some((dot) => dot.classList.contains("dmx-inactive"))).toBe(true);
  });
});
