import { useEffect, useState } from "react";
import JobCard from "../components/JobCard";
import {
    getJobs,
    createJob,
    deleteJob,
    deleteAllJobs,
} from "../services/job.service";
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

import type { Job } from "../types/job";


export default function DashboardPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] =
        useState("");
        const [priority, setPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH"
>("MEDIUM");
const [delay, setDelay] = useState("");
        const user: User = JSON.parse(
    localStorage.getItem("user")!
);

    async function loadJobs() {
        try {
            const result = await getJobs();
            setJobs(result.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
    const fetchJobs = async () => {
        await loadJobs();
    };

    fetchJobs();
    

    const interval = setInterval(() => {
        void loadJobs();
    }, 3000);

    return () => clearInterval(interval);

}, []);

    async function handleCreate(
    e: React.FormEvent
) {
    
    e.preventDefault();

    setLoading(true);

    try {
        await createJob({
            title,
            description,
            priority,
            delay:
    delay === ""
        ? 0
        : Number(delay) * 1000,
        });

        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setDelay(0);

        await loadJobs();

    } finally {
        setLoading(false);
    }
}

    async function handleDelete(id: string) {

    const confirmed = window.confirm(
        "Delete this job?"
    );

    if (!confirmed) return;

    await deleteJob(id);

    await loadJobs();
}
async function handleDeleteAll() {

    const confirmed = window.confirm(
        "Delete all jobs?"
    );

    if (!confirmed) return;

    try {

        await deleteAllJobs();

        await loadJobs();

    } catch (err) {

        console.log(err);

        alert("Failed to delete jobs");

    }
}

    function logout() {
        localStorage.removeItem("token");
        window.location.href = "/";
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center bg-white rounded-xl shadow-md p-6 mb-8">

    <div>
        <h1 className="text-3xl font-bold">
            Welcome, {user.name}
        </h1>

        <p className="text-gray-600">
            {user.email}
        </p>

        <p className="text-sm text-blue-600 font-semibold">
            {user.role}
        </p>
    </div>

    <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
    >
        Logout
    </button>

</div>



            <hr />

            <form
    onSubmit={handleCreate}
    className="bg-white rounded-xl shadow-md p-6 mb-8"
>

    <h2 className="text-2xl font-semibold mb-4">
        Create Job
    </h2>

    <input
        className="border rounded-lg w-full p-3 mb-4"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
    />

    <input
        className="border rounded-lg w-full p-3 mb-4"
        placeholder="Description"
        value={description}
        onChange={(e) =>
            setDescription(e.target.value)
        }
    />
    <select
    className="border rounded-lg w-full p-3 mb-4"
    value={priority}
    onChange={(e) =>
        setPriority(
            e.target.value as
                | "LOW"
                | "MEDIUM"
                | "HIGH"
        )
    }
>
    <option value="LOW">
        Low Priority
    </option>

    <option value="MEDIUM">
        Medium Priority
    </option>

    <option value="HIGH">
        High Priority
    </option>
</select>
<input
    type="number"
    min={0}
    placeholder="Delay (seconds)"
    className="border rounded-lg w-full p-3 mb-4"
    value={delay}
    onChange={(e) =>
        setDelay(e.target.value)
    }
/>

    <button
    disabled={loading}
    type="submit"
    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
>
    {loading ? "Creating..." : "Create Job"}
</button>

</form>

            <hr />

            <div className="flex justify-between items-center mb-4">

    <h2 className="text-2xl font-bold">
        Jobs
    </h2>

    <div className="flex gap-3">

        <span className="bg-gray-200 px-4 py-2 rounded-lg font-semibold">
            Total: {jobs.length}
        </span>

        <button
            onClick={handleDeleteAll}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
        >
            Delete All
        </button>

    </div>

</div>

            
            {jobs.length === 0 ? (

    <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
        No jobs found.
    </div>

) : (
            
     jobs.map((job) => (
    <JobCard
        key={job.id}
        job={job}
        onDelete={handleDelete}
        onRefresh={loadJobs}
    />
))
            
        )}
        </div>
        <footer className="text-center text-gray-500 mt-10 mb-5">

    Distributed Task Queue

    <br />

    Built with React • Express • BullMQ • Redis • PostgreSQL

</footer>
        </div>
        
    );
}