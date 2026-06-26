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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  OnboardingFormData,
  blogStatusOptions,
  blogStatusLabels,
  newsletterStatusOptions,
  newsletterStatusLabels,
  brandVoiceOptions,
  brandVoiceLabels,
  type BrandVoice,
} from "@/types/onboardingForm";
import FormCard from "../../form/FormCard";
import StepHeader from "../StepHeader";

interface StepProps {
  form: UseFormReturn<OnboardingFormData>;
}

const Req = () => <span className="text-destructive">*</span>;

const Step5Socials = ({ form }: StepProps) => {
  const blogStatus = form.watch("has_blog");
  const newsletterStatus = form.watch("has_newsletter");

  return (
    <FormCard>
      <StepHeader
        title="Socials + Written Content"
        description="Let's take stock of where you are today and where the opportunity lies."
      />
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="top_social_channels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What are your top social channels today? <Req />
              </FormLabel>
              <FormDescription>
                List the platforms you are currently active on, even if
                inconsistently.
              </FormDescription>
              <FormControl>
                <Textarea rows={3} placeholder="Your top channels" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="missing_channels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Are there any channels you believe your ICP is on that you're not
                currently using? <Req />
              </FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Missing channels" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="has_blog"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Do you have a blog? <Req />
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-3 mt-2"
                >
                  {blogStatusOptions.map((opt) => (
                    <div key={opt} className="flex items-center space-x-3">
                      <RadioGroupItem value={opt} id={`blog-${opt}`} />
                      <Label htmlFor={`blog-${opt}`} className="font-normal cursor-pointer">
                        {blogStatusLabels[opt]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {blogStatus === "yes" && (
          <FormField
            control={form.control}
            name="blog_link"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Blog link <Req />
                </FormLabel>
                <FormControl>
                  <Input placeholder="https://yourblog.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="has_newsletter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Do you have a newsletter? <Req />
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-3 mt-2"
                >
                  {newsletterStatusOptions.map((opt) => (
                    <div key={opt} className="flex items-center space-x-3">
                      <RadioGroupItem value={opt} id={`news-${opt}`} />
                      <Label htmlFor={`news-${opt}`} className="font-normal cursor-pointer">
                        {newsletterStatusLabels[opt]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {newsletterStatus === "yes" && (
          <FormField
            control={form.control}
            name="newsletter_details"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Platform and list size <Req />
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Mailchimp, 5,000 subscribers" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="brand_voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                How would you describe your brand voice and tone? <Req />
              </FormLabel>
              <FormDescription>
                Select all that apply, or describe in your own words below.
              </FormDescription>
              <div className="space-y-3 mt-2">
                {brandVoiceOptions.map((opt) => {
                  const checked = (field.value ?? []).includes(opt);
                  return (
                    <div key={opt} className="flex items-center space-x-3">
                      <Checkbox
                        id={`voice-${opt}`}
                        checked={checked}
                        onCheckedChange={(value) => {
                          const current = (field.value ?? []) as BrandVoice[];
                          if (value) {
                            field.onChange([...current, opt]);
                          } else {
                            field.onChange(current.filter((v) => v !== opt));
                          }
                        }}
                      />
                      <Label htmlFor={`voice-${opt}`} className="font-normal cursor-pointer">
                        {brandVoiceLabels[opt]}
                      </Label>
                    </div>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="brand_voice_other"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Other (describe in your own words)</FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="Describe your voice and tone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormCard>
  );
};

export default Step5Socials;
