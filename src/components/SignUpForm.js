// src/components/SignUpForm.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SignUpForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e) {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return alert(error.message);
    alert('Signup ok — check your email if confirmation is enabled. You will be logged in automatically in many setups.');
  }

  return (
    <form onSubmit={handleSignUp} style={{ maxWidth: 360 }}>
      <h3>Sign up to Qoeens</h3>
      <label>Email</label>
      <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
      <label>Password</label>
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
      <button disabled={loading} type="submit">{loading ? 'Signing up...' : 'Sign up'}</button>
    </form>
  );
}
