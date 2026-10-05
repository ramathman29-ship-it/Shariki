/** Centered message for empty lists and errors. `icon` is a lucide component. */
export default function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="sh-empty">
      {Icon && <Icon size={40} aria-hidden="true" />}
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {action}
    </div>
  );
}
