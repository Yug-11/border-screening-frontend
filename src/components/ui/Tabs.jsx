import { useId, useState } from 'react';
import cn from '../../utils/cn';

export default function Tabs({
  items = [],
  value,
  defaultValue,
  onChange,
  label = 'Sections',
  className,
}) {
  const prefix = useId();
  const [internalValue, setInternalValue] = useState(
    defaultValue ?? items.find((item) => !item.disabled)?.id,
  );
  const requested = value ?? internalValue;
  const active =
    items.find((item) => item.id === requested && !item.disabled)?.id ??
    items.find((item) => !item.disabled)?.id;
  function select(item) {
    if (value === undefined) setInternalValue(item.id);
    onChange?.(item.id);
  }
  function navigate(event) {
    const buttons = [...event.currentTarget.querySelectorAll('[role="tab"]:not(:disabled)')];
    const current = buttons.indexOf(document.activeElement);
    let next;
    if (event.key === 'ArrowRight') next = (current + 1) % buttons.length;
    if (event.key === 'ArrowLeft') next = (current - 1 + buttons.length) % buttons.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = buttons.length - 1;
    if (next === undefined || !buttons.length) return;
    event.preventDefault();
    buttons[next].focus();
    buttons[next].click();
  }
  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={navigate}
        className="flex gap-1 overflow-x-auto border-b border-default p-1"
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            id={prefix + '-tab-' + index}
            role="tab"
            type="button"
            disabled={item.disabled}
            aria-selected={active === item.id}
            aria-controls={prefix + '-panel-' + index}
            tabIndex={active === item.id ? 0 : -1}
            onClick={() => select(item)}
            className={cn(
              'min-h-10 shrink-0 border-b-2 px-4 py-2 text-body font-semibold disabled:opacity-50',
              active === item.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:bg-subtle',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {items.map((item, index) => (
        <div
          key={item.id}
          id={prefix + '-panel-' + index}
          role="tabpanel"
          aria-labelledby={prefix + '-tab-' + index}
          hidden={active !== item.id}
          tabIndex={0}
          className="pt-5"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
