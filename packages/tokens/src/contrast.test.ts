import { describe, expect, it } from 'vitest';
import { auditTheme, contrastRatio, seasons } from './contrast';
import { dark, light } from './colors';

describe('Ebenezer contrast', () => {
  it('passes AA for every required light pair', () => {
    const failed = auditTheme('light').filter((row) => !row.pass);
    expect(failed).toEqual([]);
  });

  it('passes AA for every required dark pair', () => {
    const failed = auditTheme('dark').filter((row) => !row.pass);
    expect(failed).toEqual([]);
  });

  it('keeps gold readable on surface in both modes', () => {
    expect(contrastRatio(light.gold, light.surface)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(dark.gold, dark.surface)).toBeGreaterThanOrEqual(4.5);
  });

  it('has a distinct season set, not a single brand purple', () => {
    const hexes = new Set(Object.values(seasons).map((s) => s.hex));
    expect(hexes.size).toBeGreaterThanOrEqual(5);
  });
});
