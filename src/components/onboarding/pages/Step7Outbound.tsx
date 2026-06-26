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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  OnboardingFormData,
  testimonialsOptions,
  testimonialsLabels,
  caseStudiesOptions,
  caseStudiesLabels,
} from "@/types/onboardingForm";
import FormCard from "../../form/FormCard";
import StepHeader from "../StepHeader";

interface StepProps {
  form: UseFormReturn<OnboardingFormData>;
}

const Req = () => <span className="text-destructive">*</span>;

const Step7Outbound = ({ form }: StepProps) => {
  return (
    <FormCard>
      <StepHeader
        title="Outbound Marketing"
        description="Outbound success depends on precision. The more detail you give us here, the better we can target."
        important="We will go deeper on ICP for outbound in a follow-up session. This section is critical to booking quality sales calls."
      />
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="testimonials"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Do you have testimonials? <Req />
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-3 mt-2"
                >
                  {testimonialsOptions.map((opt) => (
                    <div key={opt} className="flex items-center space-x-3">
                      <RadioGroupItem value={opt} id={`test-${opt}`} />
                      <Label htmlFor={`test-${opt}`} className="font-normal cursor-pointer">
                        {testimonialsLabels[opt]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="case_studies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Do you have case studies? <Req />
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-3 mt-2"
                >
                  {caseStudiesOptions.map((opt) => (
                    <div key={opt} className="flex items-center space-x-3">
                      <RadioGroupItem value={opt} id={`case-${opt}`} />
                      <Label htmlFor={`case-${opt}`} className="font-normal cursor-pointer">
                        {caseStudiesLabels[opt]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_company_size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Expanding on your ICP — what size companies do you want to
                target? <Req />
              </FormLabel>
              <FormDescription>
                Examples: solopreneurs, 1–10 employees, 11–50 employees, 51–200
                employees, enterprise, etc.
              </FormDescription>
              <FormControl>
                <Textarea rows={2} placeholder="Target company sizes" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="decision_maker_titles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What are the titles of the decision-makers you want to reach?
                (Please list 3–4) <Req />
              </FormLabel>
              <FormDescription>
                Examples: CEO, VP of Marketing, Director of Operations, Founder,
                etc.
              </FormDescription>
              <FormControl>
                <Textarea rows={2} placeholder="Decision-maker titles" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="target_geography"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What geography or market are you targeting? <Req />
              </FormLabel>
              <FormDescription>
                Examples: local, statewide, national, specific verticals or
                industries, international.
              </FormDescription>
              <FormControl>
                <Textarea rows={2} placeholder="Target geography" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormCard>
  );
};

export default Step7Outbound;
