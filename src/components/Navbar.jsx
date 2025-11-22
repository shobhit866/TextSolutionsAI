import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../styles/navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkUser();

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

        <Link to="/" className="nav-logo">
          TextSolutions<span className="glow">AI</span>
        </Link>

        <div className={`hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link to="/" className={pathname === "/" ? "active" : ""} onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/summarizer" className={pathname === "/summarizer" ? "active" : ""} onClick={() => setMenuOpen(false)}>
            Summarizer
          </Link>

          <Link to="/mindmap" className={pathname === "/mindmap" ? "active" : ""} onClick={() => setMenuOpen(false)}>
            Mind Map
          </Link>

          <Link to="/chatbot" className={pathname === "/chatbot" ? "active" : ""} onClick={() => setMenuOpen(false)}>
            Chatbot
          </Link>

          <Link to="/dashboard" className={pathname === "/dashboard" ? "active" : ""} onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>

          {!user && (
            <>
              <Link to="/login" className={`login-btn ${pathname === "/login" ? "active-login" : ""}`} onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/signup" className={`login-btn ${pathname === "/signup" ? "active-login" : ""}`} onClick={() => setMenuOpen(false)}>
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
