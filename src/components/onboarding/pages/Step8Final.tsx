import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingFormData } from "@/types/onboardingForm";
import FormCard from "../../form/FormCard";
import StepHeader from "../StepHeader";

interface StepProps {
  form: UseFormReturn<OnboardingFormData>;
}

const checklistItems = [
  "Logo files (PNG and SVG preferred)",
  "Brand guidelines or style guide (if available)",
  "Headshots of anyone appearing on camera",
  "Login credentials for social accounts (or admin access)",
  "Testimonials or client quotes",
  "Case study materials or client results",
  "Any existing content you'd like us to reference or repurpose",
];

const nextSteps = [
  "We review your responses and prepare for your Kick-Off Call.",
  "Your Kick-Off Call is scheduled, we align on goals, timeline, and deliverables.",
  "We get to work. Your first deliverables are on their way.",
];

const Step8Final = ({ form }: StepProps) => {
  return (
    <FormCard>
      <StepHeader
        title="Final Steps"
        description="You're almost done. Here's what happens next."
      />
      <div className="space-y-8">
        <div>
          <h3 className="text-base font-medium text-foreground mb-3">
            What's Next
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
            {nextSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className="text-base font-medium text-foreground mb-3">
            Asset Request Checklist
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Here are a few of the things we will be gathering in the next few
            weeks:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
            {checklistItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <FormField
          control={form.control}
          name="additional_info"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Is there anything else we should know before we get started?
              </FormLabel>
              <FormDescription>
                This is your open field — anything not covered above belongs here.
              </FormDescription>
              <FormControl>
                <Textarea rows={4} placeholder="Anything else?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <p className="text-xs text-muted-foreground italic">
          By submitting this form, you confirm that the information provided is
          accurate and complete to the best of your knowledge.
        </p>
        <p className="text-sm font-medium text-foreground">
          We're excited to get started. Welcome to Market Better.
        </p>
      </div>
    </FormCard>
  );
};

export default Step8Final;
