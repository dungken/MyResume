import colorName from 'color-name';

// function hex to color name
export default function hexToColorName(hex: string): string {
    const hexColor = hex.replace('#', '').toLowerCase();
    const color = (colorName as any)[hexColor];
    return color ? color : 'Invalid color';
}
