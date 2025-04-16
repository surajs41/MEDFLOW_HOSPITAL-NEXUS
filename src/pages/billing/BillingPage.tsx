import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, FileText, Download, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BillingPage = () => {
  // Mock data - would come from API in a real app
  const invoices = [
    {
      id: 1,
      invoiceNumber: "INV-2025-001",
      date: "01/15/2025",
      description: "Annual Physical Examination",
      amount: 1500.00,
      status: "paid",
      paymentMethod: "Insurance"
    },
    {
      id: 2,
      invoiceNumber: "INV-2025-012",
      date: "02/03/2025",
      description: "Specialist Consultation - Cardiology",
      amount: 2500.00,
      status: "pending",
      paymentMethod: "Not paid"
    },
    {
      id: 3,
      invoiceNumber: "INV-2025-018",
      date: "02/15/2025",
      description: "Laboratory Tests - Blood Work",
      amount: 750.00,
      status: "paid",
      paymentMethod: "Credit Card"
    },
    {
      id: 4,
      invoiceNumber: "INV-2025-023",
      date: "03/01/2025",
      description: "Prescription Medication",
      amount: 355.50,
      status: "pending",
      paymentMethod: "Not paid"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Billing</h1>
        <p className="text-muted-foreground">
          View and manage your medical bills and payments
        </p>
      </header>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
        </TabsList>
        
        <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search invoices..."
              className="w-full pl-8"
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        
        <TabsContent value="all" className="space-y-4">
          {invoices.map(invoice => (
            <Card key={invoice.id}>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{invoice.description}</h3>
                      <p className="text-sm text-muted-foreground">Invoice #{invoice.invoiceNumber}</p>
                      <p className="text-sm mt-1">Date: {invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{invoice.amount.toFixed(2)}</p>
                      {invoice.status === "paid" ? (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-800">
                          Paid - {invoice.paymentMethod}
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-800">
                          Pending Payment
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="border-t bg-muted/50 p-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  {invoice.status === "pending" && (
                    <Button size="sm">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay Now
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-4">
          {invoices.filter(i => i.status === "pending").map(invoice => (
            <Card key={invoice.id}>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{invoice.description}</h3>
                      <p className="text-sm text-muted-foreground">Invoice #{invoice.invoiceNumber}</p>
                      <p className="text-sm mt-1">Date: {invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{invoice.amount.toFixed(2)}</p>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-amber-50 text-amber-800">
                        Pending Payment
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t bg-muted/50 p-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button size="sm">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Pay Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="paid" className="space-y-4">
          {invoices.filter(i => i.status === "paid").map(invoice => (
            <Card key={invoice.id}>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{invoice.description}</h3>
                      <p className="text-sm text-muted-foreground">Invoice #{invoice.invoiceNumber}</p>
                      <p className="text-sm mt-1">Date: {invoice.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{invoice.amount.toFixed(2)}</p>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-800">
                        Paid - {invoice.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t bg-muted/50 p-4 flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="mr-2 h-4 w-4" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BillingPage;
