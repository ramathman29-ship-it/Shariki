export function SkeletonGrid({ count = 6, height = 380 }) {
  return (
    <div className="sh-grid" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="sh-skeleton" style={{ height }} />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 3, height = 150 }) {
  return (
    <div className="sh-list" aria-busy="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="sh-skeleton" style={{ height }} />
      ))}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="sh-container" style={{ padding: "64px 20px" }}>
      <div className="sh-skeleton" style={{ height: 44, width: 320, marginBottom: 24 }} />
      <SkeletonGrid count={3} />
    </div>
  );
}
