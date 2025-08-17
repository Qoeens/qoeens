"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", formData.email)
      .eq("password", formData.password) // ❌ No hashing, just plain string check
      .single();

    if (error || !user) {
      setMessage("Invalid credentials");
    } else {
      localStorage.setItem("loggedInEmail", formData.email);
      setMessage("Login successful!");
      setTimeout(() => router.push("/"), 1000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
        justifyContent: "center",
        backgroundColor: "#faf6e6", // matches --rum-swizzle
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <h1 style={{ color: "#3b5998", fontSize: "2.5rem", marginBottom: "0.2rem",  }}>
        Qoeens 👑
      </h1>
      <p style={{ color: "#cfb494", marginBottom: "2rem" }}>Rule Your Voice</p>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          backgroundColor: "#8b9dc3",
          padding: "2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          width: "300px",
        }}
      >
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc8ac",
            fontSize: "14px",
          }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
          style={{
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid #ccc8ac",
            fontSize: "14px",
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: "lightgrey",
            color: "black",
            border: "none",
            padding: "10px",
            borderRadius: "20px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            transition: "background 0.3s ease",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#b3cde0")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "lightgrey")}
        >
          Login
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: "1rem",
            color: message.includes("success") ? "green" : "red",
            fontWeight: "500",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
