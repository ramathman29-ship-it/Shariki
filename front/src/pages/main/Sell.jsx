import { useState } from "react";
import "../../style/Sell.css";
import { useNavigate } from "react-router-dom";
import Antigravity from "../../components/Antigravity";
import TextType from "../../components/TextType";

export default function Sell({ homes, setHomes }) {
  const [newHome, setNewHome] = useState({
    address: "",
    location: "",
    area: "",
    price: "",
    description: "",
    type: null,
    condition: "",
    type_request: "",
    available_percentage: 100,
    status: "pending",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "", // success | error
  });

  const navigate = useNavigate();

  // ===== INPUT HANDLER =====
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "type_request") {
      if (value === "fullSell") {
        setNewHome({
          ...newHome,
          type_request: value,
          available_percentage: 100,
        });
        return;
      }

      if (value === "rent") {
        setNewHome({
          ...newHome,
          type_request: value,
          available_percentage: 0,
        });
        return;
      }

      if (value === "partialSell") {
        setNewHome({
          ...newHome,
          type_request: value,
          available_percentage: "",
        });
        return;
      }
    }

    setNewHome({ ...newHome, [name]: value });
  };

  // ===== IMAGES =====
  const handleImagesChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  // ===== TOAST =====
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });

    setTimeout(() => {
      setToast({ show: false, message: "", type: "" });
    }, 4000);
  };

  // ===== SUBMIT =====
  const addHouse = async (e) => {
    e.preventDefault();

    // validation
    if (
      newHome.type_request === "partialSell" &&
      (!newHome.available_percentage ||
        newHome.available_percentage <= 0 ||
        newHome.available_percentage >= 100)
    ) {
      showToast("نسبة التوفر يجب أن تكون بين 1 و 99", "error");
      return;
    }

    const formData = new FormData();
    for (const key in newHome) {
      formData.append(key, newHome[key]);
    }

    images.forEach((img) => formData.append("images[]", img));

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/properties", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.message || "فشل إضافة العقار", "error");
        return;
      }

      setHomes([...homes, data.property]);
      showToast("تمت إضافة العقار ✅ بانتظار موافقة الإدارة", "success");

      setTimeout(() => {
        navigate(-1);
      }, 800);
    } catch (err) {
      console.error(err);
      showToast("فشل الاتصال بالسيرفر", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sell-page">
      <span className="back-arrow" onClick={() => navigate(-1)}>←</span>

      <div className="sell-card">
        {/* ===== RIGHT ===== */}
        <div className="sell-right-section">
          <TextType
            text={[
              "Enter your home info",
              "Where is your home?",
              "How much is your home?",
            ]}
            typingSpeed={75}
            pauseDuration={1500}
            showCursor
          />

          <form className="add-home-form" onSubmit={addHouse}>
            <div className="field">
              <label>Location</label>
              <input
                name="location"
                value={newHome.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="two-cols">
              <div className="field">
                <label>Area</label>
                <input
                  type="number"
                  name="area"
                  value={newHome.area}
                  onChange={handleInputChange}
                />
              </div>

              <div className="field">
                <label>Address</label>
                <input
                  name="address"
                  value={newHome.address}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={newHome.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="field">
              <label>Description</label>
              <input
                name="description"
                value={newHome.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="field">
              <label>Type</label>
              <input
                name="type"
                value={newHome.type || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="three-cols">
              <div className="field">
                <label>Condition</label>
                <select
                  name="condition"
                  value={newHome.condition}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" hidden></option>
                  <option value="green">Good</option>
                  <option value="yellow">Average</option>
                  <option value="red">Bad</option>
                </select>
              </div>

              <div className="field">
                <label>Request</label>
                <select
                  name="type_request"
                  value={newHome.type_request}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" hidden></option>
                  <option value="fullSell">Full Sell</option>
                  <option value="partialSell">Partial Sell</option>
                  <option value="rent">Rent</option>
                </select>
              </div>
            </div>

            {/* ===== AVAILABLE PERCENTAGE ===== */}
            {newHome.type_request === "partialSell" && (
              <div className="field">
                <label>Available Percentage (%)</label>
                <input
                  type="number"
                  name="available_percentage"
                  min="1"
                  max="99"
                  value={newHome.available_percentage}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <label className="upload-btn">
              Add Images
              <input
                type="file"
                multiple
                hidden
                accept="image/*"
                onChange={handleImagesChange}
              />
            </label>

            {images.length > 0 && (
              <p className="images-count">
                {images.length} image(s) selected
              </p>
            )}

            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Property"}
            </button>
          </form>
        </div>

        {/* ===== LEFT ===== */}
        <div className="antigravity-container">
          <Antigravity
            count={500}
            magnetRadius={6}
            ringRadius={7}
            waveSpeed={0.6}
            waveAmplitude={1}
            particleSize={2.5}
            lerpSpeed={0.05}
            color={"#5d5858"}
            autoAnimate
            particleVariance={1}
          />
        </div>
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
