import type { User } from "../types/user";

interface Props {
    user: User;
    onDelete: (id: string) => void;
    onViewJobs: (id: string) => void;
}

export default function UserCard({
    user,
    onDelete,
    onViewJobs,
}: Props) {
    return (
        <div className="bg-white rounded-xl shadow-md p-5 mb-4">

            <div className="flex justify-between items-center">

                <div>

                    <h3 className="text-xl font-semibold">
                        {user.name}
                    </h3>

                    <p className="text-gray-600">
                        {user.email}
                    </p>

                    <span className="inline-block mt-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {user.role}
                    </span>

                </div>

                <div className="text-right">

                    <p className="font-semibold">
                        Jobs: {user._count.jobs}
                    </p>

                </div>

            </div>

            <div className="flex gap-3 mt-5">

                <button
                    onClick={() => onViewJobs(user.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    👁 View Jobs
                </button>

                <button
    disabled={user.role === "ADMIN"}
    onClick={() => onDelete(user.id)}
    className={`px-4 py-2 rounded-lg text-white ${
        user.role === "ADMIN"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600"
    }`}
>
    🗑 Delete User
</button>

            </div>

        </div>
    );
}