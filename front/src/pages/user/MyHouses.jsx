import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Modal,
} from "react-bootstrap";
import "../../style/MyHouses.css";

function MyHouses() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [activeTab, setActiveTab] = useState("properties");
  const [properties, setProperties] = useState([]);
  const [shares, setShares] = useState([]);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedShare, setSelectedShare] = useState(null);

  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);

  const fixImagePath = (path) => {
    if (!path) return null;
    if (path.startsWith("http")) return path;
    return `http://127.0.0.1:8000/${path}`;
  };

  /* ===================== FETCH DATA ===================== */

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/propertiesforuser", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setProperties(data.properties || []));
  }, []);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/user/myShares", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setShares(data.shares || []));
  }, []);

  /* ===================== DELETE PROPERTY ===================== */

  const handleDeleteProperty = async () => {
    if (!selectedProperty) return;

    const confirmDelete = window.confirm(
      "هل أنت متأكد من حذف هذا العقار؟ لا يمكن التراجع عن هذه العملية."
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/properties/${selectedProperty.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Delete failed");

      setProperties((prev) =>
        prev.filter((p) => p.id !== selectedProperty.id)
      );

      setShowPropertyModal(false);
      setSelectedProperty(null);
    } catch (err) {
      alert("فشل حذف العقار");
    }
  };

  /* ===================== UI ===================== */

  return (
    <Container className="myhouses-page">
      <span className="back-arrow" onClick={() => navigate(-1)}>←</span>
      <h2 className="page-title">عقاراتي</h2>

      {/* Tabs */}
      <div className="filter-tabs">
        <button
          className={activeTab === "properties" ? "filter-btn active" : "filter-btn"}
          onClick={() => setActiveTab("properties")}
        >
          عقاراتي
        </button>
        <button
          className={activeTab === "shares" ? "filter-btn active" : "filter-btn"}
          onClick={() => setActiveTab("shares")}
        >
          حصصي
        </button>
      </div>

      {/* ===================== PROPERTIES ===================== */}
      {activeTab === "properties" && (
        <Row className="mt-4">
          {properties.map((prop) => (
            <Col md={4} key={prop.id} className="mb-4">
              <Card className="property-card">
                <Card.Body>
                  <Card.Title>{prop.address}</Card.Title>
                  <Card.Text>{prop.location}</Card.Text>
                </Card.Body>
                <Button
                  className="card-btn"
                  onClick={() => {
                    setSelectedProperty(prop);
                    setShowPropertyModal(true);
                  }}
                >
                  عرض التفاصيل
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* ===================== SHARES ===================== */}
      {activeTab === "shares" && (
        <Row className="mt-4">
          {shares.map((share) => (
            <Col md={4} key={share.id} className="mb-4">
              <Card className="property-card">
                <Card.Body>
                  <Card.Title>نسبة الحصة: {share.share_amount}%</Card.Title>
                  <Card.Text>{share.property.address}</Card.Text>
                </Card.Body>
                <Button
                  className="card-btn"
                  onClick={() => {
                    setSelectedShare(share);
                    setShowShareModal(true);
                  }}
                >
                  عرض التفاصيل
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* ===================== PROPERTY MODAL ===================== */}
      <Modal
        show={showPropertyModal}
        onHide={() => setShowPropertyModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>تفاصيل العقار</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-content-custom">
          {selectedProperty && (
            <>
              <p><strong>العنوان:</strong> {selectedProperty.address}</p>
              <p><strong>الموقع:</strong> {selectedProperty.location}</p>
              <p><strong>السعر:</strong> {selectedProperty.price}</p>
              <p><strong>الحالة:</strong> {selectedProperty.status}</p>
              <p>
                <strong>النسبة المتاحة:</strong>{" "}
                {selectedProperty.available_percentage}%
              </p>

              {selectedProperty.status === "view" && (
                <Button
                  variant="danger"
                  className="w-100 mt-3"
                  onClick={handleDeleteProperty}
                >
                  حذف العقار
                </Button>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* ===================== SHARE MODAL ===================== */}
      <Modal
        show={showShareModal}
        onHide={() => setShowShareModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>تفاصيل الحصة</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-content-custom">
          {selectedShare && (
            <>
              <p><strong>نسبة الحصة:</strong> {selectedShare.share_amount}%</p>
              <p><strong>تاريخ التقديم:</strong> {selectedShare["submission date"]}</p>
              <hr />
              <p><strong>العقار:</strong> {selectedShare.property.address}</p>
              <p><strong>الموقع:</strong> {selectedShare.property.location}</p>

              {selectedShare.contract && (
                <Button
                  className="card-btn mt-3"
                  onClick={() => setShowContractModal(true)}
                >
                  عرض العقد
                </Button>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* ===================== CONTRACT MODAL ===================== */}
      <Modal
        show={showContractModal}
        onHide={() => setShowContractModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>صورة العقد</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={fixImagePath(selectedShare?.contract)}
            alt="contract"
            className="contract-image"
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default MyHouses;
