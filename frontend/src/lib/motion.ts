export const motion = {
  durations: {
    fast: '150ms',
    base: '300ms',
    slow: '500ms',
  },
  easings: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    spring: 'cubic-bezier(0.16, 1, 0.3, 1)',
  },
  presets: {
    fadeIn: 'fadeIn 300ms ease-out forwards',
    slideUp: 'slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
    scaleIn: 'scaleIn 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
    bounce: 'bounce 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
  }
};
