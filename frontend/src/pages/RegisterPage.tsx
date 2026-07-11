import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/auth.service";

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

            alert("Registration successful");

            navigate("/");
        } catch (err) {
            const error = err as { response?: { data?: { message?: string } } };
            alert(
                error.response?.data?.message ??
                "Registration failed"
            );
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Register</h1>

            <input
                placeholder="Name"
                value={name}
                onChange={(e) =>
                    setName(e.target.value)
                }
            />

            <br /><br />

            <input
                placeholder="Email"
                value={email}
                onChange={(e) =>
                    setEmail(e.target.value)
                }
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                    setPassword(e.target.value)
                }
            />

            <br /><br />

            <button type="submit">
                Register
            </button>
        </form>
    );
}