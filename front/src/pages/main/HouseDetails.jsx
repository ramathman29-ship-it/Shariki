import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function HouseDetails() {
  const { id } = useParams();
  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    message: "",
    rate:""
  });


  // 🟢 جلب تفاصيل العقار من الـ API
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🟢 إرسال الطلب للباك (مع تعديل prp_id)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      prp_id: house.id,             // هاد هو اسم الحقل الصحيح
      description: formData.message,
      rate:formData.rate
    };

    try {
      const token = localStorage.getItem("token"); // لو الباك محتاج Authorization
      const response = await fetch("http://127.0.0.1:8000/api/user/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify(orderData),
      });
      console.log(token);

      if (!response.ok) throw new Error("Failed to send request");

      const result = await response.json();
      console.log("✅ Request response:", result);

      if (result.success) {
        alert(`✅ ${result.message}`);
        setShowModal(false);
        setFormData({ message: "" });
      } else {
        alert("⚠️ Something went wrong, please try again.");
      }
    } catch (error) {
      console.error("❌ Error submitting request:", error);
      alert("Failed to submit request. Please try again later.");
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
      <Link to="/houses">
        <img className="m" src="/images/rr.png" alt="Back" />
      </Link>

      <div className={`details-card ${showModal ? "blurred" : ""}`}>
        {house.images && house.images.length > 0 ? (
          <Swiper
            slidesPerView={1}
            pagination={{ clickable: true }}
            modules={[Pagination]}
          >
            {house.images.map((img, index) => (
              <SwiperSlide key={index}>
                <img src={img} alt={house.address} className="details-image" />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <img
            src="https://via.placeholder.com/600x400?text=No+Image"
            alt="No image"
            className="details-image"
          />
        )}

        <div className="details-info">
          <h1>{house.address}</h1>
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

      {/* مودال الطلب */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(6px)",
          }}
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
                  ></textarea>
                {house.type_request == 'partialSell' ?
                <>
                <label className="form-label mt-3">Percentage</label>
                <input
                  type="number" 
                  placeholder="33%"
                  required    
                  name="rate"
                  value={formData.rate}
                  onChange={handleChange}
                >
                </input>                
                </>
                :
                null
                }                  
                </div>

                <div className="d-flex justify-content-between">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>
        {`
          .blurred {
            filter: blur(6px);
            pointer-events: none;
            user-select: none;
          }
          .details-image {
            width: 100%;
            border-radius: 10px;
            margin-bottom: 15px;
          }
        `}
      </style>
    </div>
  );
}
