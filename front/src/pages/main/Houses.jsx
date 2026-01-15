import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Houses() {
  const [properties, setProperties] = useState([]);
  const [filterType, setFilterType] = useState("sell"); // sell | rent
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/propertiesall")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch properties");
        return res.json();
      })
      .then((data) => {
        setProperties(data.properties);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // ===== FILTER ONLY =====
  const filteredProperties = properties.filter((property) => {
    if (filterType === "sell") {
      return (
        property.type_request === "fullSell" ||
        property.type_request === "partialSell"
      );
    }

    if (filterType === "rent") {
      return property.type_request === "rent";
    }

    return true;
  });

  if (loading) return <p className="text-center mt-5">Loading...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;

  return (
    <>
      <span className="back-arrow" onClick={() => navigate("/")}>←</span>

      <div className="container mt-4">

        {/* ===== FILTER BUTTONS (Bootstrap only) ===== */}
        <div className="d-flex justify-content-end mb-3">
          <div className="btn-group">
            <button
              className={`btn btn-outline-dark ${
                filterType === "sell" ? "active" : ""
              }`}
              onClick={() => setFilterType("sell")}
            >
              بيع
            </button>

            <button
              className={`btn btn-outline-dark ${
                filterType === "rent" ? "active" : ""
              }`}
              onClick={() => setFilterType("rent")}
            >
              إيجار
            </button>
          </div>
        </div>

        {/* ===== CARDS ===== */}
        <div className="row">
          {filteredProperties.map((property) => (
            <div className="col-md-4 mb-4" key={property.id}>
              <Link
                to={`/houses/${property.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="card h-100 shadow-sm">
                  <img
                    src={property.photos?.[0] || "/images/no-image.png"}
                    alt={property.address}
                    className="card-img-top"
                    style={{ height: "200px", objectFit: "cover" }}
                  />

                  <div className="card-body">
                    <h5 className="card-title">{property.address}</h5>
                    <p className="card-text text-muted">{property.location}</p>

                    <p className="mb-1">
                      <strong>النوع:</strong>{" "}
                      {property.type_request === "rent" ? "إيجار" : "بيع"}
                    </p>

                    <p className="mb-0">
                      <strong>السعر:</strong> ${property.price}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
