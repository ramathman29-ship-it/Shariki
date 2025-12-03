import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";

function MyHouses() {

  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shares, setShares] = useState([]);
  const [selectedShare, setSelectedShare] = useState(null);

  const token = localStorage.getItem("token");
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/propertiesforuser", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
     })
      .then(res => res.json())
      .then(data => {
        setProperties(data.properties ||[]);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  const fetchPropertyDetails = (propertyId) => {
    fetch(`http://127.0.0.1:8000/api/propertyforuser/${propertyId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log("تفاصيل العقار:", data);
        setSelectedProperty(data.property);
      })
      .catch(err => console.error("Error:", err));

  };

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/user/myShares`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        setShares(data.shares || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);


  const fetchShareDetails = (shareId) => {
    fetch(`http://127.0.0.1:8000/api/user/myShares/${shareId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log("تفاصيل الحصص:", data);
        setSelectedShare(data.share);
      })
      .catch(err => console.error("Error:", err));
  };


  if (loading) return <p>جاري التحميل...</p>;

  return (
    <Container className="mt-4">

      <h3 className="mb-3 text-center">My real Estate | عقاراتي</h3>

      <Row>
        {properties.map((prop) => (
          <Col md={4} key={prop.id} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{prop.address}</Card.Title>
                <Card.Text>الموقع {prop.location}</Card.Text>

                <Button
                  variant="primary"
                  onClick={() => fetchPropertyDetails(prop.id)}
                >
                  عرض التفاصيل
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* PROPERTY DETAILS + SHARES */}
      {selectedProperty && (
        <Card className="p-3 mt-4 shadow">
          <h4>تفاصيل العقار</h4>

          <p><strong>العنوان</strong> {selectedProperty.address}</p>
          <p><strong>الموقع</strong> {selectedProperty.location}</p>
          <p><strong>السعر</strong> {selectedProperty.price}</p>
          <p><strong>الحالة</strong> {selectedProperty.status}</p>
          <p><strong>النسبة المتاحة</strong> {selectedProperty.available_percentage}%</p>

          <h5 className="mt-4">الحصص </h5>
          {shares.length === 0 ? (
            <p className="text-muted">لا يوجد حصص لهذا العقار.</p>
          ) : (
            <ListGroup>
              {shares.map((share) => (
                <ListGroup.Item key={share.id} className="d-flex justify-content-between align-items-center">
                  <span>
                    عدد الأسهم: {share.share_amount} — رقم العقار: {share.property}
                  </span>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => fetchShareDetails(share.id)}
                  >
                    عرض تفاصيل الحصة
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>

          )}
          {/* SHARE DETAILS */}
          {selectedShare && (
            <Card className="p-3 mt-3">
              <h5>تفاصيل الحصة</h5>

              <p><strong>عدد الأسهم:</strong> {selectedShare.share_amount}</p>
              <p><strong>العقد:</strong> {selectedShare.contract}</p>
              <p><strong>العقار:</strong> {selectedShare.property}</p>
              <p><strong>تاريخ التقديم:</strong> {selectedShare["submission date"]}</p>
            </Card>

          )}
        </Card>
      )}

    </Container>
  );
}

export default MyHouses;