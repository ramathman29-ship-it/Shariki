import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../../style/Sell.css"
import "swiper/css/effect-fade";

export default function HouseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ message: "", rate: "" });

  // ===== Toast =====
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  // ===== Fetch house details =====
  useEffect(() => {
    const fetchHouseDetails = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/propertiesall/${id}`);
        if (!res.ok) throw new Error("Failed to fetch house details");

        const data = await res.json();
        setHouse(data.property || data);
      } catch (err) {
        console.error("❌ Error fetching house details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHouseDetails();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ===== Submit request =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = { prp_id: house.id, description: formData.message, rate: formData.rate };

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:8000/api/user/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Failed to send request");

      const result = await response.json();
      if (result.success) {
        showToast(result.message, "success");
        setShowModal(false);
        setFormData({ message: "", rate: "" });
      } else {
        showToast("⚠️ Something went wrong, please try again.", "error");
      }
    } catch (error) {
      console.error("❌ Error submitting request:", error);
      showToast("Failed to submit request. Please try again later.", "error");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!house) {
    return <h2 className="text-center mt-5">House not found 😢</h2>;
  }

  return (
    <div className="container">
      {/* Back button */}
      <span className="back-arrow" onClick={() => navigate("/houses")}>←</span>

      {/* ===== House Details ===== */}
      <div className={`details-card ${showModal ? "blurred" : ""}`} style={{ display: "flex", gap: "30px", marginTop: "20px" }}>
        
        {/* LEFT: Swiper */}
        <div className="details-left" style={{ flex: 1 }}>
          {house.photos && house.photos.length > 0 ? (
            <Swiper
              slidesPerView={1}
              pagination={{ clickable: true }}
              modules={[Pagination]}
              className="swiper-container"
              style={{ width: "100%", height: "400px", borderRadius: "10px" }}
            >
              {house.photos.map((img, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={img.replace(/\\/g, "")}
                    alt={`${house.address} - ${index + 1}`}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <img
              src="https://via.placeholder.com/600x400?text=No+Image"
              alt="No image"
              style={{ width: "100%", height: "400px", objectFit: "cover", borderRadius: "10px" }}
            />
          )}
        </div>

        {/* RIGHT: المعلومات */}
        <div className="details-right" style={{ flex: 1 }}>
          <h2>{house.address}</h2>
          <p><strong>Location:</strong> {house.location}</p>
          <p><strong>Price:</strong> {house.price} $</p>
          <p><strong>Status:</strong> {house.status}</p>
          <p><strong>Condition:</strong> {house.condition}</p>
          <p><strong>Available %:</strong> {house.available_percentage}%</p>
          <p><strong>Request Type:</strong> {house.type_request}</p>

          <button className="btn btn-success mt-3" onClick={() => setShowModal(true)}>
            🏠 Send Request
          </button>
        </div>
      </div>

      {/* ===== Modal ===== */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content p-4 rounded-4 shadow-lg">
              <h5 className="mb-3 text-center">📝 Request Form</h5>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    name="message"
                    className="form-control"
                    rows="3"
                    placeholder="اكتب وصف الطلب، مثل رغبتك بشراء العقار أو معاينته..."
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                  {house.type_request === 'partialSell' && (
                    <>
                      <label className="form-label mt-3">Percentage</label>
                      <input
                        type="number"
                        placeholder="33%"
                        required
                        name="rate"
                        value={formData.rate}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </>
                  )}
                </div>

                <div className="d-flex justify-content-between">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ===== Toast Box ===== */}
      <div
        className={`toast-box position-fixed top-0 end-0 m-3 p-3 rounded shadow ${
          toast.show ? "show" : "hide"
        } ${toast.type === "success" ? "bg-success" : "bg-danger"}`}
        style={{ minWidth: "250px", color: "#fff", zIndex: 1050 }}
      >
        {toast.message}
      </div>
    </div>
  );
}
 