/**
 * Haptic feedback utility using Web Vibration API (`navigator.vibrate`).
 * Provides pleasant tactile feedback for mobile devices when interacting with audio controls,
 * bookmarks, reading targets, and interactive actions.
 */

export type HapticType = 'light' | 'medium' | 'heavy' | 'success' | 'double' | 'warning';

const PATTERNS: Record<HapticType, number | number[]> = {
  light: 12,            // Quick tap (e.g. play/pause toggle, button press)
  medium: 25,           // Moderate feedback (e.g. bookmarking verse, saving)
  heavy: 45,            // Strong feedback
  success: [20, 50, 40], // Double/triple pulse for task complete or reading target hit
  double: [15, 40, 15],   // Double tap pulse
  warning: [30, 40, 30, 40, 50], // Warning pulse
};

export function triggerHaptic(type: HapticType | number | number[] = 'light'): boolean {
  if (typeof window === 'undefined' || !('navigator' in window) || typeof navigator.vibrate !== 'function') {
    return false;
  }

  try {
    let pattern: number | number[];
    if (typeof type === 'string') {
      pattern = PATTERNS[type] || PATTERNS.light;
    } else {
      pattern = type;
    }

    return navigator.vibrate(pattern);
  } catch {
    // Vibration API might fail silently if restricted by browser context
    return false;
  }
}
