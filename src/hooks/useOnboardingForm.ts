import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  onboardingSchema,
  type OnboardingFormData,
  paymentMethodLabels,
  blogStatusLabels,
  newsletterStatusLabels,
  testimonialsLabels,
  caseStudiesLabels,
  brandVoiceLabels,
  type BrandVoice,
} from "@/types/onboardingForm";
import { useToast } from "@/hooks/use-toast";

const SUBMIT_FORM_URL = `${
  import.meta.env.VITE_SUPABASE_URL || ""
}/functions/v1/submit-form`;

const SUBMIT_FORM_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";

async function submitFormPayload(payload: Record<string, unknown>) {
  const response = await fetch(SUBMIT_FORM_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUBMIT_FORM_KEY,
      Authorization: `Bearer ${SUBMIT_FORM_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok || !result?.success) {
    throw new Error(
      result?.error || result?.message || "Failed to submit form"
    );
  }

  return result;
}

export const TOTAL_STEPS = 8;

// Fields validated when leaving each step.
const STEP_FIELDS: Record<number, (keyof OnboardingFormData)[]> = {
  1: ["email", "name", "phone", "address", "website", "social_links"],
  2: [
    "invoice_emails",
    "legal_name",
    "billing_email",
    "billing_address",
    "payment_method",
  ],
  3: [
    "icp_1",
    "offer_icp_1",
    "differentiator",
    "core_problem",
    "sales_process",
  ],
  4: ["camera_people", "unique_expertise", "key_topics"],
  5: [
    "top_social_channels",
    "missing_channels",
    "has_blog",
    "blog_link",
    "has_newsletter",
    "newsletter_details",
    "brand_voice",
    "brand_voice_other",
  ],
  6: ["traffic_destination", "lead_magnet"],
  7: [
    "testimonials",
    "case_studies",
    "target_company_size",
    "decision_maker_titles",
    "target_geography",
  ],
  8: [],
};

export const useOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      email: "",
      name: "",
      phone: "",
      address: "",
      website: "",
      social_links: "",
      invoice_emails: "",
      legal_name: "",
      billing_email: "",
      billing_company_name: "",
      billing_address: "",
      payment_method: undefined,
      icp_1: "",
      icp_2: "",
      offer_icp_1: "",
      offer_icp_2: "",
      differentiator: "",
      core_problem: "",
      sales_process: "",
      camera_people: "",
      unique_expertise: "",
      key_topics: "",
      topics_to_avoid: "",
      top_social_channels: "",
      missing_channels: "",
      has_blog: undefined,
      blog_link: "",
      has_newsletter: undefined,
      newsletter_details: "",
      brand_voice: [],
      brand_voice_other: "",
      traffic_destination: "",
      lead_magnet: "",
      existing_inbound_assets: "",
      testimonials: undefined,
      case_studies: undefined,
      target_company_size: "",
      decision_maker_titles: "",
      target_geography: "",
      additional_info: "",
    },
    mode: "onChange",
  });

  const validateCurrentStep = useCallback(async () => {
    const fields = STEP_FIELDS[currentStep] ?? [];
    if (fields.length === 0) return true;
    return form.trigger(fields);
  }, [currentStep, form]);

  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [validateCurrentStep, currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleSubmit = useCallback(
    async (data: OnboardingFormData) => {
      setIsSubmitting(true);

      try {
        const payload = {
          ...data,
          payment_method: paymentMethodLabels[data.payment_method],
          has_blog: blogStatusLabels[data.has_blog],
          has_newsletter: newsletterStatusLabels[data.has_newsletter],
          testimonials: testimonialsLabels[data.testimonials],
          case_studies: caseStudiesLabels[data.case_studies],
          brand_voice: (data.brand_voice ?? []).map(
            (v) => brandVoiceLabels[v as BrandVoice]
          ),
          form_type: "Client Onboarding Form",
          submitted_at: new Date().toISOString(),
          app_origin:
            typeof window !== "undefined" ? window.location.origin : undefined,
        };

        await submitFormPayload(payload);

        setIsSuccess(true);
        toast({
          title: "Success!",
          description: "Your onboarding form has been submitted successfully.",
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Submission error:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to submit form. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [toast]
  );

  const handleReset = useCallback(() => {
    form.reset();
    setCurrentStep(1);
    setIsSuccess(false);
  }, [form]);

  const isLastStep = currentStep === TOTAL_STEPS;

  return {
    form,
    currentStep,
    totalSteps: TOTAL_STEPS,
    isSubmitting,
    isSuccess,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleReset,
    isLastStep,
  };
};
