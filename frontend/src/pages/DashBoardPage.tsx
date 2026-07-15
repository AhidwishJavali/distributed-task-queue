import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
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
import DLQCard from "../components/DLQCard";

import type { DLQJob } from "../types/dlq";

import {
    getDLQJobs,
    retryDLQJob,
    clearDLQ,
} from "../services/dlq.service";

import type { Job } from "../types/job";
import UserCard from "../components/UserCard";
import {
    getUsers,
    getUserJobs,
    deleteUser,
} from "../services/user.service";

import type { User as AdminUser } from "../types/user";


export default function DashboardPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [dlqJobs, setDLQJobs] =
    useState<DLQJob[]>([]);
    const [search, setSearch] = useState("");

const [statusFilter, setStatusFilter] =
    useState("");

const [priorityFilter, setPriorityFilter] =
    useState("");

const [sort, setSort] = useState("newest");
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] =
        useState("");
        const [priority, setPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH"
>("MEDIUM");
const [delay, setDelay] = useState("");
const [image, setImage] = useState("mountain.jpg");
        const user: User = JSON.parse(
    localStorage.getItem("user")!
);
const [users, setUsers] = useState<AdminUser[]>([]);

const [selectedUserJobs, setSelectedUserJobs] =
    useState<Job[]>([]);

    async function handleClearDLQ() {

    const confirmed = window.confirm(
        "Clear the entire Dead Letter Queue?"
    );

    if (!confirmed) return;

    await clearDLQ();

    await loadDLQ();

}

    async function loadUsers() {
    if (user.role !== "ADMIN") return;

    try {
        const result = await getUsers();
        setUsers(result.data);
    } catch (err) {
        console.log(err);
    }
}

async function handleDeleteUser(id: string) {
    if (!window.confirm("Delete this user?"))
        return;

    await deleteUser(id);

    loadUsers();
}

async function handleViewJobs(id: string) {
    const result = await getUserJobs(id);

    setSelectedUserJobs(result.data);
}

    async function loadJobs() {
    try {
        const result = await getJobs({
            search:
                search || undefined,

            status:
                statusFilter || undefined,

            priority:
                priorityFilter || undefined,

            sort,
        });

        setJobs(result.data);
    } catch (err) {
        console.log(err);
    }
}
async function loadDLQ() {
    try {
        const result =
            await getDLQJobs();

        setDLQJobs(result.data);

    } catch (err) {
        console.log(err);
    }
}
async function handleRetry(id: string) {

    await retryDLQJob(id);

    await loadDLQ();

    await loadJobs();

}

    useEffect(() => {
    const fetchJobs = async () => {
        await Promise.all([
    loadJobs(),
    loadUsers(),
    loadDLQ(),
]);
    };

    fetchJobs();
    

    const interval = setInterval(() => {
        void loadJobs();
void loadDLQ();
    }, 3000);

    return () => clearInterval(interval);

},  [
    search,
    statusFilter,
    priorityFilter,
    sort,
]);

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
    image,
});

        setTitle("");
        setDescription("");
        setPriority("MEDIUM");
        setDelay("");
        setImage("mountain.jpg");

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
            <div className="bg-white rounded-xl shadow-md p-6 my-6">

    <h2 className="text-2xl font-semibold mb-5">
        Search & Filter
    </h2>

    <div className="flex gap-2 mb-5">

    <input
        className="border rounded-lg p-3 flex-1"
        placeholder="Search jobs..."
        value={search}
        onChange={(e) =>
            setSearch(e.target.value)
        }
    />

    <button
    type="button"
        onClick={() => loadJobs()}
        onKeyDown={(e) => {
    if (e.key === "Enter") {
        loadJobs();
    }
}}
        className="bg-blue-600 hover:bg-blue-700 text-white px-5 rounded-lg flex items-center justify-center"
    >
        <FaSearch />
    </button>

</div>

    <div className="grid grid-cols-3 gap-4">

        <select
            className="border rounded-lg p-3"
            value={statusFilter}
            onChange={(e) =>
                setStatusFilter(e.target.value)
            }
        >
            <option value="">
                All Status
            </option>

            <option value="PENDING">
                Pending
            </option>

            <option value="RUNNING">
                Running
            </option>

            <option value="COMPLETED">
                Completed
            </option>

            <option value="FAILED">
                Failed
            </option>

        </select>

        <select
            className="border rounded-lg p-3"
            value={priorityFilter}
            onChange={(e) =>
                setPriorityFilter(
                    e.target.value
                )
            }
        >
            <option value="">
                All Priority
            </option>

            <option value="LOW">
                Low
            </option>

            <option value="MEDIUM">
                Medium
            </option>

            <option value="HIGH">
                High
            </option>

        </select>

        <select
            className="border rounded-lg p-3"
            value={sort}
            onChange={(e) =>
                setSort(e.target.value)
            }
        >
            <option value="newest">
                Newest
            </option>

            <option value="oldest">
                Oldest
            </option>

        </select>

    </div>

</div>

{/*<select>

mountain.jpg

forest.jpg

cat.jpg

car.jpg

dog.jpg

</select>*/}

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
    <label className="block mb-2 font-semibold">
    Select Image
</label>
    <select
    className="border rounded-lg w-full p-3 mb-4"
    value={image}
    onChange={(e) => setImage(e.target.value)}
>
    <option value="mountain.jpg">Mountain</option>
    <option value="forest.jpg">Forest</option>
    <option value="cat.jpg">Cat</option>
    <option value="dog.jpg">Dog</option>
    <option value="car.jpg">Car</option>
</select>
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
    {user.role === "ADMIN"
        ? "All Jobs"
        : "My Jobs"}
</h2>

    <div className="flex gap-3">

        <span className="bg-gray-200 px-4 py-2 rounded-lg font-semibold">
            Total: {jobs.length}
        </span>

        <button
            onClick={handleDeleteAll}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
        >
            {user.role === "ADMIN"
    ? "Delete All Jobs"
    : "Delete My Jobs"}
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
        {user.role === "ADMIN" && (
    <>
        <hr className="my-10" />

        <h2 className="text-3xl font-bold mb-6">
            User Management
        </h2>

        {users.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6">
                No users found.
            </div>
        ) : (
            users.map((u) => (
                <UserCard
                    key={u.id}
                    user={u}
                    onDelete={handleDeleteUser}
                    onViewJobs={handleViewJobs}
                />
            ))
        )}

        {selectedUserJobs.length > 0 && (
            <>
                <h2 className="text-2xl font-bold mt-10 mb-5">
                    Selected User Jobs
                </h2>

                {selectedUserJobs.map((job) => (
                    <JobCard
                        key={job.id}
                        job={job}
                        onDelete={handleDelete}
                        onRefresh={loadJobs}
                    />
                ))}
            </>
        )}
    </>
)}
<hr className="my-10" />

<div className="flex justify-between items-center mb-6">

    <h2 className="text-3xl font-bold">
        Dead Letter Queue
    </h2>

    <button
        onClick={handleClearDLQ}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
    >
        Clear DLQ
    </button>

</div>

{dlqJobs.length === 0 ? (

    <div className="bg-white rounded-xl shadow-md p-6 text-gray-500">

        No failed jobs.

    </div>

) : (

    dlqJobs.map((job) => (

        <DLQCard
            key={job.id}
            job={job}
            onRetry={handleRetry}
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