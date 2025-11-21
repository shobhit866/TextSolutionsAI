import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState("loading");

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      setAuth(user ? "authorized" : "unauthorized");
    }
    checkAuth();
  }, []);

  if (auth === "loading") return <p>Loading...</p>;
  if (auth === "unauthorized") return <Navigate to="/login" replace />;

  return children;
}
