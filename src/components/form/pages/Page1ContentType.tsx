import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ContentFormData } from "@/types/form";
import FormCard from "../FormCard";

interface Page1ContentTypeProps {
  form: UseFormReturn<ContentFormData>;
}

const Page1ContentType = ({ form }: Page1ContentTypeProps) => {
  return (
    <FormCard>
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  {...field}
                />
              </FormControl>
              <p className="text-sm text-foreground mt-3">
                The name, email, and photo associated with your Google account will be recorded when you upload files and submit this form.
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                What are you uploading?
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-3 mt-2"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="podcast" id="podcast" />
                    <Label htmlFor="podcast" className="font-normal cursor-pointer">
                      Audio or Video Podcast
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="shortform" id="shortform" />
                    <Label htmlFor="shortform" className="font-normal cursor-pointer">
                      Short-Form Video Content
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both" className="font-normal cursor-pointer">
                      Both
                    </Label>
                  </div>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormCard>
  );
};

export default Page1ContentType;
