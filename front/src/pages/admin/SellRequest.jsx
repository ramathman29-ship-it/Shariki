import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SellRequest() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ===== TOAST =====
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  /* ================= FETCH PENDING PROPERTIES ================= */
  useEffect(() => {
    const fetchPending = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://127.0.0.1:8000/api/properties", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        const allProperties = data.properties || [];
        const pendingProps = allProperties.filter((p) => p.status === "pending");

        setPending(pendingProps);
      } catch (error) {
        console.error("Fetch Error:", error);
        showToast("❌ Failed to load properties.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [token]);

  /* ================= APPROVE PROPERTY ================= */
  const approveProperty = async (id) => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/properties/${id}/approve`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        showToast("✅ Property approved successfully!");
        setPending((prev) => prev.filter((p) => p.id !== id));
      } else {
        showToast(data.message || "❌ Error approving property", "error");
      }
    } catch (error) {
      console.error("Approve Error:", error);
      showToast("❌ Failed to approve property.", "error");
    }
  };

  /* ================= REJECT PROPERTY ================= */
  const rejectProperty = async (id) => {
    const confirmReject = window.confirm("هل أنت متأكد من رفض نشر هذا العقار؟");
    if (!confirmReject) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/admin/properties/${id}/notapprove`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await res.json();

      if (data.success) {
        showToast("❌ Property rejected.");
        setPending((prev) => prev.filter((p) => p.id !== id));
      } else {
        showToast(data.message || "❌ Error rejecting property", "error");
      }
    } catch (error) {
      console.error("Reject Error:", error);
      showToast("❌ Failed to reject property.", "error");
    }
  };

  /* ================= LOADING ================= */
  if (loading) return <h3 className="text-center mt-4">Loading...</h3>;

  /* ================= UI ================= */
  return (
    <div className="container mt-4">
      <span className="back-arrow" onClick={() => navigate(-1)}>←</span>

      <h2 className="text-center mt-5 mb-4">🏡 Property Publishing Requests</h2>

      {pending.length === 0 && <p className="text-center">لا يوجد طلبات حالياً</p>}

      <div className="row">
        {pending.map((p) => (
          <div className="col-md-4 mb-3" key={p.id}>
            <div className="card p-3 shadow">
              <h5>عقار رقم: {p.id}</h5>
              <p>العنوان: {p.address}</p>
              <p>المكان: {p.location}</p>
              <p>السعر: {p.price}</p>
              <p>الحالة: {p.status}</p>

              <button
                className="btn btn-success mt-2 me-2"
                onClick={() => approveProperty(p.id)}
              >
                موافقة
              </button>

              <button
                className="btn btn-danger mt-2"
                onClick={() => rejectProperty(p.id)}
              >
                رفض
              </button>
            </div>
          </div>
        ))}
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
