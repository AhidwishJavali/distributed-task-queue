interface Props {
    image: string;
    title: string;
    onClose: () => void;
}

export default function ImageModal({
    image,
    title,
    onClose,
}: Props) {
    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div
                className="relative max-w-5xl max-h-[90vh] p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-0 right-0 bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 text-xl"
                >
                    ×
                </button>

                <img
                    src={image}
                    alt={title}
                    className="max-h-[85vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
                />
            </div>
        </div>
    );
}