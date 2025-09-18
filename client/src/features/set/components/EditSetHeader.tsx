import { Edit3 } from "lucide-react";

export default function EditSetHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
        <Edit3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
        Edit Set
      </h1>
      <p className="text-gray-600 dark:text-gray-300">
        Update the name and sport for this trading card set
      </p>
    </div>
  );
}
