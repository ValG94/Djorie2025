import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  role: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>; // <-- retourne le user
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
      void checkUser();
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfileByAuthId = async (authUserId: string) => {
    const { data: userData, error } = await supabase
      .from('users')
      .select('id,email,role,name')
      .eq('id', authUserId)
      .maybeSingle();

    if (error) throw error;
    return userData as User | null;
  };

  const checkUser = async () => {
    setLoading(true);
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session?.user) {
        setUser(null);
        return;
      }

      const authUserId = session.user.id;

      // ✅ Récupérer le profil par ID (robuste)
      const profile = await fetchProfileByAuthId(authUserId);

      // Si pas de profil dans public.users, on considère non connecté côté app
      if (!profile) {
        console.warn('No profile found in public.users for auth user id:', authUserId);
        setUser(null);
        return;
      }

      setUser(profile);
    } catch (error) {
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const authUserId = data.user?.id;
    if (!authUserId) {
      // cas anormal : on sécurise
      await supabase.auth.signOut();
      throw new Error('No auth user id returned by Supabase.');
    }

    const profile = await fetchProfileByAuthId(authUserId);

    if (!profile) {
      // Auth OK mais pas de profil => on coupe
      await supabase.auth.signOut();
      throw new Error("Profil utilisateur introuvable dans public.users (table 'users').");
    }

    // Optionnel : si tu veux que signIn serve uniquement pour l’admin
    //Décommente si tu veux forcer admin ici :
    if (profile.role !== 'admin') {
      await supabase.auth.signOut();
      throw new Error("Accès refusé : vous n'êtes pas administrateur.");
    }

    setUser(profile);
    return profile;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
