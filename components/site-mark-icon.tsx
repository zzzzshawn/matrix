import { useId } from "react";

export type SiteMarkIconProps = {
  className?: string;
};

/** Inline SVG of the Dot Matrix site mark (same artwork as `app/icon.svg`). */
export function SiteMarkIcon({ className }: SiteMarkIconProps) {
  const uid = useId().replace(/:/g, "");
  const f0 = `${uid}-f0`;
  const f1 = `${uid}-f1`;
  const f2 = `${uid}-f2`;
  const f3 = `${uid}-f3`;
  const f4 = `${uid}-f4`;
  const f5 = `${uid}-f5`;
  const f6 = `${uid}-f6`;
  const p0 = `${uid}-p0`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 190 190"
      fill="none"
      className={className}
      aria-hidden
    >
      <g filter={`url(#${f0})`}>
        <rect width="190" height="190" rx="44" fill={`url(#${p0})`} />
        <circle
          cx="50"
          cy="50"
          r="44.6"
          stroke="black"
          strokeOpacity="0.1"
          strokeWidth="0.8"
          strokeDasharray="1.6 1.6"
        />
        <circle
          cx="140"
          cy="50"
          r="44.6"
          stroke="black"
          strokeOpacity="0.1"
          strokeWidth="0.8"
          strokeDasharray="1.6 1.6"
        />
        <circle
          cx="140"
          cy="140"
          r="44.6"
          stroke="black"
          strokeOpacity="0.1"
          strokeWidth="0.8"
          strokeDasharray="1.6 1.6"
        />
        <circle
          cx="50"
          cy="140"
          r="44.6"
          stroke="black"
          strokeOpacity="0.1"
          strokeWidth="0.8"
          strokeDasharray="1.6 1.6"
        />
        <circle
          cx="95"
          cy="95"
          r="44.6"
          stroke="black"
          strokeOpacity="0.1"
          strokeWidth="0.8"
          strokeDasharray="1.6 1.6"
        />
        <g filter={`url(#${f1})`}>
          <rect
            x="90"
            y="74.2134"
            width="30"
            height="29.9988"
            rx="14.9994"
            transform="rotate(-45 90 74.2134)"
            fill="#202020"
          />
        </g>
        <g filter={`url(#${f2})`}>
          <rect
            width="30"
            height="29.9988"
            rx="14.9994"
            transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 99.5674 74.2134)"
            fill="#202020"
          />
        </g>
        <g filter={`url(#${f3})`}>
          <rect
            x="90"
            y="116.213"
            width="30"
            height="29.9988"
            rx="14.9994"
            transform="rotate(-45 90 116.213)"
            fill="#202020"
          />
        </g>
        <g filter={`url(#${f4})`}>
          <rect
            width="30"
            height="29.9988"
            rx="14.9994"
            transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 99.5674 116.213)"
            fill="#202020"
          />
        </g>
        <g filter={`url(#${f5})`}>
          <rect
            x="114.142"
            y="95.2847"
            width="30"
            height="29.9988"
            rx="14.9994"
            transform="rotate(-45 114.142 95.2847)"
            fill="#202020"
          />
        </g>
        <g filter={`url(#${f6})`}>
          <rect
            width="30"
            height="29.9988"
            rx="14.9994"
            transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 75.4256 95.2847)"
            fill="#202020"
          />
        </g>
        <rect
          x="17.7071"
          y="94.7891"
          width="109.011"
          height="109.011"
          rx="54.5053"
          transform="rotate(-45 17.7071 94.7891)"
          stroke="black"
          strokeOpacity="0.1"
          strokeDasharray="2 2"
        />
      </g>
      <defs>
        <filter
          id={f0}
          x="0"
          y="0"
          width="190"
          height="192"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="3" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend mode="normal" in2="shape" result="effect1_innerShadow_1415_4245" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset />
          <feGaussianBlur stdDeviation="20" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_innerShadow_1415_4245"
            result="effect2_innerShadow_1415_4245"
          />
        </filter>
        <filter
          id={f1}
          x="93.2132"
          y="58.2134"
          width="35.9992"
          height="35.999"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1415_4245" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1415_4245"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1415_4245" />
        </filter>
        <filter
          id={f2}
          x="60.355"
          y="58.2134"
          width="35.9992"
          height="35.999"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1415_4245" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1415_4245"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1415_4245" />
        </filter>
        <filter
          id={f3}
          x="93.2132"
          y="100.213"
          width="35.9992"
          height="35.999"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1415_4245" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1415_4245"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1415_4245" />
        </filter>
        <filter
          id={f4}
          x="60.355"
          y="100.213"
          width="35.9992"
          height="35.999"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1415_4245" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1415_4245"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1415_4245" />
        </filter>
        <filter
          id={f5}
          x="117.355"
          y="79.2847"
          width="35.9992"
          height="35.999"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1415_4245" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1415_4245"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1415_4245" />
        </filter>
        <filter
          id={f6}
          x="36.2132"
          y="79.2847"
          width="35.9992"
          height="35.999"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="1.5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1415_4245" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1415_4245"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow_1415_4245" />
        </filter>
        <linearGradient
          id={p0}
          x1="0"
          y1="190"
          x2="343.583"
          y2="-147.25"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#808080" />
        </linearGradient>
      </defs>
    </svg>
  );
}
