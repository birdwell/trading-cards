import { Edit3, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface EditSetHeaderProps {
  setId: number;
  setName?: string;
}

export default function EditSetHeader({ setId, setName }: EditSetHeaderProps) {
  const router = useRouter();

  const handleBackToSet = () => {
    router.push(`/set/${setId}`);
  };

  return (
    <div className="mb-8">
      {/* Back Button */}
      <button
        onClick={handleBackToSet}
        className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Header Content */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-4">
          <Edit3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Edit Set
        </h1>
        {setName && (
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            {setName}
          </p>
        )}
      </div>
    </div>
  );
}
