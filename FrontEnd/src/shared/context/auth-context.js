import {createContext} from "react";

export const AuthContext =  createContext({isLoggedIn: false, userId: null,  timeSpent: null, lastLogin: null, token: null,  login : () => {}, logout: () => {}})