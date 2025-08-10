"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function PostPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const isImage = selected.type.startsWith("image/");
    const isVideo = selected.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setMessage("❌ Only images or videos allowed.");
      setFile(null);
      return;
    }

    if (isImage && selected.size > 2 * 1024 * 1024) {
      setMessage("❌ Image must be ≤ 2MB.");
      setFile(null);
      return;
    }

    if (isVideo && selected.size > 5 * 1024 * 1024) {
      setMessage("❌ Video must be ≤ 5MB.");
      setFile(null);
      return;
    }

    setFile(selected);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("loggedInEmail");
    if (!email) {
      setMessage("❌ You must be logged in to post.");
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("first_name")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      setMessage("❌ Failed to fetch user data.");
      return;
    }

    let mediaUrl = null;

    if (file) {
      const ext = file.name.split(".").pop();
      const filePath = `${uuidv4()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("tweet-media")
        .upload(filePath, file);

      if (uploadError) {
        setMessage("❌ Failed to upload media.");
        return;
      }

      const { data: publicData } = supabase.storage
        .from("tweet-media")
        .getPublicUrl(filePath);

      mediaUrl = publicData.publicUrl;
    }

    const { error: insertError } = await supabase.from("posts").insert([
      {
        email,
        first_name: userData.first_name,
        content: text,
        media_url: mediaUrl,
        created_at: new Date(),
      },
    ]);

    if (insertError) {
      setMessage("❌ Failed to post.");
    } else {
      setMessage("✅ Post created!");
      setTimeout(() => router.push("/"), 1000);
    }
  };

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: 'var(--pearl-lusta)',
      padding: "20px"
    }}>
      <div style={{
        backgroundColor: "var(--almond)",
        padding: "25px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "500px"
      }}>
        <h1 style={{ marginBottom: "10px", textAlign: "center", fontSize: "24px" }}>
          ✏️ Create Post
        </h1>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <textarea
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
            style={{
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              minHeight: "100px",
              resize: "vertical",
              fontSize: "14px"
            }}
          />
          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleFileChange}
            style={{
              padding: "10px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "white"
            }}
          />
          <button
            type="submit"
            style={{
              padding: "12px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "var(--twine)",
              color: "#fff",
              fontSize: "16px",
              cursor: "pointer",
              transition: "background 0.3s"
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = "#b38302ff"}
            onMouseOut={(e) => e.target.style.backgroundColor = "var(--twine)"}
          >
            Post
          </button>
        </form>
        {message && (
          <p style={{
            marginTop: "15px",
            color: message.startsWith("✅") ? "green" : "red",
            textAlign: "center",
            fontWeight: "500"
          }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
