import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth.service";
import {
    showSuccess,
    showError,
} from "../utils/toast";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        try {
            await register({
                name,
                email,
                password,
            });

            showSuccess("Registration successful.");

            navigate("/");
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            showError(
    error.response?.data?.message ??
    "Registration failed."
);
        }
    }

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

            <h1 className="text-3xl font-bold text-center mb-2">
                Create Account
            </h1>

            <p className="text-gray-500 text-center mb-8">
                Register to start using the Distributed Task Queue
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

                <div>
                    <label className="block mb-2 font-medium">
                        Name
                    </label>

                    <input
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Email
                    </label>

                    <input
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />
                </div>

                <div>
                    <label className="block mb-2 font-medium">
                        Password
                    </label>

                    <input
                        className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
                >
                    Register
                </button>

            </form>

            <p className="text-center text-gray-500 mt-6">
                Already have an account?{" "}
                <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() => navigate("/")}
                >
                    Login
                </span>
            </p>

        </div>

    </div>
);
}