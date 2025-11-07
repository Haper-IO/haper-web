# Haper Spacing System

A consistent spacing system helps create visual harmony, improve readability, and make the UI more predictable.

## Base Unit

Our spacing system is built on a base unit of **4px**. This aligns with Tailwind CSS's default spacing scale, where 1 spacing unit = 0.25rem = 4px (at the default font size).

## Spacing Scale

| Tailwind Class | Rem Value | Pixels  | Use Case                                     |
|----------------|-----------|---------|----------------------------------------------|
| `space-0`      | 0         | 0px     | No spacing                                   |
| `space-0.5`    | 0.125rem  | 2px     | Minimal separation (icons from text)         |
| `space-1`      | 0.25rem   | 4px     | Tight spacing (related elements)             |
| `space-1.5`    | 0.375rem  | 6px     | Compact list items                           |
| `space-2`      | 0.5rem    | 8px     | Standard spacing between related elements    |
| `space-3`      | 0.75rem   | 12px    | Spacing between grouped components           |
| `space-4`      | 1rem      | 16px    | Section spacing, paragraph margins           |
| `space-6`      | 1.5rem    | 24px    | Spacing between major UI sections            |
| `space-8`      | 2rem      | 32px    | Large section breaks                         |
| `space-12`     | 3rem      | 48px    | Major layout divisions                       |
| `space-16`     | 4rem      | 64px    | Page section spacing                         |

## Application Guidelines

### Component Internal Spacing

- **Buttons**: `px-4 py-2` for default, `px-3 py-1.5` for small
- **Cards**: `p-4` or `p-6` depending on content density
- **Form fields**: `py-1.5 px-3` for inputs
- **Icons with text**: Gap of `gap-1.5` to `gap-2`

### Layout Spacing

- **Between sidebar sections**: `my-2` to `my-4`
- **Between list items**: `space-y-1` for compact lists, `space-y-2` for normal lists
- **Between form fields**: `space-y-4`
- **Page sections**: `py-8` to `py-16`

### Sidebar-Specific Spacing

- **Menu items**: `py-1.5 px-4`
- **Section dividers**: `my-2`
- **Section headers**: `px-3 py-1.5`
- **Between sections**: `gap-1` to `gap-2`

## Implementation Tips

1. **Consistency**: Use the same spacing values repeatedly rather than arbitrary values
2. **Rhythm**: Create visual rhythm by using consistent spacing between similar elements
3. **Density**: Adjust spacing based on information density needs
4. **Hierarchy**: Use larger spacing to indicate separate sections, smaller spacing for related items
5. **Responsive**: Consider how spacing should adapt on different screen sizes

## Practical Examples

### High-Density UI (like sidebars)
- Related items: `space-y-1`
- Section breaks: `my-2`
- Internal padding: `px-4 py-1.5`

### Standard Content Areas
- Related items: `space-y-2`
- Section breaks: `my-4`
- Internal padding: `px-6 py-4`

### Spacious Marketing Pages
- Related items: `space-y-4`
- Section breaks: `my-12`
- Internal padding: `px-8 py-6` 