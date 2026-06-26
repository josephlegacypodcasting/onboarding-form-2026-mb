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

interface PodcastFilesPageProps {
  form: UseFormReturn<ContentFormData>;
}

const PodcastFilesPage = ({ form }: PodcastFilesPageProps) => {
  return (
    <FormCard>
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-foreground">
          Audio & Video Files
        </h2>

        <FormField
          control={form.control}
          name="audio_video_link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Link to Audio & Video Files{" "}
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
                Please paste a shareable link that includes the actual audio/video recordings (for example, a Riverside recording link, Google Drive folder, or Dropbox link)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="highlights"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Highlights (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List any specific moments or timestamps you'd like highlighted..."
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Include timestamps and descriptions of key moments
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormCard>
  );
};

export default PodcastFilesPage;
