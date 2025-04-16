import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Eye, CreditCard } from "lucide-react";
import PaymentMethod from "./PaymentMethod";
import PaymentReceipt from "./PaymentReceipt";
import { useToast } from "@/components/ui/use-toast";

interface Invoice {
  id: number;
  invoiceNumber: string;
  date: string;
  description: string;
  amount: number;
  status: string;
  paymentMethod?: string;
}

const BillingPage = () => {
  const { toast } = useToast();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showReceiptDialog, setShowReceiptDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      date: "2024-03-15",
      description: "Consultation Fee",
      amount: 500,
      status: "pending",
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      date: "2024-03-16",
      description: "Lab Tests",
      amount: 1200,
      status: "pending",
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      date: "2024-03-17",
      description: "Medication",
      amount: 800,
      status: "paid",
      paymentMethod: "Credit Card",
    },
  ]);

  const handlePaymentSuccess = (paymentMethod: string) => {
    if (selectedInvoice) {
      // Update the invoice status
      setInvoices(prevInvoices =>
        prevInvoices.map(invoice =>
          invoice.id === selectedInvoice.id
            ? { ...invoice, status: "paid", paymentMethod }
            : invoice
        )
      );

      // Close payment dialog and show receipt
      setShowPaymentDialog(false);
      setShowReceiptDialog(true);

      // Show success notification
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });

      // Create a new invoice
      const newInvoice: Invoice = {
        id: invoices.length + 1,
        invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        description: "Follow-up Consultation",
        amount: Math.floor(Math.random() * 1000) + 500, // Random amount between 500 and 1500
        status: "pending",
      };

      // Add the new invoice to the list
      setInvoices(prevInvoices => [...prevInvoices, newInvoice]);
    }
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    if (invoice.status !== "paid") {
      toast({
        title: "Cannot Download",
        description: "Please complete the payment to download the invoice.",
        variant: "destructive",
      });
      return;
    }

    // Create invoice content
    const invoiceContent = `
      Invoice #${invoice.invoiceNumber}
      Date: ${invoice.date}
      Description: ${invoice.description}
      Amount: ₹${invoice.amount.toFixed(2)}
      Status: ${invoice.status}
      Payment Method: ${invoice.paymentMethod || 'N/A'}
      
      Thank you for choosing our services!
    `;

    // Create a blob and download link
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice_${invoice.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Invoice Downloaded",
      description: "Your invoice has been downloaded successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Billing & Invoices</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {invoices.map((invoice) => (
          <Card key={invoice.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">Invoice #{invoice.invoiceNumber}</CardTitle>
                <Badge className={getStatusColor(invoice.status)}>
                  {invoice.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span>{invoice.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Description:</span>
                  <span>{invoice.description}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Amount:</span>
                  <span className="font-bold">₹{invoice.amount.toFixed(2)}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  {invoice.status === "pending" && (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedInvoice(invoice);
                        setShowPaymentDialog(true);
                      }}
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleDownloadInvoice(invoice)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedInvoice(invoice);
                      setShowDetailsDialog(true);
                    }}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Make Payment</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <PaymentMethod
              invoice={selectedInvoice}
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Receipt Dialog */}
      <Dialog open={showReceiptDialog} onOpenChange={setShowReceiptDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
          </DialogHeader>
          {selectedInvoice && <PaymentReceipt invoice={selectedInvoice} />}
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Invoice Number:</span>
                <span>{selectedInvoice.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span>{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Description:</span>
                <span>{selectedInvoice.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount:</span>
                <span className="font-bold">₹{selectedInvoice.amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge className={getStatusColor(selectedInvoice.status)}>
                  {selectedInvoice.status}
                </Badge>
              </div>
              {selectedInvoice.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Payment Method:</span>
                  <span>{selectedInvoice.paymentMethod}</span>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BillingPage; 