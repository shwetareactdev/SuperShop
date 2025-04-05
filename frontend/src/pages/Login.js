import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { FaUserShield, FaEye, FaEyeSlash } from "react-icons/fa";
 import { toast } from "react-toastify";
 import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  
  
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
        const { data } = await axios.post("http://localhost:5000/api/admin/login", { email, password });

        localStorage.setItem("authToken", data.token); // Store correct token
        window.location.href = "/"; // Redirect to dashboard
    } catch (error) {
        toast.error(error.response?.data?.message || "❌ Invalid Credentials");
    }
};
  

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="company-name">Super Shoppy</h1>
        <h2>Admin Login Form</h2> <FaUserShield className="login-icon" />
       
        
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
          />
          
          <div className="password-container">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <span onClick={() => setShowPassword(!showPassword)} className="eye-icon">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="extra-options">
          <a href="/forgot-password" className="forgot-password">Forgot Password?</a>
          {/* <p>Not an account? <a href="/register" className="register-link">Register</a></p> */}
        </div>

        <div className="contact-info">
          <p>📞 Support: +91 9561094572</p>
          <p>📧 Email: support@atharvgroup.com</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
