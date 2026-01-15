import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Reports() {
  const [reportType, setReportType] = useState("");
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const isMonthly = reportType === "monthly";

  const fetchReport = async (type) => {
    try {
      setLoading(true);
      setError(null);
      setReport(null);

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/reports/${type}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch report");

      const data = await response.json();
      setReport(data.report);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const type = e.target.value;
    setReportType(type);
    if (type) fetchReport(type);
  };

  return (
    <div style={styles.page}>
      <span className="back-arrow" onClick={() => navigate(-1)}>←</span>

      <div style={styles.container}>
        <h2 style={styles.pageTitle}>Admin Reports</h2>

        <select style={styles.select} value={reportType} onChange={handleChange}>
          <option value="">Select report type</option>
          <option value="daily">Daily Report</option>
          <option value="monthly">Monthly Report</option>
        </select>

        {loading && <p>Loading report...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {report && (
          <>
            {/* USERS */}
            <ReportTable
              title="Users"
              rows={[
                [
                  isMonthly ? "This Month" : "Today",
                  report.users.new_today,
                ],
                [
                  isMonthly ? "Last Month" : "Yesterday",
                  report.users.new_yesterday,
                ],
                ["Total Users", report.users.total],
                ["Growth Rate", report.users.growth_rate],
              ]}
            />

            {/* PROPERTIES */}
            <ReportTable
              title="Properties"
              rows={[
                ["Not Approved", report.properties.not_approved],
                ["Partially Sold", report.properties.partial_sold],
                ["Fully Sold", report.properties.fully_sold],
                ["Rent", report.properties.rent],
              ]}
            />

            {/* REQUESTS */}
            <ReportTable
              title="Requests"
              rows={[
                [
                  isMonthly ? "This Month" : "Today",
                  report.requests.today,
                ],
                ["Pending", report.requests.pending],
                ["Accepted", report.requests.accepted],
                ["Rejected", report.requests.rejected],
              ]}
            />

            {/* SALES */}
            <ReportTable
              title="Sales"
              rows={[
                [
                  isMonthly ? "Partial Sales (This Month)" : "Partial Sales Today",
                  report.sales.partial_sales_today,
                ],
                [
                  isMonthly ? "Full Sales (This Month)" : "Full Sales Today",
                  report.sales.full_sales_today,
                ],
                [
                  isMonthly
                    ? "Partial Sales (Last Month)"
                    : "Partial Sales Yesterday",
                  report.sales.partial_sales_yesterday,
                ],
                [
                  isMonthly
                    ? "Full Sales (Last Month)"
                    : "Full Sales Yesterday",
                  report.sales.full_sales_yesterday,
                ],
                [
                  "Partial Sales Improvement",
                  report.sales.partial_sales_improvement,
                ],
                [
                  "Full Sales Improvement",
                  report.sales.full_sales_improvement,
                ],
              ]}
            />
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Table Component ---------- */

function ReportTable({ title, rows }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={styles.tableWrapper}>
      <h3 style={styles.tableTitle}>{title}</h3>

      <table style={styles.table}>
        <tbody>
          {rows.map(([label, value], index) => (
            <React.Fragment key={index}>
              <tr
                style={{
                  ...styles.row,
                  ...(hovered === index ? styles.rowHover : {}),
                }}
                onMouseEnter={() => setHovered(index)}
                onMouseLeave={() => setHovered(null)}
              >
                <td style={styles.cellLabel}>{label}</td>
                <td style={styles.cellValue}>{value}</td>
              </tr>

              {index !== rows.length - 1 && (
                <tr>
                  <td colSpan="2">
                    <div style={styles.rowDivider} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- Styles ---------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f2ece6",
    paddingTop: "40px",
  },

  container: {
    maxWidth: "950px",
    margin: "0 auto",
    padding: "30px",
  },

  pageTitle: {
    fontSize: "30px",
    marginBottom: "25px",
  },

  select: {
    padding: "8px 14px",
    fontSize: "15px",
    borderRadius: "6px",
    border: "none",
    background: "#e6ddd5",
    cursor: "pointer",
    outline: "none",
    width: "220px",
    marginBottom: "40px",
  },

  tableWrapper: {
    marginBottom: "50px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  tableTitle: {
    fontSize: "26px",
    fontWeight: "800",
    marginBottom: "14px",
    textAlign: "center",
    color: "#4a2f1c",
    letterSpacing: "0.5px",
  },

  table: {
    width: "100%",
    maxWidth: "720px",
    background: "#ffffff",
    borderRadius: "12px",
    borderCollapse: "separate",
    borderSpacing: 0,
    overflow: "hidden",
  },

  row: {
    transition: "transform 0.2s ease",
  },

  rowHover: {
    transform: "translateY(-4px)",
  },

  cellLabel: {
    padding: "16px 18px",
    fontSize: "16px",
    fontWeight: "500",
    color: "#4a3322",
  },

  cellValue: {
    padding: "16px 18px",
    fontSize: "16px",
    textAlign: "right",
    color: "#4a3322",
  },

  rowDivider: {
    height: "1px",
    background: "#f2ece6",
    width: "90%",
    margin: "0 auto",
  },
};

export default Reports;
