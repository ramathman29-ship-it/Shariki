import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function UserRequests() {
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserRequests = async () => {
      try {
        if (!token) {
          setMessage("⚠️ User token not found. Please login first.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/user/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch user requests");

        const data = await response.json();
        console.log("User requests:", data);

        // Add paymentHeld field to sent requests
        const sentWithPayment = (data.sent_requests || []).map(req => ({
          ...req,
          paymentHeld: false,
        }));

        setSent(sentWithPayment);
        setReceived(data.received_requests || []);
      } catch (error) {
        console.error(error);
        setMessage("❌ Failed to load your requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRequests();
  }, []);

  // Cancel Sent Request
  const handleCancel = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/requests/${id}/cancel`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Cancel failed");

      setSent((prev) => prev.filter((r) => r.id !== id));
      setMessage("🗑️ Request canceled successfully.");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to cancel request.");
    }
  };

  // Accept or Reject Received Request (PUT)
  const handleDecision = async (id, decision) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/user/requests/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: decision }), // accepted / rejected
        }
      );

      if (!response.ok) throw new Error("Action failed");

      // Update UI
      setReceived((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: decision } : r
        )
      );

      setMessage(
        decision === "accepted"
          ? "✔️ Request accepted."
          : "❌ Request rejected."
      );
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to process request.");
    }
  };

  // Hold payment
  const handleHoldPayment = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user/requests/${id}/payment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to hold payment");

      setSent((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, paymentHeld: true } : r
        )
      );

      setMessage("💰 Payment held successfully.");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to hold payment.");
    }
  };

  // Reject held payment / didn't like
  const handleRejectPayment = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/user/requests/${id}/rejected`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to reject payment");

      setSent((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, paymentHeld: false, status: "rejected" } : r
        )
      );

      setMessage("❌ Payment rejected successfully.");
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to reject payment.");
    }
  };

  const RequestCard = ({ req, actions }) => (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="card-title mb-0">Property ID: {req.property_id}</h5>

          <span
            className={
              req.status === "pending"
                ? "badge bg-warning text-dark"
                : req.status === "accepted"
                  ? "badge bg-success"
                  : "badge bg-danger"
            }
          >
            {req.status}
          </span>
        </div>

        <p className="mb-1"><strong>Description:</strong> {req.description}</p>
        <p className="mb-1"><strong>Rate:</strong> {req.rate}%</p>
        <p className="mb-1">
          <strong>Submitted:</strong> {req.submitted_at || "N/A"}
        </p>

        {actions}
      </div>
    </div>
  );

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <span className="back-arrow" onClick={() => navigate(-1)}>←</span>
      <h2 className="text-center mb-4">📬 My Requests</h2>

      {message && <div className="alert alert-info text-center">{message}</div>}

      {/* SENT REQUESTS */}
      <h4 className="mt-4 mb-3">📤 Requests I Sent</h4>

      {sent.length === 0 ? (
        <p className="text-muted text-center">You haven't sent any requests.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {sent.map((req) => (
            <RequestCard
              key={req.id}
              req={req}
              actions={
                <div className="d-flex flex-column gap-2 mt-2">
                  {/* Cancel pending requests */}
                  {req.status === "pending" && (
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ width: "300px" }}

                      onClick={() => handleCancel(req.id)}
                    >
                      ❌ Cancel Request
                    </button>
                  )}
                  {req.status === "accepted" &&
                    req.payment_status === "pending" && (
                      <button
                        className="btn btn-warning btn-sm"
                        style={{ width: "300px" }}
                        onClick={() => handleHoldPayment(req.id)}
                      >
                        💰 Hold Payment
                      </button>
                    )}

                  {req.payment_status === "held" && (
                    <button
                      className="btn btn-secondary btn-sm"
                      style={{ width: "300px" }}
                      onClick={() => handleRejectPayment(req.id)}
                    >
                      ❌ Didn't like
                    </button>
                  )}
                </div>
              }
            />
          ))}
        </div>
      )}

      {/* RECEIVED REQUESTS */}
      <h4 className="mt-5 mb-3">📥 Requests I Received</h4>

      {received.length === 0 ? (
        <p className="text-muted text-center">
          No one requested your properties.
        </p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {received.map((req) => (
            <RequestCard
              key={req.id}
              req={req}
              actions={
                req.status === "pending" && (
                  <div className="mt-3 d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      style={{ width: "300px" }}

                      onClick={() => handleDecision(req.id, "accepted")}
                    >
                      ✔ Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      style={{ width: "300px" }}

                      onClick={() => handleDecision(req.id, "rejected")}
                    >
                      ✖ Reject
                    </button>
                  </div>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
