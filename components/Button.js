import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { colors, radius } from './theme';

// variant: 'primary' (gold fill), 'secondary' (outline), 'danger' (red outline), 'text' (gold link)
export default function Button({ title, onPress, variant = 'primary', disabled = false, style, textStyle, icon, iconColor, iconSize }) {
    const isText = variant === 'text';
    const label = labelStyles[variant] || labelStyles.primary;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
            accessibilityRole="button"
            style={[
                isText ? styles.textButton : styles.button,
                buttonStyles[variant],
                icon && styles.withIcon,
                disabled && styles.disabled,
                style,
            ]}
        >
            <Text style={[styles.label, label, textStyle]}>{title}</Text>
            {icon && (
                <FontAwesomeIcon icon={icon} color={iconColor || label.color} size={iconSize} style={styles.icon} />
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: radius.md,
        paddingVertical: 14,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },
    textButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 8,
        minHeight: 44,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    disabled: {
        opacity: 0.5,
    },
    withIcon: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 8,
    },
});

const buttonStyles = {
    primary: { backgroundColor: colors.gold },
    secondary: { backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
    danger: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.danger },
    text: {},
};

const labelStyles = {
    primary: { color: colors.onGold },
    secondary: { color: colors.text },
    danger: { color: colors.danger },
    text: { color: colors.gold, fontWeight: '500' },
};
