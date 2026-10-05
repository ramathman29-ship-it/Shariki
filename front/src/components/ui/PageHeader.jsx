import { Fragment } from "react";
import { Link } from "react-router-dom";

/**
 * Inner-page header with breadcrumbs.
 * @param {{ crumbs?: { label: string, to?: string }[], title: string, lead?: string, actions?: React.ReactNode }} props
 */
export default function PageHeader({ crumbs = [], title, lead, actions }) {
  return (
    <section className="sh-page-head">
      <div className="sh-container">
        {crumbs.length > 0 && (
          <nav className="sh-crumbs" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <Fragment key={i}>
                {i > 0 && <span aria-hidden="true">/</span>}
                {c.to ? <Link to={c.to}>{c.label}</Link> : <span>{c.label}</span>}
              </Fragment>
            ))}
          </nav>
        )}
        <div className="sh-section-head" style={{ marginBottom: 0 }}>
          <div>
            <h1 className="sh-h2">{title}</h1>
            {lead && <p className="sh-lead">{lead}</p>}
          </div>
          {actions}
        </div>
      </div>
    </section>
  );
}
