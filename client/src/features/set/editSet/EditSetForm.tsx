import { Save } from "lucide-react";

interface EditSetFormProps {
  name: string;
  sport: string;
  isUpdating: boolean;
  onNameChange: (name: string) => void;
  onSportChange: (sport: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function EditSetForm({
  name,
  sport,
  isUpdating,
  onNameChange,
  onSportChange,
  onSubmit,
}: EditSetFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Set Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder="Enter set name"
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
          disabled={isUpdating}
          required
        />
      </div>

      <div>
        <label
          htmlFor="sport"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Sport
        </label>
        <select
          id="sport"
          value={sport}
          onChange={(e) => onSportChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          disabled={isUpdating}
          required
        >
          <option value="">Select a sport</option>
          <option value="Basketball">Basketball</option>
          <option value="Football">Football</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isUpdating || !name.trim() || !sport.trim()}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isUpdating ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Updating...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Changes
          </>
        )}
      </button>
    </form>
  );
}
