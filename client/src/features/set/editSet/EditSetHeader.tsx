import { Edit3, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    <div className="mb-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={handleBackToSet}
        className="gap-2 mb-4 px-0 text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Set
      </Button>

      {/* Header Content */}
      <div className="flex items-center gap-3 mb-6">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-full">
          <Edit3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-1">
            Edit Set
          </h1>
          {setName && (
            <p className="text-muted-foreground">
              {setName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
