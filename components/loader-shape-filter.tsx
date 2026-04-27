"use client";

export type LoaderShape = "all" | "square" | "circular" | "triangle";

const SHAPE_OPTIONS = [
  { value: "all" as const, label: "All", fontClass: "" },
  { value: "square" as const, label: "Square", fontClass: "font-pixel-square" },
  { value: "circular" as const, label: "Circle", fontClass: "font-pixel-circle" },
  { value: "triangle" as const, label: "Triangle", fontClass: "font-pixel-triangle" },
] as const;

interface LoaderShapeFilterProps {
  active: LoaderShape;
  onChange: (shape: LoaderShape) => void;
}

export function LoaderShapeFilter({ active, onChange }: LoaderShapeFilterProps) {
  return (
    <div
      role="group"
      aria-label="Filter loaders by shape"
      className="inline-flex rounded-xl bg-surface p-1 gap-0.5"
    >
      {SHAPE_OPTIONS.map(({ value, label, fontClass }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(value)}
            className={[
              "rounded-lg px-3 sm:px-4 py-1.5 text-xs sm:text-sm leading-tight",
              "transition-[color,background-color] duration-150 ease-out",
              "outline-offset-2 focus-visible:outline-1 focus-visible:outline-(--focus-ring)",
              isActive ? "bg-bg text-fg-strong" : "text-fg-dim hover:text-fg",
              fontClass,
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
