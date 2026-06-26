interface StepHeaderProps {
  title: string;
  description?: string;
  important?: string;
}

const StepHeader = ({ title, description, important }: StepHeaderProps) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-medium text-foreground mb-2">{title}</h2>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      {important && (
        <p className="text-sm text-foreground mt-3 rounded-md bg-secondary p-3 border-l-4 border-l-primary">
          {important}
        </p>
      )}
    </div>
  );
};

export default StepHeader;
