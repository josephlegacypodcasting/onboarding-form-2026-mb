import { z } from "zod";

export const contentTypeOptions = ["podcast", "shortform", "both"] as const;
export type ContentType = (typeof contentTypeOptions)[number];

export const contentTypeLabels: Record<ContentType, string> = {
  podcast: "Audio or Video Podcast",
  shortform: "Short-Form Video Content",
  both: "Both",
};

export const contentProvisionOptions = [
  "scripted",
  "highlights",
  "ai_generated",
] as const;
export type ContentProvision = (typeof contentProvisionOptions)[number];

export const contentProvisionLabels: Record<ContentProvision, string> = {
  scripted: "I'll provide scripted content",
  highlights: "I'll provide highlights/timestamps",
  ai_generated: "Use AI to generate clips",
};

export const formSchema = z.object({
  // Page 1
  email: z.string().email("Please enter a valid email address"),
  content_type: z.enum(contentTypeOptions, {
    required_error: "Please select a content type",
  }),

  // Podcast fields (Flow A & C)
  audio_video_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  highlights: z.string().optional(),
  podcast_name: z.string().optional(),
  episode_name: z.string().optional(),
  episode_release_date: z.string().optional(),
  additional_notes: z.string().optional(),
  guest_name: z.string().optional(),
  guest_title: z.string().optional(),
  guest_email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  copy_to_email: z.string().email("Please enter a valid email").optional().or(z.literal("")),

  // Short-form fields (Flow B & C)
  shortform_link: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  content_provision: z.enum(contentProvisionOptions).optional(),
  shortform_podcast_name: z.string().optional(),
  shortform_episode_name: z.string().optional(),
  shortform_highlights: z.string().optional(),
  shortform_files_url: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  shortform_notes: z.string().optional(),
  shortform_copy_to_email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  
  // Hidden field for flow tracking
  upload_type: z.string().optional(),
});

export type ContentFormData = z.infer<typeof formSchema>;

export interface UploadedFile {
  name: string;
  size: number;
  url?: string;
  file?: File;
}
