import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { OnboardingFormData } from "@/types/onboardingForm";
import FormCard from "../../form/FormCard";
import StepHeader from "../StepHeader";

interface StepProps {
  form: UseFormReturn<OnboardingFormData>;
}

const Req = () => <span className="text-destructive">*</span>;

const Step1Company = ({ form }: StepProps) => {
  return (
    <FormCard>
      <StepHeader
        title="Company Info"
        description="Thanks for joining us! Please fill out the form to help us make your onboarding as productive as possible."
      />
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <Req />
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Name <Req />
              </FormLabel>
              <FormControl>
                <Input placeholder="Your full name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Phone Number <Req />
              </FormLabel>
              <FormControl>
                <Input type="tel" placeholder="+1 (555) 000-0000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Address <Req />
              </FormLabel>
              <FormControl>
                <Input placeholder="Street, city, state, ZIP, country" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Link to Company Website <Req />
              </FormLabel>
              <FormControl>
                <Input type="url" placeholder="https://yourcompany.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="social_links"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Social Links <Req />
              </FormLabel>
              <FormDescription>
                Please include links to all active profiles (LinkedIn,
                Instagram, Facebook, etc.)
              </FormDescription>
              <FormControl>
                <Textarea
                  rows={4}
                  placeholder="https://linkedin.com/company/...&#10;https://instagram.com/..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormCard>
  );
};

export default Step1Company;
