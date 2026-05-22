# UI Rules

## Foundation

- shadcn/ui style: `new-york`. Components live in `src/components/ui/`.
- Tailwind v4 with `@theme inline` tokens in `src/app/globals.css`.
- Icons: `lucide-react`, size via Tailwind (`size-4`, `size-5`).
- Animations: use the `motion-*` utilities from `globals.css` (see the
  Animation section below). Do not hand-write `data-[state=open]:animate-in
fade-in-0 zoom-in-95 ...` chains in components. Respect
  `prefers-reduced-motion` (already handled by the utilities).

## Design tokens

All design tokens are CSS variables. Source of truth: `globals.css`.

```
--bg, --surface, --card,
--text, --text-secondary,
--border,
--primary, --primary-hover, --primary-foreground,
--secondary, --secondary-foreground,
--accent, --accent-foreground, --soft-accent,
--muted, --muted-foreground,
--destructive, --destructive-foreground,
--input, --ring, --radius
```

- Light values in `:root`, dark in `.dark`.
- Never hardcode colors in components. Use Tailwind classes that map to the
  tokens (`bg-background`, `text-text`, `border-border`, `text-primary`,
  `bg-soft-accent`, etc.).

## Components in `components/ui/`

- Dumb, presentational, fully controlled.
- Type props with `React.ComponentProps<'tag'>` and extend via `&`.
- Compose visual variants with `cva`.
- Add `data-slot="<name>"` for theme/style overrides.
- Do not import from `features/`, `entities/`, `shared/store`, `shared/api`,
  `shared/query`.

Example:

```tsx
import * as React from 'react';

import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils';

const cardVariants = cva('rounded-lg border bg-card text-card-foreground shadow-sm', {
  variants: {
    padding: { sm: 'p-3', md: 'p-4', lg: 'p-6' },
  },
  defaultVariants: { padding: 'md' },
});

type Props = React.ComponentProps<'div'> & VariantProps<typeof cardVariants>;

export function Card({ className, padding, ...props }: Props) {
  return <div data-slot='card' className={cn(cardVariants({ padding }), className)} {...props} />;
}
```

## Layout

- Use a consistent container: `mx-auto max-w-6xl px-4`.
- Vertical rhythm via `py-{8|12|16}`.
- Spacing: prefer Tailwind spacing scale; avoid arbitrary pixel values.
- Section anatomy: `<section>` → optional `<header>` with `<h2>` →
  content → optional `<footer>`.

## Typography

- `<h1>` once per page. Size by Tailwind `text-3xl` to `text-5xl`.
- Body: `text-base text-text` / `text-sm text-text-secondary`.
- Use `tracking-tight` for headings.
- Line length: cap at `max-w-prose` for long-form content.

## States

- Buttons: `default`, `outline`, `ghost`, `secondary`, `destructive`, `link`.
- Sizes: `sm`, `default`, `lg`, `icon`.
- Disabled state: `disabled:opacity-50 disabled:pointer-events-none`.
- Focus ring: `focus-visible:ring-ring/50 focus-visible:ring-[3px]`.

## Loading and empty states

- Provide a skeleton for any list/detail that fetches data
  (`components/shared/skeletons/*` or in the feature folder).
- Empty state must include: icon, headline, description, primary action.

## Animation

### CSS transitions

- Default transition: `transition-{colors|transform|all} duration-200 ease-out`.
- Theme transition is global in `globals.css` (300ms).
- Respect `prefers-reduced-motion: reduce`. Disable or shorten.

### Motion tokens

Single source of truth for any open/close animation lives in
`globals.css`:

- Durations: `--motion-duration-fast` (140ms), `--motion-duration-base`
  (220ms), `--motion-duration-slow` (320ms).
- Easings: `--motion-ease-out` (soft pop, enter), `--motion-ease-in`
  (mirror for exit), `--motion-ease-standard` (generic fade/overlay).

Never hardcode durations or easings in components. If a specific component
needs a different rhythm — override the token inline in `className`:

```tsx
<PopoverContent className='[--motion-duration-base:300ms]' />
```

### `motion-*` utilities

Use these on the **root content element** of any Radix component that has
`data-state="open|closed"`. They wire up `animate-in`/`animate-out` from
`tw-animate-css`, hook into Radix `data-side`, and pull duration/easing
from motion tokens. `prefers-reduced-motion` is honored automatically.

| Utility          | When to use                                                                          |
| ---------------- | ------------------------------------------------------------------------------------ |
| `motion-pop`     | Popover, Dropdown/Context menu, Select content, Tooltip, Dialog content, Hover card. |
| `motion-fade`    | Toast, inline hint, subtle reveal without movement.                                  |
| `motion-overlay` | Dialog/Sheet backdrop. Pure fade.                                                    |

`motion-pop` does: fade + light zoom (0.96 → 1) + 0.5rem slide from the
anchor side (`data-side` aware). Enter 220ms ease-out, exit 140ms ease-in
(exits are intentionally faster).

### Pattern

Inside any new `components/ui/*.tsx` Radix wrapper, use the utility on
content:

```tsx
function PopoverContent({ className, ...props }: Props) {
  return (
    <PopoverPrimitive.Content
      className={cn('border-border bg-surface rounded-lg border shadow-lg', 'motion-pop', className)}
      {...props}
    />
  );
}
```

### Forbidden

- Hand-writing `data-[state=open]:animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 ...`
  in component files. Compose via `motion-*` utilities instead — if a new
  variation is genuinely needed, add a new `@utility` in `globals.css`.
- Hardcoded ms / cubic-bezier values in components (use motion tokens).
- Pure `animation-name: enter` without the `animate-in/out` apply or the
  full `animation` shorthand — keyframes get tree-shaken or duration stays
  at `0s` and nothing plays.
- Animating layout-affecting properties (`width`, `height`, `top`, `left`)
  inside `motion-*`. These utilities animate `opacity` + `transform` only.

## Forms

- Field anatomy: `Label` → `Input/Select/...` → `FieldDescription` →
  `FieldError`.
- Field gap: `space-y-1.5`.
- Form gap: `space-y-4` to `space-y-6`.
- Submit button right-aligned in a `flex justify-end gap-2`.

## Tables

- Use shadcn `<Table>` primitives.
- Make rows keyboard-navigable for selection actions.
- Always render an empty state row when no data.

## Dialogs / Modals

- Use shadcn `<Dialog>`.
- Mount at root, control with Zustand (`useUiStore`) or local state.
- Body lock and focus trap are handled by Radix; do not reimplement.

## Don't

- Don't restyle shadcn primitives by editing tokens locally; change the
  global CSS variables instead.
- Don't introduce new color outside the token system.
- Don't add motion that violates reduced-motion.
- Don't ship animated GIFs as decoration (use CSS/SVG).
