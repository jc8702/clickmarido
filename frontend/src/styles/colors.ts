// src/styles/colors.ts
export const colors = {
  orange: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A360E',
    900: '#7C2D12',
  },
  purple: {
    50: '#F3E8FF',
    100: '#E9D5FF',
    200: '#D8B4FE',
    300: '#C084FC',
    400: '#A855F7',
    500: '#8B5CF6',
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },
  green: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#22C55E',
    600: '#16A34A',
    900: '#14532D',
  },
  red: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
    900: '#7F1D1D',
  },
  yellow: {
    50: '#FEFCE8',
    100: '#FEF9C3',
    500: '#EAB308',
    600: '#CA8A04',
    900: '#713F12',
  },
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    500: '#3B82F6',
    600: '#2563EB',
    900: '#1E3A8A',
  },
};

export const semanticColors = {
  success: colors.green[500],
  error: colors.red[500],
  warning: colors.yellow[500],
  info: colors.blue[500],
  primary: colors.purple[500],
  secondary: colors.orange[500],
};

export const gradients = {
  'orange-to-purple': 'linear-gradient(135deg, #F97316 0%, #8B5CF6 100%)',
  'purple-to-orange': 'linear-gradient(90deg, #8B5CF6 0%, #F97316 100%)',
  'green-to-blue': 'linear-gradient(135deg, #22C55E 0%, #3B82F6 100%)',
};
