"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const styles = {
  page: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, var(--almond), var(--calico))",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "700",
    color: "rgb(234,182,118)",
    fontWeight: "bold"
  },
  tagline: {
    fontSize: "1rem",
    fontWeight: "400",
    color: "#e28743",
    margin: "20px"
  },
  card: {
    background: "var(--rum-swizzle)",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "400px",
    textAlign: "center",
    border: "2px solid var(--twine2)",
  },
  title: {
    marginBottom: "20px",
    fontWeight: "600",
    fontSize: "1.5rem",
    color: "var(--twine2)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid var(--sorrell-brown)",
    outline: "none",
    background: "var(--pearl-lusta)",
    color: "#333",
  },
  button: {
    padding: "12px",
    background: "var(--twine)",
    color: "#fff",
    fontWeight: "500",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.3s",
  },
  message: {
    marginTop: "10px",
    color: "var(--twine2)",
    fontSize: "0.9rem",
  },
};

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", formData.email)
      .single();

    if (existingUser) {
      setMessage("Email already registered");
      return;
    }

    const { error } = await supabase.from("users").insert([
      {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
      },
    ]);

    if (error) {
      setMessage("Error creating account: " + error.message);
    } else {
      setMessage("Account created successfully!");
      setTimeout(() => router.push("/login"), 1500);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Qoeens 👑</h1>
        <p style={styles.tagline}>Rule Your Voice</p>
      </div>

      <div style={styles.card}>
        <h2 style={styles.title}>Sign Up</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            style={styles.input}
            name="firstName"
            placeholder="First Name"
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            name="lastName"
            placeholder="Last Name"
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            style={styles.input}
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button style={styles.button} type="submit">
            Sign Up
          </button>
        </form>
        <p style={styles.message}>{message}</p>
      </div>
    </div>
  );
}
