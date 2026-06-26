import { z } from "zod";

// ---------- Option values + descriptive labels (sent to webhook) ----------

export const paymentMethodOptions = ["credit_card", "ach"] as const;
export type PaymentMethod = (typeof paymentMethodOptions)[number];
export const paymentMethodLabels: Record<PaymentMethod, string> = {
  credit_card: "Credit Card",
  ach: "ACH / Bank Transfer",
};

export const blogStatusOptions = ["yes", "no", "inactive"] as const;
export type BlogStatus = (typeof blogStatusOptions)[number];
export const blogStatusLabels: Record<BlogStatus, string> = {
  yes: "Yes",
  no: "No",
  inactive: "We had one but it is inactive",
};

export const newsletterStatusOptions = ["yes", "no"] as const;
export type NewsletterStatus = (typeof newsletterStatusOptions)[number];
export const newsletterStatusLabels: Record<NewsletterStatus, string> = {
  yes: "Yes",
  no: "No",
};

export const testimonialsOptions = ["yes", "no", "informal"] as const;
export type TestimonialsStatus = (typeof testimonialsOptions)[number];
export const testimonialsLabels: Record<TestimonialsStatus, string> = {
  yes: "Yes — we will request them shortly",
  no: "No",
  informal: "We have some but they are informal",
};

export const caseStudiesOptions = ["yes", "no", "informal"] as const;
export type CaseStudiesStatus = (typeof caseStudiesOptions)[number];
export const caseStudiesLabels: Record<CaseStudiesStatus, string> = {
  yes: "Yes — we will request them shortly",
  no: "No",
  informal: "We have results but no formal case studies yet",
};

export const brandVoiceOptions = [
  "authoritative",
  "conversational",
  "educational",
  "entertaining",
] as const;
export type BrandVoice = (typeof brandVoiceOptions)[number];
export const brandVoiceLabels: Record<BrandVoice, string> = {
  authoritative: "Authoritative / Expert",
  conversational: "Conversational / Approachable",
  educational: "Educational / Informative",
  entertaining: "Entertaining / Energetic",
};

// ---------- Helpers ----------

// Lenient URL validation: accepts site.com, www.site.com, http(s)://site.com, etc.
// Does not require a protocol so users can type domains naturally.
const flexibleUrl = (message = "Please enter a valid URL") =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine(
      (value) =>
        /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(value.trim()),
      { message }
    );

// ---------- Schema ----------

export const onboardingSchema = z
  .object({
    // Step 1 — Company Info
    email: z.string().email("Please enter a valid email address"),
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().min(1, "Address is required"),
    website: z.string().url("Please enter a valid URL"),
    social_links: z.string().min(1, "Please add at least one social link"),

    // Step 2 — Invoicing
    invoice_emails: z.string().min(1, "Please add at least one email"),
    legal_name: z.string().min(1, "Full legal name is required"),
    billing_email: z.string().email("Please enter a valid email address"),
    billing_company_name: z.string().optional().or(z.literal("")),
    billing_address: z.string().min(1, "Billing address is required"),
    payment_method: z.enum(paymentMethodOptions, {
      required_error: "Please select a payment method",
    }),

    // Step 3 — Business Summary
    icp_1: z.string().min(1, "Please describe your primary ICP"),
    icp_2: z.string().optional().or(z.literal("")),
    offer_icp_1: z.string().min(1, "Please describe your offer"),
    offer_icp_2: z.string().optional().or(z.literal("")),
    differentiator: z.string().min(1, "This field is required"),
    core_problem: z.string().min(1, "This field is required"),
    sales_process: z.string().min(1, "This field is required"),

    // Step 4 — Video Content
    camera_people: z.string().min(1, "This field is required"),
    unique_expertise: z.string().min(1, "This field is required"),
    key_topics: z.string().min(1, "This field is required"),
    topics_to_avoid: z.string().optional().or(z.literal("")),

    // Step 5 — Socials + Written Content
    top_social_channels: z.string().min(1, "This field is required"),
    missing_channels: z.string().min(1, "This field is required"),
    has_blog: z.enum(blogStatusOptions, {
      required_error: "Please select an option",
    }),
    blog_link: z.string().optional().or(z.literal("")),
    has_newsletter: z.enum(newsletterStatusOptions, {
      required_error: "Please select an option",
    }),
    newsletter_details: z.string().optional().or(z.literal("")),
    brand_voice: z.array(z.enum(brandVoiceOptions)).optional().default([]),
    brand_voice_other: z.string().optional().or(z.literal("")),

    // Step 6 — Inbound Marketing
    traffic_destination: z.string().min(1, "This field is required"),
    lead_magnet: z.string().min(1, "This field is required"),
    existing_inbound_assets: z.string().optional().or(z.literal("")),

    // Step 7 — Outbound Marketing
    testimonials: z.enum(testimonialsOptions, {
      required_error: "Please select an option",
    }),
    case_studies: z.enum(caseStudiesOptions, {
      required_error: "Please select an option",
    }),
    target_company_size: z.string().min(1, "This field is required"),
    decision_maker_titles: z.string().min(1, "This field is required"),
    target_geography: z.string().min(1, "This field is required"),

    // Step 8 — Final Steps
    additional_info: z.string().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.has_blog === "yes" && !data.blog_link?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please add the link to your blog",
        path: ["blog_link"],
      });
    }
    if (data.has_newsletter === "yes" && !data.newsletter_details?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please add the platform and list size",
        path: ["newsletter_details"],
      });
    }
    const hasVoice = (data.brand_voice?.length ?? 0) > 0;
    if (!hasVoice && !data.brand_voice_other?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select at least one option or describe your voice",
        path: ["brand_voice"],
      });
    }
  });

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
