import type { DLQJob } from "../types/dlq";

interface Props {
    job: DLQJob;
    onRetry(id: string): void;
}

export default function DLQCard({
    job,
    onRetry,
}: Props) {
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
                onClick={() => onRetry(job.id)}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
                Retry
            </button>

        </div>
    );
}