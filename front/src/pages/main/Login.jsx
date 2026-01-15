import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/login.css";

const countries = [
  { name: "Saudi Arabia", code: "+966" },
  { name: "USA", code: "+1" },
  { name: "Egypt", code: "+20" },
  { name: "UK", code: "+44" },
  { name: "Syrian", code: "+963" },
];

export default function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    personal_id: "",
    gender: "",
    birthday: "",
    mobile1: "",
    nationality: "Syrian",
    job: "",
    residency: "",
    budget: "0",
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false }), 4000);
  };

  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    signUpButton?.addEventListener("click", () =>
      container.classList.add("right-panel-active")
    );
    signInButton?.addEventListener("click", () =>
      container.classList.remove("right-panel-active")
    );
  }, []);

  // ================= LOGIN =================
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      const token = data.token || data.Token;
      if (!token) throw new Error("No token received");

      localStorage.setItem("token", token);
      localStorage.setItem("role", "user");
      showToast("✅ تسجيل الدخول ناجح");

      setTimeout(() => {
        if (
          loginData.email === "admin@example.com" &&
          loginData.password === "Admin1234"
        ) {
          localStorage.setItem("role", "admin");
          navigate("/AdminDashbored", { replace: true });
        } else {
          localStorage.setItem("role", "user");
          navigate("/", { replace: true });
        }
      }, 2000);

    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();

    if (registerData.password.length < 9)
      return showToast("❌ كلمة المرور يجب أن تكون 9 محارف على الأقل", "error");

    if (registerData.password !== registerData.password_confirmation)
      return showToast("❌ كلمتا المرور غير متطابقتين", "error");

    if (Number(registerData.budget) < 0)
      return showToast("❌ الميزانية يجب أن تكون صفر أو أكثر", "error");

    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(registerData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // AUTO LOGIN
      const loginRes = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const loginDataResp = await loginRes.json();
      if (!loginRes.ok)
        throw new Error(loginDataResp.message || "Auto login failed");

      const token = loginDataResp.token || loginDataResp.Token;
      if (!token) throw new Error("No token received");

      localStorage.setItem("token", token);
      localStorage.setItem("role", "user");

      showToast("✅ تم إنشاء الحساب وتسجيل الدخول");
      setTimeout(() => navigate("/", { replace: true }), 2000);
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-page">
        <span className="back-arrow" onClick={() => navigate(-1)}>
          ←
        </span>

        <div className="auth-container" id="container">
          {/* SIGN UP */}
          <div className="form-container sign-up-container">
            <form onSubmit={handleRegister}>
              <h1>Create Account</h1>

              <input placeholder="Name" onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} />
              <input placeholder="Email" onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} />
              <input type="password" placeholder="Password" onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} />
              <input type="password" placeholder="Confirm Password" onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })} />
              <input placeholder="Personal ID" onChange={(e) => setRegisterData({ ...registerData, personal_id: e.target.value })} />
              <input placeholder="Mobile" onChange={(e) => setRegisterData({ ...registerData, mobile1: e.target.value })} />
              <input placeholder="Job" onChange={(e) => setRegisterData({ ...registerData, job: e.target.value })} />
              <input placeholder="Residency" onChange={(e) => setRegisterData({ ...registerData, residency: e.target.value })} />
              <input type="date" onChange={(e) => setRegisterData({ ...registerData, birthday: e.target.value })} />

              <select onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })}>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <button disabled={loading}>
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>
          </div>

          {/* SIGN IN */}
          <div className="form-container sign-in-container">
            <form onSubmit={handleLogin}>
              <h1>Sign in</h1>
              <input placeholder="Email" onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} />
              <input type="password" placeholder="Password" onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} />
              <button disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
            </form>
          </div>

          {/* OVERLAY */}
          <div className="overlay-container">
            <div className="overlay">
              <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <button className="ghost" id="signIn">Sign In</button>
              </div>
              <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <button className="ghost" id="signUp">Sign Up</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast.show && <div className={`toast-box ${toast.type}`}>{toast.message}</div>}
    </>
  );
}
