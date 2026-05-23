export const fireConfetti = () => {
  const duration = 2.5 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    if (window.confetti) {
      window.confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#10b981', '#3b82f6', '#f43f5e', '#fbbf24']
      });
      window.confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#10b981', '#3b82f6', '#f43f5e', '#fbbf24']
      });
    }

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
};
