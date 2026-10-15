// Navigator Vibration API Haptic Controller
// Provides physical tactile feedback on supported mobile devices and browsers

class HapticsController {
  private enabled = true;

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private vibrate(pattern: number | number[]) {
    if (!this.enabled) return;
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
        navigator.vibrate(pattern);
      }
    } catch {
      // safe fallback if browser restricts vibration
    }
  }

  // Quick light tap for buttons, menus, and selecting gems
  public light() {
    this.vibrate(12);
  }

  // Medium tactile click for gem swap
  public medium() {
    this.vibrate(24);
  }

  // Tactile buzz for invalid move reversal
  public error() {
    this.vibrate([30, 40, 30]);
  }

  // Rewarding cascade match vibration that escalates with combos
  public match(multiplier = 1) {
    if (multiplier <= 1) {
      this.vibrate(35);
    } else if (multiplier === 2) {
      this.vibrate([25, 30, 35]);
    } else {
      // 3x or higher combo cascade
      this.vibrate([35, 25, 45, 25, 60]);
    }
  }

  // Heavy blast pulse for bombs, hammers, and striped jewels
  public explosion() {
    this.vibrate([45, 35, 75]);
  }

  // Sparkling wave for rainbow blasts
  public rainbow() {
    this.vibrate([20, 20, 25, 20, 30, 20, 50]);
  }

  // Triumphant victory pattern
  public victory() {
    this.vibrate([50, 40, 70, 40, 120]);
  }

  // Low rumble for level defeat
  public defeat() {
    this.vibrate([70, 50, 100]);
  }
}

export const haptic = new HapticsController();
