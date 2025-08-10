// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);      // supabase auth user
  const [profile, setProfile] = useState(null); // row from "profiles" table
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function init() {
      // get current user
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user ?? null;

      if (currentUser && mounted) {
        setUser(currentUser);
        await ensureProfile(currentUser);
      }
      setLoading(false);
    }

    init();

    // subscribe to auth changes
    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        if (u) await ensureProfile(u);
        else setProfile(null);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe?.();
    };
  }, []);

  async function ensureProfile(u) {
    if (!u) return;
    // create or update the profiles row for this user (RLS requires id=auth.uid())
    const display_name = u.user_metadata?.full_name || u.email?.split('@')[0] || 'Qoeens';
    const upsertPayload = { id: u.id, email: u.email, display_name, avatar_url: null };

    const { data, error } = await supabase
      .from('profiles')
      .upsert(upsertPayload, { returning: 'representation' })
      .select()
      .single();

    if (!error) setProfile(data);
    else console.error('Profile upsert error', error);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
