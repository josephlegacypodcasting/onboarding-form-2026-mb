import { Form } from "@/components/ui/form";
import { useContentUploadForm } from "@/hooks/useContentUploadForm";
import FormHeader from "./FormHeader";
import FormProgress from "./FormProgress";
import FormNavigation from "./FormNavigation";
import SuccessScreen from "./SuccessScreen";
import Page1ContentType from "./pages/Page1ContentType";
import PodcastFilesPage from "./pages/PodcastFilesPage";
import PodcastInfoPage from "./pages/PodcastInfoPage";
import PodcastAdditionalPage from "./pages/PodcastAdditionalPage";
import ShortFormFilesPage from "./pages/ShortFormFilesPage";
import ShortFormInfoPage from "./pages/ShortFormInfoPage";

const ContentUploadForm = () => {
  const {
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
  } = useContentUploadForm();

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <FormHeader />
          <SuccessScreen onReset={handleReset} />
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPageConfig.page) {
      case "content_type":
        return <Page1ContentType form={form} />;
      case "podcast_files":
        return <PodcastFilesPage form={form} />;
      case "podcast_info":
        return <PodcastInfoPage form={form} />;
      case "podcast_additional":
        return <PodcastAdditionalPage form={form} />;
      case "shortform_files":
        return <ShortFormFilesPage form={form} />;
      case "shortform_info":
        return <ShortFormInfoPage form={form} />;
      default:
        return <Page1ContentType form={form} />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <FormHeader />

        {totalSteps > 1 && (
          <FormProgress currentStep={currentStep} totalSteps={totalSteps} />
        )}

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isLastStep) {
                form.handleSubmit(handleSubmit)(e);
              }
            }}
          >
            {renderCurrentPage()}

            <FormNavigation
              onPrevious={handlePrevious}
              onNext={isLastStep ? () => form.handleSubmit(handleSubmit)() : handleNext}
              showPrevious={currentStep > 1}
              showNext={totalSteps > 0}
              isLoading={isSubmitting || isUploading}
              nextDisabled={false}
              buttonText={isLastStep ? "Submit" : "Next"}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ContentUploadForm;
