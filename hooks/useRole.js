"use client";

import { useEffect, useState } from "react";

const useRole = () => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const storedRole = localStorage.getItem("role");
        if (storedRole) {
            setRole(storedRole);
        }
    }, []);

    return role;
};

export default useRole;