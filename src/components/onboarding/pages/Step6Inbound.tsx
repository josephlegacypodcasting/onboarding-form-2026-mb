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

const Step6Inbound = ({ form }: StepProps) => {
  return (
    <FormCard>
      <StepHeader
        title="Inbound Marketing"
        description="We want to understand how you currently attract and convert interested prospects."
      />
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="traffic_destination"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Where are you currently driving traffic to get a prospect
                interested? <Req />
              </FormLabel>
              <FormDescription>
                Examples: website, landing page, booking link, social profile,
                etc.
              </FormDescription>
              <FormControl>
                <Textarea rows={3} placeholder="Traffic destinations" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lead_magnet"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What offer or "lead magnet" would you provide if you could snap
                your fingers? <Req />
              </FormLabel>
              <FormDescription>
                A lead magnet is anything of value you exchange for contact info
                — a form, quiz, download, white paper, free audit, template, etc.
              </FormDescription>
              <FormControl>
                <Textarea rows={3} placeholder="Your ideal lead magnet" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="existing_inbound_assets"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Do you have any existing inbound assets we should be aware of?
              </FormLabel>
              <FormDescription>
                Examples: existing landing pages, opt-in forms, free trials,
                webinars, or active funnels.
              </FormDescription>
              <FormControl>
                <Textarea rows={3} placeholder="Existing assets" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormCard>
  );
};

export default Step6Inbound;
