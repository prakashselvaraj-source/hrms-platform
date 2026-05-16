"use client";
import { setUser } from "@/redux/slices/userSlice";
import API from "@/utils/api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePathname } from "next/navigation";

export default function AuthProvider({ children }) {
    const dispatch = useDispatch();
    const pathname = usePathname();

    useEffect(() => {
        const isAuthPage = ["/login", "/register", "/verify-otp"].some(path => pathname.includes(path));
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

        if (isAuthPage || !token) return;

        const fetchUser = async () => {
            try {
                const response = await API.get("/user/me");
                console.log("Auth response:", response.data.firstName);
                dispatch(setUser(response.data));
            } catch (error) {
                console.log("Session invalid or expired");
            }
        }

        fetchUser();
    }, [pathname, dispatch]);

    return children;
}