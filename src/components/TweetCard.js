// src/components/TweetCard.js
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function TweetCard({ tweet, onLike }) {
  const { user } = useAuth();

  async function toggleLike() {
    if (!user) return alert('Sign in to like');
    try {
      const { data: existing } = await supabase
        .from('likes')
        .select('id')
        .eq('tweet_id', tweet.id)
        .eq('user_id', user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from('likes').delete().eq('id', existing.id);
      } else {
        await supabase.from('likes').insert([{ tweet_id: tweet.id, user_id: user.id }]);
      }
      if (onLike) onLike();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div style={{ border: '1px solid #eee', padding: 12, marginBottom: 8 }}>
      <div style={{ fontWeight: 'bold' }}>{tweet.profiles?.display_name || 'Unknown'}</div>
      <div>{tweet.content}</div>

      {tweet.image_urls?.map((url, i) => (
        <img key={i} src={url} alt="" style={{ maxWidth: 200, display: 'block', marginTop: 8 }} />
      ))}

      {tweet.video_url && (
        <video src={tweet.video_url} controls style={{ maxWidth: 300, display: 'block', marginTop: 8 }} />
      )}

      <div style={{ marginTop: 8 }}>
        <button onClick={toggleLike}>Like</button>
        <span style={{ marginLeft: 8 }}>Likes: {tweet.likes_count ?? '0'}</span>
      </div>
      {/* Comment UI (simple): consider a modal or inline form */}
    </div>
  );
}
