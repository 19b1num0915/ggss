// theme
import { customPalette } from '../config';
// ----------------------------------------------------------------------

export const colorPresets = customPalette;

export const defaultPreset = colorPresets[0];
export const purplePreset = colorPresets[1];
export const cyanPreset = colorPresets[2];
export const bluePreset = colorPresets[3];
export const orangePreset = colorPresets[4];
export const redPreset = colorPresets[5];

export default function getColorPresets(presetsKey) {
  return {
    purple: purplePreset,
    cyan: cyanPreset,
    blue: bluePreset,
    orange: orangePreset,
    red: redPreset,
    default: defaultPreset
  }[presetsKey];
}
