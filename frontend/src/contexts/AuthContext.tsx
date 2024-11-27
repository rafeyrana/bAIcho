import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { useAppDispatch } from '../store/hooks';
import { setUser, clearUser } from '../store/slices/userSlice';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true,
  logout: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUserState(currentUser);
      if (currentUser?.email) {
        dispatch(setUser({ email: currentUser.email }));
      } else {
        dispatch(clearUser());
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUserState(currentUser);
      if (currentUser?.email) {
        dispatch(setUser({ email: currentUser.email }));
      } else {
        dispatch(clearUser());
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUserState(null);
    dispatch(clearUser());
  };

  return (
    <AuthContext.Provider value={{ user: user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
