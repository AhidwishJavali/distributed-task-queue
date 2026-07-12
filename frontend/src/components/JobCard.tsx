import { useState } from "react";
import type { Job } from "../types/job";
import { updateJob } from "../services/job.service";

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

    const [description, setDescription] =
        useState(job.description);
    const [priority, setPriority] = useState(job.priority);
    
    const [delay, setDelay] = useState(
    String(job.delay / 1000)
);
    const [loading, setLoading] =
        useState(false);

    async function handleSave() {
        try {
            setLoading(true);

            await updateJob(job.id, {
                title,
                description,
                priority,
                delay:
    delay === ""
        ? 0
        : Number(delay) * 1000,
            });

            setEditing(false);

            onRefresh();
        } finally {
            setLoading(false);
        }
    }

    function cancelEdit() {
        setTitle(job.title);
        setDescription(job.description);
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

                    <textarea
                        className="border rounded-lg w-full p-3 mb-3"
                        rows={3}
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
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

                    <p className="text-gray-600 mt-2">
                        {job.description}
                    </p>

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
                            onClick={() =>
                                onDelete(job.id)
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                        >
                            🗑 Delete
                        </button>
{job.status !== "PENDING" && (
    <p className="text-sm text-gray-500 mt-2">
        Jobs can only be edited while pending.
    </p>
)}
                    </div>
                </>
            )}

        </div>
    );
}