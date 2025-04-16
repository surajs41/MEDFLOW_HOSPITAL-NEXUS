import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const MedicalRecordsPage = () => {
  // Mock data - would come from API in a real app
  const records = [
    {
      id: 1,
      title: "Blood Test Results",
      facility: "City Central Lab",
      date: "2 days ago",
      type: "Lab Test",
      doctorName: "Dr. Rajesh Patil"
    },
    {
      id: 2,
      title: "Annual Physical",
      facility: "Main Hospital",
      date: "2 weeks ago",
      type: "Examination",
      doctorName: "Dr. Priya Deshmukh"
    },
    {
      id: 3,
      title: "Allergy Test",
      facility: "Allergy Clinic",
      date: "1 month ago",
      type: "Test",
      doctorName: "Dr. Sunil Kulkarni"
    },
    {
      id: 4,
      title: "X-Ray",
      facility: "Imaging Center",
      date: "3 months ago",
      type: "Imaging",
      doctorName: "Dr. Meera Joshi"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Medical Records</h1>
        <p className="text-muted-foreground">
          View your complete medical history and test results
        </p>
      </header>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search records..."
            className="w-full pl-8"
          />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="grid gap-4">
        {records.map(record => (
          <Card key={record.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{record.title}</h3>
                    <p className="text-muted-foreground text-sm">{record.facility}</p>
                    <p className="text-sm mt-1">Doctor: {record.doctorName}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-50 text-blue-800">
                      {record.type}
                    </span>
                    <p className="text-sm text-muted-foreground mt-1">{record.date}</p>
                  </div>
                </div>
              </div>
              <div className="border-t bg-muted/50 p-4 flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  View Report
                </Button>
                <Button size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MedicalRecordsPage;
