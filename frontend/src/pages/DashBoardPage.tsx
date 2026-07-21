import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import JobCard from "../components/JobCard";
import { getStatistics } from "../services/job.service";
import type { JobStatistics } from "../types/statistics";
import ConfirmationModal from "../components/ConfirmationModal";

import {
    showSuccess,
    showError,
} from "../utils/toast";
import {
    getJobs,
    createJob,
    deleteJob,
    deleteAllJobs,
} from "../services/job.service";
import DLQCard from "../components/DLQCard";

import type { DLQJob } from "../types/dlq";

import {
    getDLQJobs,
    retryDLQJob,
    clearDLQ,
    deleteDLQJob,
} from "../services/dlq.service";

import type { Job } from "../types/job";



export default function DashboardPage() {
    
    const [jobs, setJobs] = useState<Job[]>([]);
    const [clearingDLQ,setClearingDLQ]=useState(false);
    const [statistics, setStatistics] =
    useState<JobStatistics>({
        total: 0,
        pending: 0,
        running: 0,
        completed: 0,
        failed: 0,
    });
    const [dlqJobs, setDLQJobs] =
    useState<DLQJob[]>([]);
    const [search, setSearch] = useState("");
const [debouncedSearch,setDebouncedSearch]=useState(search);
const [statusFilter, setStatusFilter] =
    useState("");

const [priorityFilter, setPriorityFilter] =
    useState("");
    const [confirmOpen, setConfirmOpen] = useState(false);

const [confirmTitle, setConfirmTitle] = useState("");
const [deletingAll,setDeletingAll]=useState(false);
const [confirmMessage, setConfirmMessage] = useState("");

const [confirmAction, setConfirmAction] =
    useState<() => void>(() => {});

const [sort, setSort] = useState("newest");
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
        const [priority, setPriority] = useState<
    "LOW" | "MEDIUM" | "HIGH"
>("MEDIUM");
const [pageLoading, setPageLoading] = useState(true);
const [delay, setDelay] = useState("");
const [image, setImage] = useState("mountain.jpg");
function openConfirm(
    title: string,
    message: string,
    action: () => void
) {
    setConfirmTitle(title);

    setConfirmMessage(message);

    setConfirmAction(() => action);

    setConfirmOpen(true);
}
    async function clearDLQConfirmed(){

setClearingDLQ(true);

try{

await clearDLQ();

showSuccess("Dead Letter Queue cleared.");

await loadDLQ();

}
catch{

showError("Unable to clear DLQ.");

}
finally{

setClearingDLQ(false);

}

}

function handleClearDLQ() {

    openConfirm(
        "Clear Dead Letter Queue",
        "Remove every failed job from the DLQ?",
        () => {
            void clearDLQConfirmed();
        }
    );

}

    async function loadJobs() {
    try {
        const result = await getJobs({
            search:
                debouncedSearch || undefined,

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

async function loadStatistics() {
    try {
        const result =
            await getStatistics();
        
        setStatistics(result.data);
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

    try{
        await retryDLQJob(id);
        showSuccess("Job sent back to queue.");
        await loadDLQ();

        await loadJobs();
        await loadStatistics();
    } catch (err) {
        console.log(err);
        showError("Retry Failed");
    }

}
async function deleteDLQConfirmed(id: string) {

    try {

        await deleteDLQJob(id);

        showSuccess("Failed job removed.");

        await loadDLQ();

    } catch {

        showError("Unable to delete.");

    }

}

function handleDeleteDLQ(id: string) {

    openConfirm(
        "Delete Failed Job",
        "Delete this failed job from the Dead Letter Queue?",
        () => {
            void deleteDLQConfirmed(id);
        }
    );

}
useEffect(()=>{

const timer=setTimeout(()=>{

setDebouncedSearch(search);

},500);

return ()=>clearTimeout(timer);

},[search]);

    useEffect(() => {
    const fetchJobs = async () => {
        setPageLoading(true);
        await Promise.all([
    loadJobs(),
    loadDLQ(),
    loadStatistics(),
]);
setPageLoading(false);
    };

    fetchJobs();
    

    const interval = setInterval(() => {
        void loadJobs();
void loadDLQ();
void loadStatistics();
    }, 3000);
    
    return () => {
    clearInterval(interval);

};

},  [
    debouncedSearch,
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
            priority,
            delay:
                delay === ""
                    ? 0
                    : Number(delay) * 1000,
            image,
        });

        showSuccess("Job created successfully.");

        setTitle("");
        setPriority("MEDIUM");
        setDelay("");
        setImage("mountain.jpg");

        await loadJobs();
    } catch {
        showError("Failed to create job.");
    } finally {
        setLoading(false);
    }
}

    async function deleteJobConfirmed(id: string) {
    try {
        await deleteJob(id);

        showSuccess("Job deleted.");

        await loadJobs();
        await loadStatistics();

    } catch {

        showError("Unable to delete job.");

    }
}

function handleDelete(id: string) {

    openConfirm(
        "Delete Job",
        "Are you sure you want to delete this job?",
        () => {
            void deleteJobConfirmed(id);
        }
    );

}
async function deleteAllConfirmed() {
setDeletingAll(true);
    try {

        await deleteAllJobs();

        showSuccess("Jobs deleted.");

        await loadJobs();
        await loadStatistics();

    } catch {

        showError("Failed to delete jobs.");

    }
finally{

setDeletingAll(false);

}
}

function handleDeleteAll() {

    openConfirm(
        "Delete All Jobs",
        "This will permanently delete all jobs. Continue?",
        () => {
            void deleteAllConfirmed();
        }
    );

}
 
if (pageLoading) {
    return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="text-xl font-semibold animate-pulse">
                Loading Dashboard...
            </div>
        </div>
    );
}
    return (
        <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-5xl mx-auto">
            <div className="flex justify-between items-center bg-white rounded-xl shadow-md p-6 mb-8">

    <div>
        <h1 className="text-3xl font-bold">
            Welcome User
        </h1>

        <p className="text-gray-600">
            Distributed Task Queue Dashboard
        </p>

    </div>

</div>



            <hr />
            <div className="bg-white rounded-xl shadow-md p-6 my-6">

    <h2 className="text-2xl font-semibold mb-5">
        Search & Filter
    </h2>

    <div className="flex gap-2 mb-5">

    <input
    disabled={loading}
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
        disabled={loading}
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
        disabled={loading}
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
        disabled={loading}
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

<div className="grid grid-cols-5 gap-4 mb-8">

    <div className="bg-white rounded-xl shadow-md p-5 text-center">
        <p className="text-gray-500 text-sm">
            Total Jobs
        </p>

        <h2 className="text-3xl font-bold">
            {statistics.total}
        </h2>
    </div>

    <div className="bg-yellow-50 rounded-xl shadow-md p-5 text-center">
        <p className="text-yellow-700 text-sm">
            Pending
        </p>

        <h2 className="text-3xl font-bold text-yellow-700">
            {statistics.pending}
        </h2>
    </div>

    <div className="bg-blue-50 rounded-xl shadow-md p-5 text-center">
        <p className="text-blue-700 text-sm">
            Running
        </p>

        <h2 className="text-3xl font-bold text-blue-700">
            {statistics.running}
        </h2>
    </div>

    <div className="bg-green-50 rounded-xl shadow-md p-5 text-center">
        <p className="text-green-700 text-sm">
            Completed
        </p>

        <h2 className="text-3xl font-bold text-green-700">
            {statistics.completed}
        </h2>
    </div>

    <div className="bg-red-50 rounded-xl shadow-md p-5 text-center">
        <p className="text-red-700 text-sm">
            Failed
        </p>

        <h2 className="text-3xl font-bold text-red-700">
            {statistics.failed}
        </h2>
    </div>

</div>

            <form
    onSubmit={handleCreate}
    className="bg-white rounded-xl shadow-md p-6 mb-8"
>

    <h2 className="text-2xl font-semibold mb-4">
        Create Job
    </h2>

    <input
    disabled={loading}
        className="border rounded-lg w-full p-3 mb-4"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
    />

    <label className="block mb-2 font-semibold">
    Select Image
</label>
    <select
    disabled={loading}
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
    disabled={loading}
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
disabled={loading}
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
    All Jobs
</h2>

    <div className="flex gap-3">

        <span className="bg-gray-200 px-4 py-2 rounded-lg font-semibold">
            Total: {jobs.length}
        </span>

        <button
        disabled={deletingAll}
            onClick={handleDeleteAll}
            className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-lg"
        >
            {
deletingAll
?
"Deleting..."
:
"Delete All Jobs"
}
        </button>

    </div>

</div>

            
            {jobs.length === 0 ? (

    <div className="bg-white rounded-xl shadow-md p-10 text-center">

<h3 className="text-xl font-semibold">
No Jobs Found
</h3>

<p className="text-gray-500 mt-2">
Create a new job to start processing.
</p>

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
<hr className="my-10" />

<div className="flex justify-between items-center mb-6">

    <h2 className="text-3xl font-bold">
        Dead Letter Queue
    </h2>

    <button
    disabled={clearingDLQ}
        onClick={handleClearDLQ}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
    >
        {
clearingDLQ
?
"Clearing..."
:
"Clear DLQ"
}
    </button>

</div>

{dlqJobs.length === 0 ? (

    <div className="bg-white rounded-xl shadow-md p-6 text-gray-500">

        <h3>No Failed Jobs 🎉</h3>

<p>
Everything is running smoothly.
</p>

    </div>

) : (

    dlqJobs.map((job) => (

        <DLQCard
            key={job.id}
            job={job}
            onRetry={handleRetry}
            onDelete={handleDeleteDLQ}
        />

    ))

)}
        </div>
        <footer className="text-center text-gray-500 mt-10 mb-5">

    Distributed Task Queue

    <br />

    Built with React • Express • BullMQ • Redis • PostgreSQL

</footer>
<ConfirmationModal
    open={confirmOpen}
    title={confirmTitle}
    message={confirmMessage}
    onCancel={() => setConfirmOpen(false)}
    onConfirm={() => {
        confirmAction();
        setConfirmOpen(false);
    }}
/>
        </div>
        
    );
}