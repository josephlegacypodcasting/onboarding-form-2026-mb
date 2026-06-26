import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ContentFormData } from "@/types/form";
import FormCard from "../FormCard";

interface PodcastInfoPageProps {
  form: UseFormReturn<ContentFormData>;
}

const PodcastInfoPage = ({ form }: PodcastInfoPageProps) => {
  return (
    <FormCard>
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-foreground">
          Podcast Information
        </h2>

        <FormField
          control={form.control}
          name="podcast_name"
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
          name="episode_name"
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
          name="episode_release_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Episode Release Date <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormCard>
  );
};

export default PodcastInfoPage;
