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

interface PodcastAdditionalPageProps {
  form: UseFormReturn<ContentFormData>;
}

const PodcastAdditionalPage = ({ form }: PodcastAdditionalPageProps) => {
  return (
    <FormCard>
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-foreground">
          Additional Questions
        </h2>

        <FormField
          control={form.control}
          name="additional_notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional information we should know..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border-t border-border pt-6">
          <h3 className="text-base font-medium text-foreground mb-4">
            Guest Information
          </h3>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="guest_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Guest Name <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter guest name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guest_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Guest Title <span className="text-destructive">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., CEO, Author, Expert" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="guest_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Guest Email (Optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="guest@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="copy_to_email"
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

export default PodcastAdditionalPage;
