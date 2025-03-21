import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import React from "react";

interface IAuthContext {
  user: User | null;
  login: (email: string, password: string) => void;
  register: (email: string, password: string) => void;
  logout: () => void;
}

const defaultValues = {
  user: null,
  login: (email: string, password: string) => {
    console.log("logging in");
  },
  register: (email: string, password: string) => {
    console.log("registering");
  },
  logout: () => {
    console.log("logging out");
  },
};
const AuthContext = createContext<IAuthContext>(defaultValues);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => setUser(user));
    console.log(user);

    return () => unsubscribe();
  }, []);

  const login = (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password);
  const register = (email: string, password: string) =>
    createUserWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
