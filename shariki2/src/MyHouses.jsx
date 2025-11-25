import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

function MyHouses({ userId }) {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [propertyDetails, setPropertyDetails] = useState(null);
  const [sessions, setSessions] = useState([]);

  // -----------------------------
  // 1) API: عقارات المستخدم
  // -----------------------------
  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/propertiesforuser?userId=${userId}`)
      .then(res => res.json())
      .then(data => setProperties(data))
      .catch(err => console.log("Error loading properties:", err));
  }, [userId]);


  // -----------------------------
  // 2) API: تفاصيل العقار + 3) API الحصص
  // -----------------------------
  const handleSelectProperty = (propertyId) => {

    setSelectedProperty(propertyId);

    // تفاصيل العقار
    fetch(`http://127.0.0.1:8000/api/propertyforuser/${propertyId}`)
      .then(res => res.json())
      .then(data => setPropertyDetails(data))
      .catch(err => console.log("Error loading property details:", err));

    // الحصص الخاصة بالمستخدم لهذا العقار
    fetch(`http://127.0.0.1:8000/api/myShares?userId=${userId}&propertyId=${propertyId}`)
      .then(res => res.json())
      .then(data => setSessions(data))
      .catch(err => console.log("Error loading sessions:", err));
  };


  return (
    <Container className="mt-4">

      
      <h3 className="mb-3">عقاراتك</h3>
      <Row>
        {properties.map((prop) => (
          <Col md={4} key={prop.id} className="mb-3">
            <Card className="shadow-sm">
              <Card.Body>
                <Card.Title>{prop.name}</Card.Title>
                <Card.Text>الموقع: {prop.location}</Card.Text>

                <Button variant="primary"
                  onClick={() => handleSelectProperty(prop.id)}>
                  عرض التفاصيل
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>


      
      {propertyDetails && (
        <>
          <h3 className="mt-5">تفاصيل العقار</h3>

          <Card className="p-3 shadow-sm mb-3">
            <h5>الاسم: {propertyDetails.name}</h5>
            <p>السعر: {propertyDetails.price}</p>
            <p>الوصف: {propertyDetails.description}</p>
          </Card>
        </>
      )}


     
      {sessions.length > 0 && (
        <>
          <h3 className="mt-4">الحصص الخاصة بهذا العقار</h3>
          <Row>
            {sessions.map((session) => (
              <Col md={4} key={session.id}>
                <Card className="shadow-sm p-3 mb-3">
                  <h6>النوع: {session.type}</h6>
                  <p>التاريخ: {session.date}</p>
                  <p>المدة: {session.duration} ساعة</p>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}

    </Container>
  );
}

export default MyHouses;