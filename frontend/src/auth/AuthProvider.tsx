import React, { createContext, useContext, useEffect, useState } from 'react';
import keycloak from './keycloak';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  token?: string;
  username?: string;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | undefined>();
  const [token, setToken] = useState<string | undefined>();

  useEffect(() => {
    keycloak
      .init({
        onLoad: 'check-sso',
        pkceMethod: 'S256',
        silentCheckSsoRedirectUri:
          window.location.origin + '/silent-check-sso.html',
      })
      .then((authenticated) => {
        setIsAuthenticated(authenticated);
        setToken(keycloak.token);

        if (authenticated) {
          setUsername(keycloak.tokenParsed?.preferred_username);
        }
      });
  }, []);

  const login = () => keycloak.login();
  const logout = () => keycloak.logout({ redirectUri: window.location.origin });

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, token, username }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}