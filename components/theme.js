import { Platform } from 'react-native';

export const colors = {
    // Brand
    gold: '#FEC029',
    onGold: '#111111',

    // Surfaces, darkest to lightest
    bg: '#0B0B0C',
    surface: '#17181B',
    surfaceAlt: '#222328',
    border: '#2E2F36',

    // Text
    text: '#F5F5F7',
    textMuted: '#9A9CA5',

    // Status
    success: '#34C759',
    danger: '#FF453A',

    // Kept for existing imports
    black: '#000',
    white: '#fff',
};

// Keyboard for number fields. iOS number pads (numeric / decimal-pad) have no Return key, so the keyboard's
// Next button can't exist on them; this layout opens on digits and still has Return. Android's numeric pad
// already has a Next/Done key.
export const numericKeyboard = Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'numeric';

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 };

export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

export const font = {
    title: { fontSize: 22, fontWeight: '700', color: colors.text },
    heading: { fontSize: 17, fontWeight: '600', color: colors.text },
    body: { fontSize: 16, color: colors.text },
    caption: { fontSize: 13, color: colors.textMuted },
};

// Stack header shared by every screen (see App.js).
export const headerOptions = {
    headerStyle: { backgroundColor: colors.bg },
    headerTintColor: colors.gold,
    headerTitleStyle: { fontWeight: '600', fontSize: 18, color: colors.text },
    headerShadowVisible: false,
    contentStyle: { backgroundColor: colors.bg },
};

// Event scores below the 60-point minimum read as failing, 90+ as excellent.
export const scoreColor = (score) => {
    if (score < 60) return colors.danger;
    if (score >= 90) return colors.success;
    return colors.gold;
};
