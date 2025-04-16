
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clipboard, RefreshCcw, AlertCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const PrescriptionsPage = () => {
  // Mock data - would come from API in a real app
  const prescriptions = [
    {
      id: 1,
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      prescribedBy: "Dr. James Wilson",
      prescribedDate: "01/15/2025",
      refillsLeft: 2,
      status: "active"
    },
    {
      id: 2,
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      prescribedBy: "Dr. Jane Smith",
      prescribedDate: "02/03/2025",
      refillsLeft: 3,
      status: "active"
    },
    {
      id: 3,
      medication: "Loratadine",
      dosage: "10mg",
      frequency: "Once daily as needed",
      prescribedBy: "Dr. Sarah Johnson",
      prescribedDate: "01/05/2025",
      refillsLeft: 1,
      status: "active"
    },
    {
      id: 4,
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      prescribedBy: "Dr. Robert Chen",
      prescribedDate: "12/10/2024",
      refillsLeft: 0,
      status: "expired"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Prescriptions</h1>
        <p className="text-muted-foreground">
          View and manage your current prescriptions
        </p>
      </header>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search prescriptions..."
            className="w-full pl-8"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid gap-4">
        {prescriptions.map(prescription => (
          <Card key={prescription.id} className={prescription.status === "expired" ? "border-red-200" : ""}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{prescription.medication}</h3>
                  <p className="text-muted-foreground">{prescription.dosage} - {prescription.frequency}</p>
                  <p className="text-sm mt-1">Prescribed by: {prescription.prescribedBy}</p>
                  <p className="text-sm">Date: {prescription.prescribedDate}</p>
                </div>
                <div className="text-right">
                  {prescription.status === "active" ? (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-50 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-50 text-red-800">
                      Expired
                    </span>
                  )}
                  <p className="text-sm mt-2">
                    {prescription.refillsLeft > 0 ? (
                      `${prescription.refillsLeft} refills remaining`
                    ) : (
                      "No refills remaining"
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end mt-4 space-x-2">
                {prescription.status === "active" && prescription.refillsLeft > 0 && (
                  <Button size="sm">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Request Refill
                  </Button>
                )}
                <Button variant="outline" size="sm">
                  <Clipboard className="mr-2 h-4 w-4" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PrescriptionsPage;
