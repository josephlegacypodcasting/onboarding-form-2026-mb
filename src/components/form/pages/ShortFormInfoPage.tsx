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
import { ContentFormData } from "@/types/form";
import FormCard from "../FormCard";

interface ShortFormInfoPageProps {
  form: UseFormReturn<ContentFormData>;
}

const ShortFormInfoPage = ({
  form,
}: ShortFormInfoPageProps) => {
  return (
    <FormCard>
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-foreground">
          Short-Form Video Information
        </h2>

        <FormField
          control={form.control}
          name="shortform_podcast_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Podcast Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter podcast name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortform_episode_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Episode Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter episode name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortform_highlights"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Highlights (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List any specific moments or timestamps..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortform_files_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Share URL with Files (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://drive.google.com/... or https://dropbox.com/..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Share a link to your files (Google Drive, Dropbox, etc.)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortform_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="shortform_copy_to_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Send Copy To (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="another@email.com"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                We'll send a copy of your submission to this email
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormCard>
  );
};

export default ShortFormInfoPage;
