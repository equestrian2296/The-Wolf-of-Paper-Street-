'use client';  // Marking the file as a Client Component

import { useEffect } from "react";
import { useRouter } from "next/navigation";  // Use next/navigation for Next.js 13+
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "../../Firebase/firebase";  // Import Firebase configuration

export default function Home() {
    const router = useRouter();
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // If logged in, redirect to the Home Page
                router.push("/home");
            } else {
                // If not logged in, redirect to the Login Page
                router.push("/login");
            }
        });

        // Clean up the listener when the component unmounts
        return () => unsubscribe();
    }, [auth, router]);

    return <p>Redirecting...</p>;  // Shows a loading message during redirection
}
