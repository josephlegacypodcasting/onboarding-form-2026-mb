import { Form } from "@/components/ui/form";
import { useOnboardingForm } from "@/hooks/useOnboardingForm";
import FormHeader from "../form/FormHeader";
import FormProgress from "../form/FormProgress";
import FormNavigation from "../form/FormNavigation";
import SuccessScreen from "../form/SuccessScreen";
import Step1Company from "./pages/Step1Company";
import Step2Invoicing from "./pages/Step2Invoicing";
import Step3Business from "./pages/Step3Business";
import Step4Video from "./pages/Step4Video";
import Step5Socials from "./pages/Step5Socials";
import Step6Inbound from "./pages/Step6Inbound";
import Step7Outbound from "./pages/Step7Outbound";
import Step8Final from "./pages/Step8Final";

const OnboardingForm = () => {
  const {
    form,
    currentStep,
    totalSteps,
    isSubmitting,
    isSuccess,
    handleNext,
    handlePrevious,
    handleSubmit,
    handleReset,
    isLastStep,
  } = useOnboardingForm();

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

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Company form={form} />;
      case 2:
        return <Step2Invoicing form={form} />;
      case 3:
        return <Step3Business form={form} />;
      case 4:
        return <Step4Video form={form} />;
      case 5:
        return <Step5Socials form={form} />;
      case 6:
        return <Step6Inbound form={form} />;
      case 7:
        return <Step7Outbound form={form} />;
      case 8:
        return <Step8Final form={form} />;
      default:
        return <Step1Company form={form} />;
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <FormHeader />

        <FormProgress currentStep={currentStep} totalSteps={totalSteps} />

        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (isLastStep) {
                form.handleSubmit(handleSubmit)(e);
              }
            }}
            onKeyDown={(e) => {
              // Prevent Enter key from submitting / advancing the form
              if (e.key === "Enter" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
                e.preventDefault();
              }
            }}
          >
            {renderCurrentStep()}

            <FormNavigation
              onPrevious={handlePrevious}
              onNext={isLastStep ? () => form.handleSubmit(handleSubmit)() : handleNext}
              showPrevious={currentStep > 1}
              showNext={true}
              isLoading={isSubmitting}
              nextDisabled={false}
              buttonText={isLastStep ? "Submit" : "Next"}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default OnboardingForm;
