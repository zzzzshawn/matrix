import { clampHalo, opacityToBloomLevel, remapOpacityToTriplet, remappedOpacityQualifiesForBloom } from "./opacity-triplet";

export function dmxBloomRootActive(bloom: boolean, halo: number | undefined): boolean {
  return bloom || clampHalo(halo) > 0;
}

/** Root class when `halo` > 0 — CSS widens drop-shadow falloff for a softer, more diffuse glow. */
export function dmxBloomHaloSpreadClass(halo: number | undefined): "dmx-bloom-halo" | false {
  return clampHalo(halo) > 0 ? "dmx-bloom-halo" : false;
}

/**
 * Bloom level and dot class for one cell. `curveOpacity` is the loader’s logical opacity **before**
 * `remapOpacityToTriplet` (same as `bloom` uses today).
 */
export function dmxDotBloomParts(
  isActive: boolean,
  curveOpacity: number,
  bloom: boolean,
  halo: number | undefined,
  ob: number | undefined,
  om: number | undefined,
  op: number | undefined
): { level: number; bloomDot: boolean } {
  const haloN = clampHalo(halo);
  if (!isActive) {
    return { level: 0, bloomDot: false };
  }
  const remapped = remapOpacityToTriplet(curveOpacity, ob, om, op);
  const fromBloom = bloom ? opacityToBloomLevel(remapped) : 0;
  return {
    level: Math.max(haloN, fromBloom),
    bloomDot: haloN > 0 || (bloom && remappedOpacityQualifiesForBloom(remapped))
  };
}
