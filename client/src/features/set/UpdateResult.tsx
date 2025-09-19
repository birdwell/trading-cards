import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface UpdateResultProps {
  result: {
    success: boolean;
    message: string;
  };
  setId: number;
}

export default function UpdateResult({ result, setId }: UpdateResultProps) {
  const router = useRouter();

  const handleBackToSet = () => {
    router.push(`/set/${setId}`);
  };

  return (
    <Card className={result.success ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" : "border-destructive/50 bg-destructive/10"}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {result.success ? (
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 text-destructive mt-0.5" />
          )}
          <div className="flex-1">
            <h3 className={`font-medium text-sm ${result.success ? "text-green-800 dark:text-green-200" : "text-destructive"}`}>
              {result.success ? "Update Successful!" : "Update Failed"}
            </h3>
            <p className={`mt-1 text-sm ${result.success ? "text-green-700 dark:text-green-300" : "text-destructive/80"}`}>
              {result.message}
            </p>
            {result.success && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToSet}
                className="mt-3 p-0 h-auto text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
              >
                Back to set
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
