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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ContentFormData } from "@/types/form";
import FormCard from "../FormCard";

interface ShortFormFilesPageProps {
  form: UseFormReturn<ContentFormData>;
}

const ShortFormFilesPage = ({ form }: ShortFormFilesPageProps) => {
  return (
    <FormCard>
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-foreground">
          Short-Form Video Files
        </h2>

        <FormField
          control={form.control}
          name="shortform_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Link to Short-Form Files{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please provide a shareable link that includes the actual audio/video recordings{" "}
                <br />
                (e.g., a Riverside recording link, Google Drive folder with recordings, or Dropbox link).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content_provision"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                How would you like to provide content?{" "}
                <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-3 mt-2"
                >
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="scripted" id="scripted" />
                    <Label htmlFor="scripted" className="font-normal cursor-pointer">
                      I'll provide scripted content
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="highlights" id="highlights" />
                    <Label htmlFor="highlights" className="font-normal cursor-pointer">
                      I'll provide highlights/timestamps
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="ai_generated" id="ai_generated" />
                    <Label htmlFor="ai_generated" className="font-normal cursor-pointer">
                      Use AI to generate clips
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

export default ShortFormFilesPage;
