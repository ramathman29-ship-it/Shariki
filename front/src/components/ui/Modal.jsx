import { useEffect } from "react";

/** Dialog with backdrop; closes on Escape and backdrop click. */
export default function Modal({ open, onClose, title, description, children, as: Tag = "div", ...rest }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="sh-modal" onClick={onClose}>
      <Tag
        className="sh-modal__box"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        {...rest}
      >
        {title && <h3>{title}</h3>}
        {description && <p>{description}</p>}
        {children}
      </Tag>
    </div>
  );
}
