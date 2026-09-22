import { useState, useEffect } from "react";

/**
 * Returns true if the viewport width is < 768px (mobile).
 * Used to disable heavy animations (parallax, blur filters, particles)
 * on mobile for a smoother experience.
 */
export function useMobile(): boolean {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    return isMobile;
}
