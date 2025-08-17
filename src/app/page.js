"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import styles from "./page.module.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Portal() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("id", { ascending: false });

      if (!error) setPosts(data);
    };

    fetchPosts();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>Qoeens</div>
        <nav className={styles.nav}>
          <a href="#" className={styles.navItem}>🏠 Home</a>
          <a href="#" className={styles.navItem}>❤️ Following</a>
          <a href="#" className={styles.navItem}>💬 Messages</a>
        </nav>
        <button className={styles.logoutBtn} onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      {/* Main content */}
      <div className={styles.main}>
        {/* Top Navbar */}
        <header className={styles.topbar}>
          <button
            className={styles.postBtn}
            onClick={() => (window.location.href = "/post")}
          >
            Post
          </button>

          <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
          />

          {/* ✅ Messages button right below search */}
          <button
            className={styles.messageBtn}
            onClick={() => alert("Messages feature coming soon!")}
          >
            💬 Messages
          </button>
        </header>


        {/* Posts list */}
        <div className={styles.contentVertical}>
          {posts.map((post) => (

            <div key={post.id} className={styles.postCard}>
              <h3>{post.first_name}</h3>

              <p>{post.content}</p>
              {post.media_url && (
                post.media_url.match(/\.(mp4|webm|mov)$/) ? (
                  <video
                    controls
                    src={post.media_url}
                    style={{ width: "100%", borderRadius: "8px" }}
                  ></video>
                ) : (
                  <img
                    src={post.media_url}
                    alt="Post Media"
                    style={{ width: "100%", borderRadius: "8px" }}
                  />
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
