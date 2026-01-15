import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function PublishRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // ===== TOAST =====
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  // Fetch user buy requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          showToast("⚠️ Admin token not found. Please login first.", "error");
          setLoading(false);
          return;
        }

        const reqRes = await fetch("http://127.0.0.1:8000/api/admin/requests", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const reqData = await reqRes.json();
        setRequests(reqData.data || []);
      } catch (err) {
        console.error(err);
        showToast("❌ Failed to load data.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Upload contract image after request is accepted
  const uploadContract = async (id, file) => {
    try {
      const formData = new FormData();
      formData.append("contract", file);

      const response = await fetch(
        `http://127.0.0.1:8000/api/admin/requests/${id}/contract`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Upload failed");

      showToast("📄 Contract uploaded successfully!", "success");

      // Update the UI with the returned contract URL
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, contract_image: data.contract_url } : r
        )
      );
    } catch (err) {
      console.error(err);
      showToast("❌ Failed to upload contract.", "error");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <span className="back-arrow" onClick={() => navigate(-1)}>←</span>
      <h2 className="text-center mb-4">📬 Pending User Requests</h2>

      <div className="row">
        {requests.length === 0 ? (
          <p className="text-center text-muted">No buy requests found.</p>
        ) : (
          requests.map((req) => (
            <div className="col-md-4 mb-4" key={req.id}>
              <div className="card shadow-sm border-0">
                <div
                  className="d-flex align-items-center justify-content-center bg-light"
                  style={{ height: "180px" }}
                >
                  <h6 className="text-muted">Property ID: {req.property}</h6>
                </div>
                <div className="card-body">
                  <h5 className="card-title">Requester: {req.user?.name}</h5>
                  <p><strong>Description:</strong> {req.description}</p>
                  <p><strong>Rate:</strong> {req.rate}%</p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        req.status === "pending"
                          ? "text-warning"
                          : req.status === "accepted"
                          ? "text-success"
                          : "text-danger"
                      }
                    >
                      {req.status}
                    </span>
                  </p>

                  {req.contract_image && (
                    <a
                      href={req.contract_image}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-primary btn-sm mt-2"
                    >
                      View Contract
                    </a>
                  )}

                  {req.status === "accepted" && (
                    <div className="mt-3">
                      <label className="form-label">Upload Contract:</label>
                      <input
                        type="file"
                        className="form-control form-control-sm"
                        accept="image/*"
                        onChange={(e) =>
                          uploadContract(req.id, e.target.files[0])
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ===== TOAST ===== */}
      {toast.show && (
        <div className={`toast-box ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
