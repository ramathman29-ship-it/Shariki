import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import useClickOutside from "@/hooks/useClickOutside";

/**
 * Branded dropdown (native <select> menus can't be styled).
 * Keyboard: ↑/↓ to move, Enter/Space to pick, Esc to close, type to jump.
 *
 * @param {{ value: string, onChange: (v: string) => void, options: { value: string, label: string }[],
 *           label?: string, icon?: React.ComponentType, variant?: "field" | "pill", className?: string }} props
 */
export default function Select({ value, onChange, options, label, icon: Icon, variant = "field", className = "" }) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const ref = useRef(null);
  const listRef = useRef(null);
  const id = useId();
  const close = useCallback(() => setOpen(false), []);
  useClickOutside(ref, close, open);

  const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
  const selected = options[selectedIndex];

  useEffect(() => {
    if (open) setActive(selectedIndex);
  }, [open, selectedIndex]);

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const pick = (i) => {
    onChange(options[i].value);
    setOpen(false);
  };

  const onKeyDown = (e) => {
    if (!open && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
      e.preventDefault();
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      pick(active);
    } else if (e.key === "Escape" || e.key === "Tab") {
      setOpen(false);
    } else if (e.key.length === 1) {
      const i = options.findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase()));
      if (i >= 0) setActive(i);
    }
  };

  return (
    <div ref={ref} className={`sh-select2 sh-select2--${variant} ${open ? "is-open" : ""} ${className}`}>
      <button
        type="button"
        className="sh-select2__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
      >
        {Icon && <Icon size={16} className="sh-select2__icon" />}
        <span className="sh-select2__value">{selected?.label}</span>
        <ChevronDown size={16} className="sh-select2__chevron" />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={`${id}-list`}
          className="sh-select2__menu"
          role="listbox"
          aria-label={label}
          aria-activedescendant={`${id}-${active}`}
        >
          {options.map((o, i) => (
            <li
              key={o.value}
              id={`${id}-${i}`}
              role="option"
              aria-selected={o.value === value}
              className={`sh-select2__option ${i === active ? "is-active" : ""} ${o.value === value ? "is-selected" : ""}`}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(i)}
            >
              <span>{o.label}</span>
              {o.value === value && <Check size={16} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
