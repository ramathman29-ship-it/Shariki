import { NavLink, useNavigate } from "react-router-dom";
import GradientText from "../../components/GradientText";
import { useState, useEffect } from "react";
import echo from "../../echo"; // Laravel Echo / Pusher

const activeStyles = {
  fontWeight: "bold",
  color: "#fff",
  backgroundColor: "#000000ff",
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  /* ======== User & Login States ======== */
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

  /* ======== Logout ======== */
  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("❌ No token found. Please login.", "error");
      navigate("/login");
      return;
    }

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
        showToast("✅ Logged out successfully!");
        setTimeout(() => navigate("/login", { replace: true }), 1000);
      } else {
        showToast("❌ Failed to logout.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("❌ Error during logout.", "error");
    }
  };

  /* ======== Fetch User Data ======== */
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    if (!token) return;

    const fetchUserData = async () => {
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
          setUserData(data.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  /* ======== Fetch Notifications ======== */
  useEffect(() => {
    if (!isLoggedIn) return;

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
  }, [isLoggedIn]);

  /* ======== Echo Notifications (Live) ======== */
  useEffect(() => {
    if (!isLoggedIn || !userData?.id) return;

    const channelName = `App.Models.User.${userData.id}`;

    echo.private(channelName).notification((notification) => {
      console.log("NEW NOTIFICATION:", notification);

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      showToast(notification.message, "success");
    });

    return () => {
      echo.leave(channelName);
    };
  }, [isLoggedIn, userData?.id]);

  /* ======== Handle Notification Click ======== */
  const handleNotificationClick = (notif) => {
    if (!notif.url) return;

    let frontendUrl = "/";

    if (notif.type === "request_pending_approval") frontendUrl = "/Admin2";
    if (notif.type === "property_approved") frontendUrl = "/houses";
    if (["new_request", "request_accepted", "request_rejected"].includes(notif.type))
      frontendUrl = "/myRequests";
    if (notif.type === "contract_uploaded") frontendUrl = "/host";

    navigate(frontendUrl);
    setUnreadCount((prev) => Math.max(prev - 1, 0));
  };

  return (
    <>
      <nav className="admin-nav">
        <NavLink
          to="/Admin"
          className="admin-link"
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          Buy/Sell Request
        </NavLink>

        <NavLink
          to="/Admin2"
          className="admin-link"
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          Publish Request
        </NavLink>

        <NavLink
          to="/admin/reports"
          className="admin-link"
          style={({ isActive }) => (isActive ? activeStyles : undefined)}
        >
          Reports
        </NavLink>

        <button
          onClick={handleLogout}
          style={{
            width: "80px",
            position: "fixed",
            right: "20px",
            padding: "6px 12px",
            border: "none",
            background: "#c0392b",
            color: "#fff",
            borderRadius: "5px",
            cursor: "pointer",
            zIndex: 9999,
          }}
        >
          Logout
        </button>

        {/* ===== Notifications Icon ===== */}
        {isLoggedIn && (
          <div style={{ position: "relative", marginLeft: "15px" }}>
            <span
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ cursor: "pointer", fontSize: "22px",    position: "fixed",
            right: "120px", top: "18px"}}
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
      </nav>

      <GradientText
        colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
        animationSpeed={10}
        showBorder={false}
        className="custom-class"
      >
        Admin Dashboard
      </GradientText>

      {/* ===== TOAST ===== */}
      {toast.show && (
        <div className={`toast-box ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
