import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Banknote, Smartphone } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface PaymentMethodProps {
  invoice: {
    id: number;
    amount: number;
  };
  onPaymentSuccess: (paymentMethod: string) => void;
}

const PaymentMethod = ({ invoice, onPaymentSuccess }: PaymentMethodProps) => {
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const validateCardDetails = () => {
    if (!cardNumber || !expiryDate || !cvv) {
      toast({
        title: "Error",
        description: "Please fill in all card details",
        variant: "destructive",
      });
      return false;
    }

    // Basic card number validation
    if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ""))) {
      toast({
        title: "Error",
        description: "Please enter a valid 16-digit card number",
        variant: "destructive",
      });
      return false;
    }

    // Basic expiry date validation
    if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiryDate)) {
      toast({
        title: "Error",
        description: "Please enter a valid expiry date (MM/YY)",
        variant: "destructive",
      });
      return false;
    }

    // Basic CVV validation
    if (!/^\d{3,4}$/.test(cvv)) {
      toast({
        title: "Error",
        description: "Please enter a valid CVV",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePayment = async () => {
    if (paymentMethod === "card" && !validateCardDetails()) {
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the success handler with the selected payment method
      const selectedMethod = paymentMethod === "card" ? "Credit Card" : 
                           paymentMethod === "upi" ? "UPI" : "Net Banking";
      onPaymentSuccess(selectedMethod);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label>Amount to Pay</Label>
            <div className="text-2xl font-bold mt-2">₹{invoice.amount.toFixed(2)}</div>
          </div>

          <RadioGroup 
            value={paymentMethod} 
            onValueChange={setPaymentMethod} 
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2" />
                Credit/Debit Card
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="upi" id="upi" />
              <Label htmlFor="upi" className="flex items-center">
                <Smartphone className="h-4 w-4 mr-2" />
                UPI Payment
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="netbanking" id="netbanking" />
              <Label htmlFor="netbanking" className="flex items-center">
                <Banknote className="h-4 w-4 mr-2" />
                Net Banking
              </Label>
            </div>
          </RadioGroup>

          {paymentMethod === "card" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Card Number</Label>
                <Input 
                  placeholder="1234 5678 9012 3456" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input 
                    placeholder="MM/YY" 
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>CVV</Label>
                  <Input 
                    placeholder="123" 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <Button 
            onClick={handlePayment} 
            className="w-full"
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentMethod; 