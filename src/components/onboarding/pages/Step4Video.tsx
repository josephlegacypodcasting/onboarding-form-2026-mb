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

const Req = () => <span className="text-destructive">*</span>;

const Step4Video = ({ form }: StepProps) => {
  return (
    <FormCard>
      <StepHeader
        title="Video Content"
        description="Video is your most powerful trust-building asset. Let's make sure we set it up right."
      />
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="camera_people"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Who will be the main person(s) in front of the camera? <Req />
              </FormLabel>
              <FormDescription>
                List names and titles. If multiple people, note how often each
                will appear.
              </FormDescription>
              <FormControl>
                <Textarea rows={3} placeholder="Names, titles, frequency" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="unique_expertise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What makes your expertise and perspective unique? <Req />
              </FormLabel>
              <FormDescription>
                Why should your ICP listen to you specifically?
              </FormDescription>
              <FormControl>
                <Textarea rows={3} placeholder="Your unique expertise" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="key_topics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What key topics would you like to discuss? <Req />
              </FormLabel>
              <FormDescription>
                List 5–10 themes, pain points, or subject areas you want to own
                in your content.
              </FormDescription>
              <FormControl>
                <Textarea rows={4} placeholder="Key topics" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="topics_to_avoid"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Are there any topics, competitors, or claims you want to avoid on
                camera?
              </FormLabel>
              <FormDescription>
                Guardrails help us protect your brand. Include anything
                sensitive, legally restricted, or off-brand.
              </FormDescription>
              <FormControl>
                <Textarea rows={3} placeholder="Topics to avoid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormCard>
  );
};

export default Step4Video;
