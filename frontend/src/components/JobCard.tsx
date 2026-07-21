import { useState } from "react";
import type { Job } from "../types/job";
import { updateJob } from "../services/job.service";
import { getJobLogs } from "../services/jobLog.service";
import type { JobLog } from "../types/jobLog";
import { showError, showSuccess } from "../utils/toast";
import ImageModal from "./ImageModal";

interface Props {
    job: Job;
    onDelete: (id: string) => void;
    onRefresh: () => void;
}
function getPriorityColor(priority: string) {
    switch (priority) {
        case "HIGH":
            return "bg-red-100 text-red-800";

        case "MEDIUM":
            return "bg-yellow-100 text-yellow-800";

        case "LOW":
            return "bg-green-100 text-green-800";

        default:
            return "bg-gray-100 text-gray-800";
    }
}

export default function JobCard({
    job,
    onDelete,
    onRefresh,
}: Props) {
    const [editing, setEditing] = useState(false);

    const [title, setTitle] = useState(job.title);
const [deleting,setDeleting]=useState(false);
    const [priority, setPriority] = useState(job.priority);
    
    const [delay, setDelay] = useState(
    String(job.delay / 1000)
);
    const [loading, setLoading] =
        useState(false);
        const [logs, setLogs] = useState<JobLog[]>([]);
const [showLogs, setShowLogs] = useState(false);
const [loadingLogs, setLoadingLogs] = useState(false);
const [previewImage, setPreviewImage] =
    useState<string | null>(null);
async function handleLogs() {
    if (showLogs) {
        setShowLogs(false);
        return;
    }

    setLoadingLogs(true);

    try {
        const result = await getJobLogs(job.id);
        setLogs(result.data);
        setShowLogs(true);
    } finally {
        setLoadingLogs(false);
    }
}
        

    async function handleSave() {
        try {
            setLoading(true);

            await updateJob(job.id, {
                title,
                priority,
                image: job.image,
                delay:
    delay === ""
        ? 0
        : Number(delay) * 1000,
            });

            setEditing(false);
            showSuccess("Job updated.");
            onRefresh();
        } catch (err) {
            console.log(err);
            showError("Update failed.");
        }
        finally {
            setLoading(false);
        }
    }

    function cancelEdit() {
        setTitle(job.title);
        setPriority(job.priority);
        setDelay(
    String(job.delay / 1000)
);
        setEditing(false);
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-5 mb-4">

            {editing ? (
                <>
                    <input
                        className="border rounded-lg w-full p-3 mb-3"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                    />
                    <select
    className="border rounded-lg w-full p-3 mb-3"
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
    <option value="LOW">Low Priority</option>
    <option value="MEDIUM">Medium Priority</option>
    <option value="HIGH">High Priority</option>
</select>
<input
    type="number"
    min={0}
    value={delay}
    placeholder="Delay (seconds)"
    className="border rounded-lg w-full p-3 mb-3"
    onChange={(e) =>
        setDelay(e.target.value)
    }
/>

                    <div className="flex gap-3">

                        <button
                            disabled={loading}
                            onClick={handleSave}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                            {loading
                                ? "Saving..."
                                : "💾 Save"}
                        </button>

                        <button
                            onClick={cancelEdit}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
                        >
                            ❌ Cancel
                        </button>

                    </div>
                </>
            ) : (
                <>
                    <h3 className="text-xl font-semibold">
                        {job.title}
                    </h3>
                    <img
   src={`http://127.0.0.1:5000/images/${job.image}`}
    alt={job.title}
    className="w-48 h-32 object-cover rounded-lg mt-4 border cursor-pointer hover:scale-105 transition"
    onClick={() =>
        setPreviewImage(
            `http://127.0.0.1:5000/images/${job.image}`
        )
    }
/>
{job.processedImage && (
    <>
        <p className="mt-4 font-semibold">
            Processed Image
        </p>

        <img
    src={`http://127.0.0.1:5000/processed-images/${job.processedImage}`}
    alt="Processed"
    className="w-48 h-32 object-cover rounded-lg mt-2 border border-green-500 cursor-pointer hover:scale-105 transition"
    onClick={() =>
        setPreviewImage(
            `http://127.0.0.1:5000/processed-images/${job.processedImage}`
        )
    }
/>
    </>
)}

                    <div className="mt-4 flex gap-3">

    <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${
            job.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : job.status === "RUNNING"
                ? "bg-blue-100 text-blue-800"
                : job.status === "COMPLETED"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
        }`}
    >
        {job.status}
    </span>

    <span
        className={`px-3 py-1 rounded-full text-sm font-semibold ${getPriorityColor(
            job.priority
        )}`}
    >
        {job.priority}
    </span>

</div>

<p className="text-sm text-gray-500 mt-3">
   Delay: {job.delay / 1000} seconds
</p>
<p className="text-sm text-gray-600 mt-2">
    <strong>Worker:</strong>{" "}
    {job.workerName || "Waiting..."}
</p>
<p className="text-sm text-gray-600">
    <strong>Stage:</strong>{" "}
    {job.processingStage}
</p>
<div className="mt-3">

    <div className="flex justify-between text-sm mb-1">

        <span>Progress</span>

        <span>{job.progress}%</span>

    </div>

    <div className="w-full bg-gray-200 rounded-full h-3">

        <div
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{
                width: `${job.progress}%`,
            }}
        />

    </div>

</div>

                    <div className="flex gap-3 mt-5">

                        <button
    disabled={job.status !== "PENDING"}
    onClick={() => setEditing(true)}
    className={`px-4 py-2 rounded-lg text-white ${
        job.status === "PENDING"
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-400 cursor-not-allowed"
    }`}
>
    ✏ Edit
</button>

                        <button
                        disabled={deleting || job.status==="RUNNING"}
    onClick={async function handleDeleteClick(){

setDeleting(true);

await onDelete(job.id);

setDeleting(false);

}}
    className={`px-4 py-2 rounded-lg text-white ${
        job.status === "RUNNING"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600"
    }`}
>
    🗑 {deleting?"Deleting...":"Delete"}
</button>
                        <button
    onClick={handleLogs}
    className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded-lg"
>
    {loadingLogs
        ? "Loading..."
        : showLogs
        ? "Hide Logs"
        : "View Logs"}
</button>
</div>

                        {showLogs && (
    <div className="mt-5 border-t pt-4">

        <h4 className="font-semibold mb-3">
            Execution Logs
        </h4>

        {logs.length === 0 ? (
            <p className="text-gray-500">
                No logs found.
            </p>
        ) : (
            logs.map((log) => (
                <div
                    key={log.id}
                    className="text-sm border-l-4 border-blue-500 pl-3 mb-3"
                >
                    <div>{log.message}</div>

                    <div className="text-gray-500 text-xs">
                        {new Date(
                            log.createdAt
                        ).toLocaleString()}
                    </div>
                </div>
            ))
        )}

    </div>
)}
{job.status !== "PENDING" && (
    <p className="text-sm text-gray-500 mt-2">
        Jobs can only be edited while pending.
    </p>
)}
{job.status === "RUNNING" && (
    <p className="text-sm text-orange-600 mt-1">
        Running jobs cannot be deleted until processing finishes.
    </p>
)}
                    
                </>
            )}
{previewImage && (
    <ImageModal
        image={previewImage}
        title={job.title}
        onClose={() =>
            setPreviewImage(null)
        }
    />
)}
        </div>
    );
}