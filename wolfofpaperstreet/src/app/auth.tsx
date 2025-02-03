import { useState } from "react";
import { useForm } from "react-hook-form";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../../Firebase/firebase"; // Ensure correct path
import { useRouter } from "next/router";

interface LoginFormData {
    email: string;
    password: string;
}

export default function Login() {
    const [error, setError] = useState<string | null>(null);
    const { register, handleSubmit } = useForm<LoginFormData>();
    const auth = getAuth(app);
    const router = useRouter();

    const onSubmit = async (data: LoginFormData) => {
        const { email, password } = data;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/home"); // Redirect after login
        } catch (error) {
            setError((error as Error).message); // Explicit type assertion
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            {...register("email", { required: true })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            {...register("password", { required: true })}
                            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                    >
                        Login
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600">
                    Don`t have an account? <a href="/register" className="text-blue-500 hover:underline">Sign Up</a>
                </p>
            </div>
        </div>
    );
}
