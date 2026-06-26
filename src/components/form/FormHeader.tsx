import logoMarketBetter from "@/assets/logo-market-better.webp";

const FormHeader = () => {
  return (
    <div className="mb-8 text-center">
      <div className="flex justify-center mb-6">
        <img
          src={logoMarketBetter}
          alt="Market Better"
          className="w-1/2 max-w-[200px] h-auto"
        />
      </div>
      <h1 className="text-2xl font-medium text-foreground mb-2">
        Client Onboarding Form
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Thanks for joining us! Please fill out the form to help us make your
        onboarding as productive as possible.
      </p>
    </div>
  );
};

export default FormHeader;
