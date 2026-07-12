import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.service";

export default function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(
        e: React.FormEvent
    ) {
        e.preventDefault();

        try {
            const result = await login({
    email,
    password,
});

localStorage.setItem(
    "token",
    result.data.token
);

localStorage.setItem(
    "user",
    JSON.stringify(result.data.user)
);

navigate("/dashboard");
        } catch (err: unknown) {
            type ErrorWithResponse = {
                response?: {
                    data?: {
                        message?: string;
                    };
                };
            };

            if (
                typeof err === "object" &&
                err !== null &&
                "response" in err
            ) {
                const errorWithResponse = err as ErrorWithResponse;
                alert(
                    errorWithResponse.response?.data?.message ??
                        "Login failed"
                );
            } else if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("Login failed");
            }
        }
    }

    return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md">

            <h1 className="text-3xl font-bold text-center mb-2">
                Distributed Task Queue
            </h1>

            <p className="text-gray-500 text-center mb-8">
                Sign in to continue
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">

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
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
                >
                    Login
                </button>

            </form>

            <p className="text-center text-gray-500 mt-6">
                Don't have an account?{" "}
                <span
                    className="text-blue-600 cursor-pointer hover:underline"
                    onClick={() =>
                        navigate("/register")
                    }
                >
                    Register
                </span>
            </p>

        </div>

    </div>
);}