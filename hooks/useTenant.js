"use client";

import { useParams } from "next/navigation"

export const useTenant = () =>{
    const params = useParams();

    return params?.dashboard || null;
}