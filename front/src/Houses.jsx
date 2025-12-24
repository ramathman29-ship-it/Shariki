import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Houses() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/propertiesall") 
      .then((res) => res.json())
      .then((data) => {
        setProperties(data.properties || []); 
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching properties:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p className="text-center mt-5">Loading properties...</p>;
  }

  if (properties.length === 0) {
    return <p className="text-center mt-5">No properties found.</p>;
  }

  return (
    <div className="properties container mt-4">
      {properties.map((item) => (
        <Link
          key={item.id}
          to={`/house/${item.id}`}
          className="property-card d-block mb-4 text-decoration-none text-dark"
        >
          <div className="image-wrapper">
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[0]}
                alt={item.address}
                className="property-image img-fluid rounded"
              />
            ) : (
              <img
                src="https://via.placeholder.com/300x200?text=No+Image"
                alt="No image"
                className="property-image img-fluid rounded"
              />
            )}
          </div>

          <div className="property-info mt-2">
            <h5>{item.address}</h5>
            <p>Location: {item.location}</p>
            <p>Price: {item.price} $</p>
            <p>Status: {item.status}</p>
            <p>Condition: {item.condition}</p>
            <p>Available: {item.available_percentage}%</p>
            <p>Request type: {item.type_request}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
