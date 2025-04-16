import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PaymentReceiptProps {
  invoice: {
    id: number;
    invoiceNumber: string;
    date: string;
    description: string;
    amount: number;
    status: string;
    paymentMethod?: string;
  };
}

const PaymentReceipt = ({ invoice }: PaymentReceiptProps) => {
  const { toast } = useToast();

  const handleDownload = () => {
    // Create receipt content
    const receiptContent = `
      Receipt for Invoice #${invoice.invoiceNumber}
      Date: ${invoice.date}
      Description: ${invoice.description}
      Amount: ₹${invoice.amount.toFixed(2)}
      Payment Method: ${invoice.paymentMethod || 'N/A'}
      Status: ${invoice.status}
      
      Thank you for your payment!
    `;

    // Create a blob and download link
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt_${invoice.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Receipt Downloaded",
      description: "Your receipt has been downloaded successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Confirmation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span className="text-gray-500">Invoice Number:</span>
            <span className="font-medium">{invoice.invoiceNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Date:</span>
            <span className="font-medium">{invoice.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Description:</span>
            <span className="font-medium">{invoice.description}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Amount:</span>
            <span className="font-medium">₹{invoice.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment Method:</span>
            <span className="font-medium">{invoice.paymentMethod || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status:</span>
            <span className="font-medium text-green-600">Paid</span>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={handleDownload} className="gap-2">
          <Download className="h-4 w-4" />
          Download Receipt
        </Button>
      </div>
    </div>
  );
};

export default PaymentReceipt; 