import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/login.css"

const countries = [
  { name: "Saudi Arabia", code: "+966" },
  { name: "USA", code: "+1" },
  { name: "Egypt", code: "+20" },
  { name: "UK", code: "+44" },
  { name: "Syria", code: "+963" },
];

export default function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    personal_id: "",
    gender: "",
    birthday: "",
    mobile1: "",
    nationality: countries[0].name,
    job: "",
    residency: "",
    budget: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const signUpButton = document.getElementById("signUp");
    const signInButton = document.getElementById("signIn");
    const container = document.getElementById("container");

    const handleSignUp = () => container.classList.add("right-panel-active");
    const handleSignIn = () => container.classList.remove("right-panel-active");

    signUpButton.addEventListener("click", handleSignUp);
    signInButton.addEventListener("click", handleSignIn);

    return () => {
      signUpButton.removeEventListener("click", handleSignUp);
      signInButton.removeEventListener("click", handleSignIn);
    };
  }, []);

  // 🔹 تسجيل الدخول
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok) throw new Error(data.message  ||"Login failed");

      // 🟢 التقاط التوكن (Token أو token)
      const token = data.token || data.Token;
      if (!token) {
        console.warn("⚠️ No token found in response!", data);
      } else {
        localStorage.setItem("token", token);
        console.log("✅ Token saved:", token);
      }

      alert("Login successful!");
      navigate(-1);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 التسجيل مع تسجيل دخول تلقائي
  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        password_confirmation: registerData.password_confirmation,
        personal_id: registerData.personal_id,
        gender: registerData.gender,
        birthday: registerData.birthday,
        mobile1: registerData.mobile1,
        nationality: registerData.nationality,
        job: registerData.job,
        residency: registerData.residency,
        budget: registerData.budget,
      };

      // 🟢 أولاً: إنشاء الحساب
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("Register response:", data);

      if (!res.ok) throw new Error(data.message || "Registration failed");

      const loginRes = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
        }),
      });

      const loginData = await loginRes.json();
      console.log("Auto-login response:", loginData);

      if (!loginRes.ok) throw new Error(loginData.message|| "Auto-login failed");const token = loginData.token || loginData.Token;
      if (!token) {
        console.warn("⚠️ No token found in auto-login response!", loginData);
      } else {
        localStorage.setItem("token", token);
        console.log("✅ Token saved:", token);
      }

      alert("Account created successfully!");
      navigate(-1);

      setRegisterData({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        personal_id: "",
        gender: "",
        birthday: "",
        mobile1: "",
        nationality: countries[0].name,
        job: "",
        residency: "",
        budget: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container" id="container">
        {/* 🔹 Sign Up Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegister}>
            <h1>Create Account</h1>
            <span>Enter your details to register</span>

            <input type="text" placeholder="Name"
              value={registerData.name}
              onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })} required />

            <input type="email" placeholder="Email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })} required />

            <input type="password" placeholder="Password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })} required />

            <input type="password" placeholder="Confirm Password"
              value={registerData.password_confirmation}
              onChange={(e) => setRegisterData({ ...registerData, password_confirmation: e.target.value })} required />

            <input type="number" placeholder="Personal ID"
              value={registerData.personal_id}
              onChange={(e) => setRegisterData({ ...registerData, personal_id: e.target.value })} />

            <select value={registerData.gender}
              onChange={(e) => setRegisterData({ ...registerData, gender: e.target.value })} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>

            <input type="date" placeholder="Birthday"
              value={registerData.birthday}
              onChange={(e) => setRegisterData({ ...registerData, birthday: e.target.value })} required />

            <input type="tel" placeholder="Mobile"
              value={registerData.mobile1}
              onChange={(e) => setRegisterData({ ...registerData, mobile1: e.target.value })} required />

            <select value={registerData.nationality}
              onChange={(e) => setRegisterData({ ...registerData, nationality: e.target.value })} required>
              {countries.map((country, index) => (
                <option key={index} value={country.name}>{country.name}</option>
              ))}
            </select>

            <input type="text" placeholder="Job"
              value={registerData.job}
              onChange={(e) => setRegisterData({ ...registerData, job: e.target.value })} required />

            <input type="text" placeholder="Residency"
              value={registerData.residency}
              onChange={(e) => setRegisterData({ ...registerData, residency: e.target.value })} required />

            <input type="number" placeholder="Budget (e.g. 9000)"
              value={registerData.budget}
              onChange={(e) => setRegisterData({ ...registerData, budget: e.target.value })} required />

            {error && <p className="error-text">{error}</p>}
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>
        </div>{/* 🔹 Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <input type="email" placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required />

            <input type="password" placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required />

            <button type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
            {error && <p className="error-text">{error}</p>}
          </form>
        </div>

        {/* 🔹 Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn">Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" id="signUp">Sign Up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}