import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "../styles/auth.css";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const registerUser = async () => {
    setMsg("Creating account...");

    // 1️⃣ Create user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMsg(error.message);
      return;
    }

    const user = data.user;

    // 2️⃣ Insert user profile in "profiles"
    if (user) {
      const { error: profileErr } = await supabase
        .from("profiles")
        .insert({
          id: user.id,          // IMPORTANT
          username: username,
          email: email,
        });

      if (profileErr) {
        setMsg("Account created, but profile save failed: " + profileErr.message);
        return;
      }
    }

    setMsg("Account created! Please check your email to verify.");
  };

  return (
    <div className="auth-container">
      <div className="auth-box">

        <h2>Create Account</h2>

        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="auth-input"
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={registerUser}>
          Sign Up
        </button>

        <p className="auth-switch">
          Already have an account? <a href="/login">Login</a>
        </p>

        {msg && <p className="auth-msg">{msg}</p>}
      </div>
    </div>
  );
}
