// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Detect logged-in user
  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkUser();

    // Listen for auth events
    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="nav">
      <div className="nav-container">

        {/* Brand */}
        <Link to="/" className="nav-logo">
          TextSolutions<span className="glow">AI</span>
        </Link>

        {/* Navigation Links */}
        <nav className="nav-links">

          <Link to="/" className={pathname === "/" ? "active" : ""}>
            Home
          </Link>

          <Link to="/summarizer" className={pathname === "/summarizer" ? "active" : ""}>
            Summarizer
          </Link>

          <Link to="/mindmap" className={pathname === "/mindmap" ? "active" : ""}>
            Mind Map
          </Link>

          <Link to="/chatbot" className={pathname === "/chatbot" ? "active" : ""}>
            Chatbot
          </Link>

           <Link to="/Dashboard" className={pathname === "/Dashboard" ? "active" : ""}>
            Dashboard
          </Link>

          {/* ------------------------------
               AUTH BUTTONS (Dynamic)
          -------------------------------- */}

          {!user && (
            <>
              <Link
                to="/login"
                className={`login-btn ${pathname === "/login" ? "active-login" : ""}`}
              >
                Login
              </Link>

              <Link
                to="/signup"
                className={`signup-btn ${pathname === "/signup" ? "active-login" : ""}`}
              >
                Sign Up
              </Link>
            </>
          )}

          {user && (
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          )}

        </nav>

      </div>
    </header>
  );
}
