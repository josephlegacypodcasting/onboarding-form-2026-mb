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

const Step3Business = ({ form }: StepProps) => {
  return (
    <FormCard>
      <StepHeader
        title="Business Summary"
        description="Help us understand your business deeply so we can tell your story with clarity."
      />
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="icp_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Who is your Ideal Client Profile (ICP)? — ICP #1 <Req />
              </FormLabel>
              <FormDescription>
                Please describe your primary ICP segment.
              </FormDescription>
              <FormControl>
                <Textarea rows={3} placeholder="Describe ICP #1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icp_2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ICP #2 (if applicable)</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Describe ICP #2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="offer_icp_1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What do you offer your ICP? — Offer for ICP #1 <Req />
              </FormLabel>
              <FormDescription>
                Describe the core product or service you deliver.
              </FormDescription>
              <FormControl>
                <Textarea rows={3} placeholder="Offer for ICP #1" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="offer_icp_2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Offer for ICP #2 (if applicable)</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Offer for ICP #2" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="differentiator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What differentiates you from your competitors? <Req />
              </FormLabel>
              <FormDescription>
                What makes you the obvious choice over alternatives?
              </FormDescription>
              <FormControl>
                <Textarea rows={3} placeholder="Your differentiators" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="core_problem"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What core problem are you solving for your clients? <Req />
              </FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="The core problem" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sales_process"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What does your sales process look like after a lead shows
                interest? <Req />
              </FormLabel>
              <FormDescription>
                Walk us through the steps from first touch to closed deal.
              </FormDescription>
              <FormControl>
                <Textarea rows={4} placeholder="Your sales process" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormCard>
  );
};

export default Step3Business;
