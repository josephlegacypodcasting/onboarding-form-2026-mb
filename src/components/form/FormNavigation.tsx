import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface FormNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  showPrevious: boolean;
  showNext: boolean;
  isSubmit?: boolean;
  isLoading?: boolean;
  nextDisabled?: boolean;
  buttonText?: string;
}

const FormNavigation = ({
  onPrevious,
  onNext,
  showPrevious,
  showNext,
  isLoading = false,
  nextDisabled = false,
  buttonText = "Next",
}: FormNavigationProps) => {
  return (
    <div className="flex justify-between items-center mt-8">
      <div>
        {showPrevious && (
          <Button
            type="button"
            variant="default"
            onClick={onPrevious}
            disabled={isLoading}
          >
            Previous
          </Button>
        )}
      </div>
      <div>
        {showNext && (
          <Button
            type="button"
            onClick={onNext}
            disabled={nextDisabled || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              buttonText
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormNavigation;
