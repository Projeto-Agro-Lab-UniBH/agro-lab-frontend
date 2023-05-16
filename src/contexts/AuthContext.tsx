import React, { createContext, useContext, useEffect, useState } from "react";
import Router from "next/router";
import { User } from "../interfaces/User";
import { AuthService } from "../services/AuthService";
import { setCookie, parseCookies } from "nookies"
import { ProfileService } from "../services/ProfileService";
import { api } from "../providers/Api";

type AuthContext = {
  isAuthenticated: boolean
  user: User | null;
  signIn: (data: SignInData) => Promise<void>;
}

type SignInData = {
  email: string, 
  password: string
}

export const AuthContext = createContext({} as AuthContext);

export function useAuthContext() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies()
    
    if (token) {
      ProfileService.getUserDataStoredinToken().then(response => {
        setUser(response.data.user)
      })
    }
  }, [])

  async function signIn({ email, password }: SignInData) {
    const { data } = await AuthService.signIn({
      email, 
      password
    });

    setCookie(undefined, 'nextauth.token', data.token, {
      maxAge: 60 * 60 * 8
    })

    setUser(data.user)

    api.defaults.headers['Autorization'] = `Bearer ${data.token}`

    Router.push('/')
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}
