import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown, Image, Button } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const activeStyles = {
    fontWeight: "bold",
    color: "#161616",
    borderRadius: "50px",
    padding: "7px 7px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  };

  // 🔹 Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserData(null);
        return;
      }
      try {
        const response = await fetch("http://localhost:8000/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserData(null);
      }
    };
    fetchUserData();
  }, []);

  // 🔹 Logout
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in");
      navigate("/login");
      return;
    }
    try {
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "GET", // أو POST حسب الباك
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });
      const data = await response.json();
      if (response.ok && data.message === "logout") {
        localStorage.removeItem("token");
        alert("تم تسجيل الخروج");
        navigate("/login");
      } else {
        alert("فشل تسجيل الخروج");
      }
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#87734aff" }} className="py-2">
      <Container>
        <Navbar.Brand href="/" className="brand-logo">
          <img src="/public/images/download.png" alt="Logo" />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar" onClick={() => setMenuOpen(!menuOpen)} />
        <Navbar.Collapse id="main-navbar" className={menuOpen ? "show" : ""}>
          <Nav className="mx-auto gap-3 nav-links-center">
            <NavLink to="/" style={({ isActive }) => (isActive ? activeStyles : null)}>Home</NavLink>
            <NavLink to="/host" style={({ isActive }) => (isActive ? activeStyles : null)}>My houses</NavLink>
            <NavLink to="/houses" style={({ isActive }) => (isActive ? activeStyles : null)}>Houses</NavLink>
            <NavLink to="/aboutus" style={({ isActive }) => (isActive ? activeStyles : null)}>AboutUS</NavLink>
            <NavLink to="/sellyourHouse" style={({ isActive }) => (isActive ? activeStyles : null)}>sell your house</NavLink>
            <NavLink to="/myRequests" style={({ isActive }) => (isActive ? activeStyles : null)}>My request</NavLink>
          </Nav>

          <div className="d-flex align-items-center gap-3">
            {/* 🔹 User Dropdown */}
            <Dropdown show={dropdownOpen} onToggle={() => setDropdownOpen(!dropdownOpen)} align="end">
              <Dropdown.Toggle
                variant="transparent"
                className="d-flex align-items-center text-white border-0"
                style={{ boxShadow: "none", cursor: "pointer" }}
              >
                <i className="bi bi-person-circle fs-4 me-2"></i>
                <span>{userData ? userData.name : "Guest"}</span>
                <Image
                  src="/public/images/28.png"
                  roundedCircle
                  style={{ width: "36px", height: "36px", objectFit: "cover", marginLeft: "5px" }}
                />
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm mt-2 p-2" style={{ minWidth: "220px" }}>
                {userData ? (
                  <>
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Mobile:</strong> {userData.mobile}</p>
                    <p><strong>Gender:</strong> {userData.gender}</p>
                    <p><strong>Birthday:</strong> {userData.birthday}</p>
                    <p><strong>Nationality:</strong> {userData.nationality}</p>
                    <p><strong>Job:</strong> {userData.job}</p>
                    <p><strong>Residency:</strong> {userData.residency}</p>
                    <p><strong>Budget:</strong> {userData.budget}</p>

                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="text-danger">
                      Logout
                    </Dropdown.Item>
                  </>
                ) : (
                  <p>Loading...</p>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
