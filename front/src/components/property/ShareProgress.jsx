/** Thin progress bar with a label on each side. */
export default function ShareProgress({ percent, start, end, style }) {
  return (
    <div style={style}>
      <div className="sh-progress-label">
        <span>{start}</span>
        <span>{end}</span>
      </div>
      <div
        className="sh-progress"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
