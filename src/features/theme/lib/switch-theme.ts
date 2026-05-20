/**
 * Плавно переключает тему без глобальных transition в простое.
 *
 * Стратегия:
 *  1. Если браузер поддерживает View Transitions API — используем нативный
 *     кроссфейд (`document.startViewTransition`). Это даёт идеально плавный
 *     переход без перерисовки всего дерева через CSS transition.
 *  2. Иначе — на короткий промежуток вешаем класс `theme-transition` на
 *     <html>. Только под этим классом активны CSS transition для
 *     background-color / border-color / color (см. globals.css). Класс
 *     снимается через 300ms, чтобы дальше hover/focus работали мгновенно.
 *  3. При `prefers-reduced-motion: reduce` — мгновенное переключение.
 */

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> };
};

const TRANSITION_CLASS = 'theme-transition';
const TRANSITION_DURATION_MS = 300;

export function switchTheme(apply: () => void): void {
  if (typeof document === 'undefined') {
    apply();

    return;
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    apply();

    return;
  }

  const doc = document as DocumentWithViewTransition;

  if (typeof doc.startViewTransition === 'function') {
    doc.startViewTransition(apply);

    return;
  }

  const root = document.documentElement;
  root.classList.add(TRANSITION_CLASS);
  apply();

  window.setTimeout(() => {
    root.classList.remove(TRANSITION_CLASS);
  }, TRANSITION_DURATION_MS);
}
