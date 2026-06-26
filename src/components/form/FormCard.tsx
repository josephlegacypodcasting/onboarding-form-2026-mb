import { ReactNode } from "react";

interface FormCardProps {
  children: ReactNode;
}

const FormCard = ({ children }: FormCardProps) => {
  return (
    <div className="bg-card rounded-lg p-8 shadow-sm border-t-4 border-t-primary border-x-0 border-b-0">
      <p className="text-sm text-destructive mb-6">
        * Indicates required question
      </p>
      {children}
    </div>
  );
};

export default FormCard;
