
// Login.tsx
import React, { useState, useEffect } from "react";
import "./login.css";

interface LoginProps {
  onLogin: (email: string) => void;
  theme?: "light" | "dark";
  setTheme?: (theme: "light" | "dark") => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, theme = "light", setTheme }) => {
  const [email, setEmail] = useState("");

  // Optional: Toggle theme with double-click on login box
  const handleThemeToggle = () => {
    if (setTheme) setTheme(theme === "light" ? "dark" : "light");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onLogin(email.trim());
  };

  return (
    <div className={`login-container ${theme}`} onDoubleClick={handleThemeToggle}>
      <div className="login-box">
        <h2>Welcome to AI Analyzer</h2>
        <p>Enter your email to access advanced Excel insights</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Sign In</button>
        </form>

        <div className="login-links">
          <a href="#forgot">Forgot password?</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
