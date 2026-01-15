import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import BlurText from "../components/BlurText";
import echo from "../echo";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  /* ======== Notifications States ======== */
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  /* ===================================== */

  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 4000);
  };

  const activeStyles = {
    fontWeight: "bold",
    color: "#161616",
    borderRadius: "50px",
    padding: "7px 7px",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  };

  const navigate = useNavigate();

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    const fetchUserData = async () => {
      if (!token) return;

      try {
        const res = await fetch("http://localhost:8000/api/user/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setUserData(data);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };

    fetchUserData();
  }, []);

  /* ======== Fetch Notifications ======== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/notifications", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setNotifications(data.data);
          setUnreadCount(data.unread_count);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !userData?.id) return;

    const channelName = `App.Models.User.${userData.id}`;

    echo.private(channelName).notification((notification) => {
      console.log("NEW NOTIFICATION:", notification);

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      showToast(notification.message, "success"); // عرض التوست عند وصول إشعار جديد
    });

    return () => {
      echo.leave(channelName);
    };
  }, [isLoggedIn, userData]);

  const handleNotificationClick = (notif) => {
    if (!notif.url) return;

    let frontendUrl = "/";

    if (notif.type === "request_pending_approval") frontendUrl = "/Admin2";
    if (notif.type === "property_approved") frontendUrl = "/houses";
    if (
      ["new_request", "request_accepted", "request_rejected"].includes(
        notif.type
      )
    )
      frontendUrl = "/myRequests";
    if (notif.type === "contract_uploaded") frontendUrl = "/host";
    if (notif.type === "payment_authorized") frontendUrl = "/myRequests";
    if (notif.type === "payment_captured") frontendUrl = "/myRequests";
    if (notif.type === "payment_canceled") frontendUrl = "/myRequests";

    navigate(frontendUrl);
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:8000/api/logout", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.message === "logout") {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        setUserData(null);
        setShowUserDropdown(false);
        showToast("✅ تم تسجيل الخروج", "success"); // عرض توست بدلاً من alert
      } else {
        showToast("❌ فشل تسجيل الخروج", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("❌ حدث خطأ أثناء تسجيل الخروج", "error");
    }
  };

  return (
    <>
      <header className="main-header">
        <NavLink to="/" className="logo">
          <img src="/public/images/download.png" alt="Logo" />
        </NavLink>

        <div
          className={`menu-btn ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`main-nav-links ${menuOpen ? "show-menu" : ""}`}>
          <NavLink
            to="/aboutus"
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            AboutUS
          </NavLink>
          <NavLink
            to="/houses"
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            Houses
          </NavLink>
          <NavLink
            to="/sellyourHouse"
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            sell your house
          </NavLink>
          <NavLink
            to="/myRequests"
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            My request
          </NavLink>
          <NavLink
            to="/host"
            style={({ isActive }) => (isActive ? activeStyles : null)}
          >
            My houses
          </NavLink>
        </nav>

        <div className="nav-actions">
          {!isLoggedIn && (
            <NavLink to="/Login" className="user-icon-link">
              <span className="user-icon">👤</span>
            </NavLink>
          )}

          {/* Notifications Icon */}
          {isLoggedIn && (
            <div style={{ position: "relative", marginLeft: "15px" }}>
              <span
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ cursor: "pointer", fontSize: "22px" }}
              >
                🔔
              </span>

              {unreadCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-5px",
                    right: "-5px",
                    background: "red",
                    color: "white",
                    borderRadius: "50%",
                    padding: "2px 6px",
                    fontSize: "12px",
                  }}
                >
                  {unreadCount}
                </span>
              )}

              {showNotifications && (
                <div className="notifications-dropdown">
                  {notifications.length === 0 ? (
                    <p style={{ padding: "10px" }}>No notifications</p>
                  ) : (
                    notifications.map((notif, index) => (
                      <div
                        key={index}
                        className="notification-item"
                        onClick={() => handleNotificationClick(notif)}
                      >
                        <p style={{ margin: 0 }}>{notif.message}</p>
                        <small>{notif.created_at}</small>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* User Account */}
          {isLoggedIn && (
            <div style={{ position: "relative" }}>
              <span
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                style={{
                  cursor: "pointer",
                  fontSize: "22px",
                  marginLeft: "10px",
                }}
              >
                👤
              </span>

              {showUserDropdown && userData && (
                <div className="user-dropdown show">
                  <p>
                    <strong>Name:</strong> {userData.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {userData.email}
                  </p>
                  <p>
                    <strong>Personal ID:</strong> {userData.personal_id}
                  </p>
                  <p>
                    <strong>Gender:</strong> {userData.gender}
                  </p>
                  <p>
                    <strong>Birthday:</strong> {userData.birthday}
                  </p>
                  <p>
                    <strong>Mobile:</strong> {userData.mobile}
                  </p>
                  <p>
                    <strong>Nationality:</strong> {userData.nationality}
                  </p>
                  <p>
                    <strong>Job:</strong> {userData.job}
                  </p>
                  <p>
                    <strong>Residency:</strong> {userData.residency}
                  </p>
                  <p>
                    <strong>Budget:</strong> {userData.budget}
                  </p>

                  <button
                    onClick={handleLogout}
                    style={{
                      width: "100%",
                      padding: "6px 0",
                      border: "none",
                      background: "#c0392b",
                      color: "#fff",
                      borderRadius: "5px",
                      cursor: "pointer",
                      marginTop: "8px",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      <div className="hero">
        <video
          className="hero-video"
          autoPlay
          loop
          muted
          playsInline
          src="https://www.pexels.com/download/video/3217431/"
        />

        <BlurText
          text="Shariki Real Estate"
          delay={150}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="blur-text-h1"
        />

        <div className="features-boxs">
          <div className="feature-item">
            🏡 <br /> Free property visits <br />{" "}
            <small>Tour before you decide</small>
          </div>
          <div className="feature-item">
            ⭐ <br /> 5000+ homes sold & rented <br />{" "}
            <small>Trusted by families</small>
          </div>
          <div className="feature-item">
            💰 <br /> Best market prices <br />{" "}
            <small>Invest smart, live better</small>
          </div>
        </div>
      </div>

      {/* ===== TOAST ===== */}
      {toast.show && (
        <div className={`toast-box ${toast.type}`}>{toast.message}</div>
      )}
    </>
  );
}
