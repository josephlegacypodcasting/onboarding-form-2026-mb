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
      <h1 className="text-2xl font-medium text-foreground mb-4">
        Market Better Content Upload
      </h1>
    </div>
  );
};

export default FormHeader;
