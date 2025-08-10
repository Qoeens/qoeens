// src/components/TweetComposer.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function TweetComposer({ onPosted }) {
  const { user } = useAuth();
  const [text, setText] = useState('');
  const [images, setImages] = useState([]); // File[]
  const [video, setVideo] = useState(null); // File
  const [loading, setLoading] = useState(false);

  if (!user) return <p>Please sign in to post.</p>;

  function onImageChange(e) {
    const files = Array.from(e.target.files || []);
    const combined = [...images, ...files].slice(0, 3); // enforce max 3
    setImages(combined);
  }

  function onVideoChange(e) {
    const file = e.target.files?.[0] ?? null;
    setVideo(file);
  }

  async function uploadFile(file, userId) {
    const ext = file.name.split('.').pop();
    const filename = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `${userId}/${filename}`;
    const { data, error } = await supabase.storage.from('tweet-media').upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });
    if (error) throw error;
    // get public URL (for public bucket)
    const publicUrl = supabase.storage.from('tweet-media').getPublicUrl(data.path).data?.publicUrl;
    return publicUrl;
  }

  async function handlePost(e) {
    e?.preventDefault();
    if (!text.trim() && images.length === 0 && !video) return alert('Write something or attach media.');

    if (text.length > 1000) return alert('Text limit 1000 characters.');
    if (images.length > 3) return alert('Max 3 images.');

    setLoading(true);
    try {
      const imageUrls = [];
      for (const f of images) {
        const url = await uploadFile(f, user.id);
        imageUrls.push(url);
      }
      let videoUrl = null;
      if (video) {
        videoUrl = await uploadFile(video, user.id);
      }

      const { error } = await supabase.from('tweets').insert([{
        user_id: user.id,
        content: text,
        image_urls: imageUrls,
        video_url: videoUrl
      }]);

      if (error) throw error;

      setText(''); setImages([]); setVideo(null);
      if (onPosted) onPosted();
    } catch (err) {
      console.error(err);
      alert('Failed to post: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handlePost} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
      <textarea
        placeholder="What's happening in Qoeens?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        maxLength={1000}
        rows={4}
        style={{ width: '100%' }}
      />
      <div style={{ marginTop: 8 }}>
        <label>
          Add images (max 3)
          <input accept="image/*" type="file" multiple onChange={onImageChange} />
        </label>
        <div>
          {images.map((f, i) => <div key={i}>{f.name}</div>)}
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <label>
          Add video (only 1, small)
          <input accept="video/*" type="file" onChange={onVideoChange} />
        </label>
        <div>{video ? video.name : null}</div>
      </div>

      <div style={{ marginTop: 8 }}>
        <button type="submit" disabled={loading}>{loading ? 'Posting...' : 'Post'}</button>
      </div>
    </form>
  );
}
