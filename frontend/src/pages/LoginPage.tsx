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
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>

            <input
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <br />
            <br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <br />
            <br />

            <button type="submit">
                Login
            </button>
        </form>
    );
}