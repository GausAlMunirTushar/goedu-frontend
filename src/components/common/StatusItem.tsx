"use client";

export default function StatusItem({ label, progress }: { label: string; progress: number }) {
    return (
        <div>
            <div className="flex justify-between mb-2">
                <span className="text-gray-700 font-medium">{label}</span>
                <span className="text-gray-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                    className="bg-linear-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
