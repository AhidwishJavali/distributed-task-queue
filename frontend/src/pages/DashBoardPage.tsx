import { useEffect, useState } from "react";

import {
    getJobs,
    createJob,
    deleteJob,
} from "../services/job.service";
interface User {
    id: string;
    name: string;
    email: string;
    role: string;
}

interface Job {
    id: string;
    title: string;
    description: string;
    status: string;
}
function getStatusColor(status: string) {
    switch (status) {
        case "PENDING":
            return "bg-yellow-100 text-yellow-800";

        case "RUNNING":
            return "bg-blue-100 text-blue-800";

        case "COMPLETED":
            return "bg-green-100 text-green-800";

        case "FAILED":
            return "bg-red-100 text-red-800";

        default:
            return "bg-gray-100 text-gray-800";
    }
}

export default function DashboardPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] =
        useState("");
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
        });

        setTitle("");
        setDescription("");

        loadJobs();

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

    loadJobs();
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

    <span className="bg-gray-200 px-4 py-2 rounded-lg font-semibold">
        Total: {jobs.length}
    </span>

</div>

            
            {jobs.length === 0 ? (

    <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
        No jobs found.
    </div>

) : (
            jobs.map((job) => (
                <div
    key={job.id}
    className="bg-white rounded-xl shadow-md p-5 mb-4"
>
                    <h3 className="text-xl font-semibold">
    {job.title}
</h3>


                    <p className="text-gray-600 mt-2">
    {job.description}
</p>

                    <div className="mt-3 flex items-center gap-2">

    <span className="font-semibold">
        Status:
    </span>

    <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
            job.status
        )}`}
    >
        {job.status}
    </span>

</div>

                    <button
    onClick={() => handleDelete(job.id)}
    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
>
    🗑 Delete
</button>
                </div>
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