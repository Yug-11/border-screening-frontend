import { cloneElement, useEffect, useId, useRef, useState } from 'react';
import cn from '../../utils/cn';

export default function Tooltip({ content, children }) {
  const id = useId();
  const rootRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [position, setPosition] = useState({ left: 0, above: false });
  const visible = (hovered || focused) && !dismissed;
  function reposition() {
    const bounds = rootRef.current.getBoundingClientRect();
    const width = Math.min(240, window.innerWidth - 32);
    setPosition({
      left: Math.max(16 - bounds.left, Math.min(0, window.innerWidth - 16 - bounds.left - width)),
      above: bounds.bottom + 128 > window.innerHeight,
    });
  }
  useEffect(() => {
    if (!visible) return;
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [visible]);
  return (
    <span
      ref={rootRef}
      className="relative inline-flex"
      onMouseEnter={() => {
        reposition();
        setHovered(true);
        setDismissed(false);
      }}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => {
        reposition();
        setFocused(true);
        setDismissed(false);
      }}
      onBlur={() => setFocused(false)}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && visible) {
          setDismissed(true);
          event.stopPropagation();
        }
      }}
    >
      {cloneElement(children, {
        'aria-describedby': cn(children.props['aria-describedby'], visible && id) || undefined,
      })}
      {visible && (
        <span
          className={cn(
            'absolute z-30 w-max max-w-[min(15rem,calc(100vw-2rem))]',
            position.above ? 'bottom-full pb-2' : 'top-full pt-2',
          )}
          style={{ left: position.left }}
        >
          <span
            id={id}
            role="tooltip"
            className="block rounded-control bg-navy px-3 py-2 text-caption text-surface shadow-panel"
          >
            {content}
          </span>
        </span>
      )}
    </span>
  );
}
