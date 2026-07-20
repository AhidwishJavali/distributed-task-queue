interface Props {
    open: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function ConfirmationModal({
    open,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}: Props) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-[420px] p-6">

                <h2 className="text-2xl font-bold mb-3">
                    {title}
                </h2>

                <p className="text-gray-600 mb-6">
                    {message}
                </p>

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onCancel}
                        className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition text-white px-5 py-2 rounded-lg font-semibold"
                    >
                        {confirmText}
                    </button>

                </div>

            </div>

        </div>
    );
}