/**
 * Underlined tabs. tabs = [{ value, label, icon?, count?, extra? }]
 */
export default function Tabs({ tabs, value, onChange }) {
  return (
    <div className="sh-tabs" role="tablist">
      {tabs.map(({ value: v, label, icon: Icon, count, extra }) => (
        <button
          key={v}
          type="button"
          role="tab"
          aria-selected={value === v}
          className={value === v ? "is-active" : ""}
          onClick={() => onChange(v)}
        >
          {Icon && <Icon size={16} />} {label}
          {count !== undefined && <span className="sh-tabs__count">{count}</span>}
          {extra}
        </button>
      ))}
    </div>
  );
}
