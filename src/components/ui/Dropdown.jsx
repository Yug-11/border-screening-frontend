import { useEffect, useId, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Button from './Button';
import cn from '../../utils/cn';

export default function Dropdown({
  label = 'Actions',
  items = [],
  align = 'left',
  disabled = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const startAtEnd = useRef(false);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const buttons = menuRef.current.querySelectorAll('[role="menuitem"]:not(:disabled)');
    (startAtEnd.current ? buttons[buttons.length - 1] : buttons[0])?.focus();
    function outside(event) {
      if (!rootRef.current.contains(event.target)) setOpen(false);
    }
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  function close(restoreFocus = true) {
    setOpen(false);
    if (restoreFocus) triggerRef.current.focus();
  }
  function navigate(event) {
    const buttons = [...menuRef.current.querySelectorAll('[role="menuitem"]:not(:disabled)')];
    const current = buttons.indexOf(document.activeElement);
    let next;
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'ArrowDown') next = (current + 1) % buttons.length;
    if (event.key === 'ArrowUp') next = (current - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && event.key !== ' ') {
      const ordered = [...buttons.slice(current + 1), ...buttons.slice(0, current + 1)];
      const match = ordered.find((button) =>
        button.textContent.trim().toLowerCase().startsWith(event.key.toLowerCase()),
      );
      if (match) {
        event.preventDefault();
        match.focus();
      }
      return;
    }
    if (next !== undefined && buttons.length) {
      event.preventDefault();
      buttons[next].focus();
    }
  }
  return (
    <div
      ref={rootRef}
      className="relative inline-block"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <Button
        ref={triggerRef}
        variant="outline"
        disabled={disabled}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        onClick={() => {
          startAtEnd.current = false;
          setOpen(!open);
        }}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            startAtEnd.current = event.key === 'ArrowUp';
            setOpen(true);
          }
        }}
      >
        {label}
        <ChevronDown className="icon-sm" aria-hidden="true" />
      </Button>
      {open && (
        <div
          ref={menuRef}
          id={id}
          role="menu"
          aria-label={label}
          onKeyDown={navigate}
          className={cn(
            'absolute top-full z-30 mt-1 min-w-48 rounded-panel border border-default bg-surface p-1 shadow-md',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={item.disabled}
              onClick={() => {
                close();
                item.onSelect?.();
              }}
              className={cn(
                'flex min-h-9 w-full items-center gap-2 rounded-control px-3 py-2 text-left text-body hover:bg-subtle focus-visible:bg-subtle disabled:opacity-50',
                item.danger ? 'text-danger' : 'text-ink',
              )}
            >
              {item.icon && <item.icon aria-hidden="true" className="icon-sm" />}
              {item.label}
            </button>
          ))}
          {!items.length && (
            <p className="px-3 py-2 text-caption text-muted">No actions available</p>
          )}
        </div>
      )}
    </div>
  );
}
