import type { DLQJob } from "../types/dlq";
import { useState } from "react";
interface Props {
    job: DLQJob;
    onRetry(id: string): void;
    onDelete: (id: string) => void;
}

export default function DLQCard({
    job,
    onRetry,
    onDelete,
}: Props) {
    const [retrying,setRetrying]=useState(false);
const [deleting,setDeleting]=useState(false);
    return (
        <div className="bg-red-50 border border-red-300 rounded-xl shadow p-5 mb-4">

            <h3 className="text-xl font-bold">
                {job.title}
            </h3>

            <p>
                Priority:
                <strong> {job.priority}</strong>
            </p>

            <p className="text-red-600 mt-2">
                {job.error}
            </p>

            <p className="text-gray-500 text-sm mt-2">
                Failed:
                {" "}
                {new Date(
                    job.failedAt
                ).toLocaleString()}
            </p>

            <button
disabled={retrying}
onClick={async ()=>{

setRetrying(true);

await onRetry(job.id);

setRetrying(false);

}}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
                {
retrying
?
"Retrying..."
:
"Retry"
}
            </button>
            <button
    onClick={async () => {
        setDeleting(true);
        await onDelete(job.id);
        setDeleting(false);
    }}
    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
>
    {deleting ? "Deleting..." : "Delete"}
</button>

        </div>
    );
}