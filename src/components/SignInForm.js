// src/components/SignInForm.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignIn(e) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return alert(error.message);
    // user will be available via AuthContext listener (it sets profile)
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    // AuthContext will clear user/profile
  }

  return (
    <div style={{ maxWidth: 360 }}>
      <form onSubmit={handleSignIn}>
        <h3>Log in</h3>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        <button disabled={loading} type="submit">{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <button onClick={handleSignOut}>Sign out</button>
    </div>
  );
}
