import { createContext, useState, useContext } from "react";

interface AuthUser {  
  id: number;
  username: string;
}

interface AuthContextType {
  user: AuthUser | null;
  key: CryptoKey | null;
  login: (user: AuthUser, key: CryptoKey) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [key, setKey] = useState<CryptoKey | null>(null);

  const login = (user: AuthUser, key: CryptoKey) => {
    setUser(user);
    setKey(key);
  };

  const logout = () => {
    setUser(null);
    setKey(null);
  };

  return (
    <AuthContext.Provider value={{ user, key, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}