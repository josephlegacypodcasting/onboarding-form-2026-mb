import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormCard from "./FormCard";

interface SuccessScreenProps {
  onReset: () => void;
}

const SuccessScreen = ({ onReset }: SuccessScreenProps) => {
  return (
    <FormCard>
      <div className="text-center py-8">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-primary" />
        </div>
        <h2 className="text-2xl font-medium text-foreground mb-4">
          Submission Received!
        </h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          Thank you for taking the time to complete the onboarding form. We appreciate your effort and cooperation, as it helps us better understand your needs and ensures everything is set up smoothly. We look forward to moving forward with this new request.
        </p>
        <Button onClick={onReset}>Submit Another Form</Button>
      </div>
    </FormCard>
  );
};

export default SuccessScreen;
