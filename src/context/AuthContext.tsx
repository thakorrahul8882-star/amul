import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { AdminUser } from '../types';

interface AuthContextType {
  user: AdminUser | null;
  loading: boolean;
  isAdmin: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AUTHORIZED_ADMIN_EMAILS = [
  'thakorrahul8882@gmail.com',
  'admin@amulkhodana.com',
  'amulparlourkhodana@gmail.com',
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check local fallback admin session (for instant password authentication)
    const localAdmin = localStorage.getItem('amul_admin_session');
    if (localAdmin) {
      try {
        const parsed = JSON.parse(localAdmin);
        setUser(parsed);
      } catch (e) {
        console.warn('Error reading admin session', e);
      }
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const email = firebaseUser.email?.toLowerCase() || '';
        const isAuthorized =
          AUTHORIZED_ADMIN_EMAILS.includes(email) ||
          email.includes('thakorrahul') ||
          email.includes('admin');

        const adminObj: AdminUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Amul Admin',
          isAdmin: isAuthorized,
        };

        setUser(adminObj);
        if (isAuthorized) {
          localStorage.setItem('amul_admin_session', JSON.stringify(adminObj));
        }
      } else {
        // If not logged in via Firebase auth, keep local admin if still valid, else null
        const session = localStorage.getItem('amul_admin_session');
        if (!session) {
          setUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email?.toLowerCase() || '';

      const isAuthorized =
        AUTHORIZED_ADMIN_EMAILS.includes(email) ||
        email.includes('thakorrahul') ||
        email.includes('admin');

      if (!isAuthorized) {
        await signOut(auth);
        localStorage.removeItem('amul_admin_session');
        setUser(null);
        throw new Error(
          `ખાતું ${email} એડમિન તરીકે માન્ય નથી. માત્ર અધિકૃત સંચાલક જ લોગીન કરી શકે છે.`
        );
      }

      const adminObj: AdminUser = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        isAdmin: true,
      };
      setUser(adminObj);
      localStorage.setItem('amul_admin_session', JSON.stringify(adminObj));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google Login failed';
      setError(msg);
      throw err;
    }
  };

  const loginWithEmail = async (emailInput: string, passwordInput: string) => {
    setError(null);
    const cleanEmail = emailInput.trim().toLowerCase();

    // Verify authorized admin email or owner credentials
    const isKnownAdmin =
      AUTHORIZED_ADMIN_EMAILS.includes(cleanEmail) ||
      cleanEmail === 'thakorrahul8882@gmail.com' ||
      cleanEmail === 'admin@amulkhodana.com';

    if (!isKnownAdmin) {
      throw new Error('આ ઇમેઇલ એડમિનિસ્ટ્રેટર તરીકે નોંધાયેલ નથી.');
    }

    try {
      // Attempt Firebase email/pass
      const result = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
      const adminObj: AdminUser = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: 'Amul Admin',
        isAdmin: true,
      };
      setUser(adminObj);
      localStorage.setItem('amul_admin_session', JSON.stringify(adminObj));
    } catch {
      // If Firebase email/pass authentication is disabled in Console or password matches parlour passcode
      if (
        passwordInput === 'Amul@8849' ||
        passwordInput === 'amul123' ||
        passwordInput === 'khodana@amul' ||
        passwordInput === '8849526589'
      ) {
        const adminObj: AdminUser = {
          uid: 'admin_local_khodana',
          email: cleanEmail,
          displayName: 'અમૂલ પાર્લર ખોડાણા સંચાલક',
          isAdmin: true,
        };
        setUser(adminObj);
        localStorage.setItem('amul_admin_session', JSON.stringify(adminObj));
      } else {
        throw new Error('અમાન્ય પાસવર્ડ! કૃપા કરીને સાચો એડમિન પાસવર્ડ દાખલ કરો.');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch {
      // Ignore
    }
    localStorage.removeItem('amul_admin_session');
    setUser(null);
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: !!user?.isAdmin,
        loginWithGoogle,
        loginWithEmail,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
