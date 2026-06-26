import { useState, useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ContentFormData, ContentType, UploadedFile } from "@/types/form";
import { formSchema, contentTypeLabels, contentProvisionLabels } from "@/types/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const SUBMIT_FORM_URL = `${
  import.meta.env.VITE_SUPABASE_URL || "https://aevjzjlzwkecgmndctnh.supabase.co"
}/functions/v1/submit-form`;

const SUBMIT_FORM_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6ImFldmp6amx6d2tlY2dtbmRjdG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc4ODIzOTMsImV4cCI6MjA4MzQ1ODM5M30.yDx_6asNLyDGcUHe_0edNjDJ9oZr-oUxZdsxP53ozIg";

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

export const useContentUploadForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      content_type: undefined,
      audio_video_link: "",
      highlights: "",
      podcast_name: "",
      episode_name: "",
      episode_release_date: "",
      additional_notes: "",
      guest_name: "",
      guest_title: "",
      guest_email: "",
      copy_to_email: "",
      shortform_link: "",
      content_provision: undefined,
      shortform_podcast_name: "",
      shortform_episode_name: "",
      shortform_highlights: "",
      shortform_notes: "",
      shortform_copy_to_email: "",
      upload_type: "",
    },
    mode: "onChange",
  });

  const contentType = form.watch("content_type");

  const totalSteps = useMemo(() => {
    switch (contentType) {
      case "podcast":
        return 4;
      case "shortform":
        return 3;
      case "both":
        return 6;
      default:
        return 1;
    }
  }, [contentType]);

  const getPageConfig = useCallback(
    (step: number, type: ContentType | undefined) => {
      if (!type || step === 1) {
        return { page: "content_type", flow: "common" };
      }

      switch (type) {
        case "podcast":
          if (step === 2) return { page: "podcast_files", flow: "A" };
          if (step === 3) return { page: "podcast_info", flow: "A" };
          if (step === 4) return { page: "podcast_additional", flow: "A" };
          break;
        case "shortform":
          if (step === 2) return { page: "shortform_files", flow: "B" };
          if (step === 3) return { page: "shortform_info", flow: "B" };
          break;
        case "both":
          if (step === 2) return { page: "podcast_files", flow: "C" };
          if (step === 3) return { page: "podcast_info", flow: "C" };
          if (step === 4) return { page: "podcast_additional", flow: "C" };
          if (step === 5) return { page: "shortform_files", flow: "C" };
          if (step === 6) return { page: "shortform_info", flow: "C" };
          break;
      }
      return { page: "content_type", flow: "common" };
    },
    []
  );

  const currentPageConfig = getPageConfig(currentStep, contentType);

  const validateCurrentStep = useCallback(async () => {
    const config = getPageConfig(currentStep, contentType);

    let fieldsToValidate: (keyof ContentFormData)[] = [];

    switch (config.page) {
      case "content_type":
        fieldsToValidate = ["email", "content_type"];
        break;
      case "podcast_files":
        fieldsToValidate = ["audio_video_link"];
        break;
      case "podcast_info":
        fieldsToValidate = ["podcast_name", "episode_release_date"];
        break;
      case "podcast_additional":
        fieldsToValidate = ["guest_name", "guest_title"];
        break;
      case "shortform_files":
        fieldsToValidate = ["shortform_link", "content_provision"];
        break;
      case "shortform_info":
        fieldsToValidate = ["shortform_podcast_name"];
        break;
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  }, [currentStep, contentType, form, getPageConfig]);

  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  }, [validateCurrentStep, currentStep, totalSteps]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  }, [currentStep]);

  const uploadFilesToStorage = useCallback(async (): Promise<string[]> => {
    if (uploadedFiles.length === 0) return [];

    setIsUploading(true);
    const urls: string[] = [];

    try {
      for (const uploadedFile of uploadedFiles) {
        if (!uploadedFile.file) continue;

        // Generate a unique filename to avoid collisions
        const timestamp = Date.now();
        const sanitizedName = uploadedFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const filePath = `${timestamp}-${sanitizedName}`;

        const { error: uploadError } = await supabase.storage
          .from("form-uploads")
          .upload(filePath, uploadedFile.file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(`Failed to upload ${uploadedFile.name}`);
        }

        // Get the public URL
        const { data: urlData } = supabase.storage
          .from("form-uploads")
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          urls.push(urlData.publicUrl);
        }
      }

      return urls;
    } finally {
      setIsUploading(false);
    }
  }, [uploadedFiles]);

  const handleSubmit = useCallback(
    async (data: ContentFormData) => {
      setIsSubmitting(true);

      try {
        const fileUrls = await uploadFilesToStorage();

        const uploadTypeMap: Record<ContentType, string> = {
          podcast: "audio_video_podcast",
          shortform: "shortform_video",
          both: "both",
        };

        const payload = {
          ...data,
          content_type: contentTypeLabels[data.content_type],
          content_provision: data.content_provision 
            ? contentProvisionLabels[data.content_provision] 
            : undefined,
          upload_type: uploadTypeMap[data.content_type],
          uploaded_file_urls: fileUrls,
          submitted_at: new Date().toISOString(),
        };

        await submitFormPayload(payload);

        setIsSuccess(true);
        toast({
          title: "Success!",
          description: "Your content has been submitted successfully.",
        });
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
    [uploadFilesToStorage, toast]
  );

  const handleReset = useCallback(() => {
    form.reset();
    setCurrentStep(1);
    setUploadedFiles([]);
    setIsSuccess(false);
  }, [form]);

  const isLastStep = currentStep === totalSteps && totalSteps > 1;

  return {
    form,
    currentStep,
    totalSteps,
    currentPageConfig,
    isSubmitting,
    isUploading,
    uploadedFiles,
    setUploadedFiles,
    isSuccess,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleReset,
    isLastStep,
  };
};
