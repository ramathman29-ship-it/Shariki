import { useEffect, useState } from "react";

export default function SellRequest() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

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
        const pendingProps = allProperties.filter((p) => p.status === "building");
        setPending(pendingProps);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, [token]);

  const approveProperty = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/admin/properties/${id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        alert("تمت الموافقة!");
        setPending(pending.filter((p) => p.id !== id));
      } else {
        alert(data.message || "خطأ في الموافقة");
      }
    } catch (error) {
      console.error("Approve Error:", error);
    }
  };

  const rejectProperty = async (id) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/user/requests/${id}/cancel`, {
        method: "DELETE", 
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        alert("تم رفض الطلب!");
        setPending(pending.filter((p) => p.id !== id));
      } else {
        alert(data.message || "خطأ في الرفض");
      }
    } catch (error) {
      console.error("Reject Error:", error);
    }
  };

  if (loading) return <h3 className="text-center mt-4">Loading...</h3>;

  
  return (
    <div className="container mt-4">
<h2 className="text-center mt-5 mb-4">🏡 Property Publishing Requests</h2>

      {pending.length === 0 && <p>لا يوجد طلبات حالياً</p>}

      <div className="row">
        {pending.map((p) => (
          <div className="col-md-4 mb-3" key={p.id}>
            <div className="card p-3 shadow">
              <h5>عقار رقم: {p.id}</h5>
              <p>العنوان: {p.address}</p>
              <p>المكان: {p.location}</p>
              <p>السعر: {p.price}</p>
              <p>الحالة: {p.status}</p>

              <button className="btn btn-success mt-2 me-2" onClick={() => approveProperty(p.id)}>
                موافقة
              </button>
              <button className="btn btn-danger mt-2" onClick={() => rejectProperty(p.id)}>
                رفض
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
