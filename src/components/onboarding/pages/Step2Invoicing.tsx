import { UseFormReturn } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  OnboardingFormData,
  paymentMethodOptions,
  paymentMethodLabels,
} from "@/types/onboardingForm";
import FormCard from "../../form/FormCard";
import StepHeader from "../StepHeader";

interface StepProps {
  form: UseFormReturn<OnboardingFormData>;
}

const Req = () => <span className="text-destructive">*</span>;

const Step2Invoicing = ({ form }: StepProps) => {
  return (
    <FormCard>
      <StepHeader
        title="Invoicing"
        important="Invoices are issued monthly and billed for the month ahead. Your first invoice will be issued after the Kick-Off Call."
      />
      <div className="space-y-6">
        <FormField
          control={form.control}
          name="invoice_emails"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Who should receive invoice emails? (You can add multiple emails){" "}
                <Req />
              </FormLabel>
              <FormControl>
                <Textarea rows={2} placeholder="billing@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="legal_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Full legal name (individual or company) <Req />
              </FormLabel>
              <FormControl>
                <Input placeholder="Legal name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billing_email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Billing email address <Req />
              </FormLabel>
              <FormControl>
                <Input type="email" placeholder="billing@company.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billing_company_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Company name (if applicable)</FormLabel>
              <FormControl>
                <Input placeholder="Company name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="billing_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Billing address (street, city, state, ZIP/postal code, country){" "}
                <Req />
              </FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Billing address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payment_method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Preferred payment method <Req />
              </FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="space-y-3 mt-2"
                >
                  {paymentMethodOptions.map((opt) => (
                    <div key={opt} className="flex items-center space-x-3">
                      <RadioGroupItem value={opt} id={`pay-${opt}`} />
                      <Label htmlFor={`pay-${opt}`} className="font-normal cursor-pointer">
                        {paymentMethodLabels[opt]}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </FormCard>
  );
};

export default Step2Invoicing;
