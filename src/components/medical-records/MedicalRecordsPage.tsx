import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, Eye, FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MedicalRecord {
  id: number;
  recordNumber: string;
  date: string;
  type: string;
  doctor: string;
  status: string;
  fileUrl?: string;
}

const MedicalRecordsPage = () => {
  const { toast } = useToast();
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: 1,
      recordNumber: "MR-2024-001",
      date: "2024-03-15",
      type: "Lab Report",
      doctor: "Dr. Smith",
      status: "completed",
      fileUrl: "https://example.com/reports/lab-report-001.pdf"
    },
    {
      id: 2,
      recordNumber: "MR-2024-002",
      date: "2024-03-16",
      type: "X-Ray",
      doctor: "Dr. Johnson",
      status: "completed",
      fileUrl: "https://example.com/reports/xray-001.pdf"
    },
    {
      id: 3,
      recordNumber: "MR-2024-003",
      date: "2024-03-17",
      type: "Prescription",
      doctor: "Dr. Williams",
      status: "pending"
    }
  ]);

  const handleDownloadRecord = async (record: MedicalRecord) => {
    if (!record.fileUrl) {
      toast({
        title: "Cannot Download",
        description: "This record is not available for download yet.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = record.fileUrl;
      link.download = `medical-record-${record.recordNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download Started",
        description: "Your medical record is being downloaded.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading your record. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateReport = async (record: MedicalRecord) => {
    if (isGenerating) return;

    setIsGenerating(true);
    try {
      // Simulate report generation
      toast({
        title: "Report Generation",
        description: "Generating your medical report...",
      });

      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update the record with a file URL
      setRecords(prevRecords =>
        prevRecords.map(r =>
          r.id === record.id
            ? {
                ...r,
                status: "completed",
                fileUrl: `https://example.com/reports/${record.type.toLowerCase().replace(' ', '-')}-${record.id}.pdf`
              }
            : r
        )
      );

      toast({
        title: "Report Generated",
        description: "Your medical report has been generated and is ready for download.",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "There was an error generating your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Medical Records</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {records.map((record) => (
          <Card key={record.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">Record #{record.recordNumber}</CardTitle>
                <Badge className={getStatusColor(record.status)}>
                  {record.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Date:</span>
                  <span>{record.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type:</span>
                  <span>{record.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Doctor:</span>
                  <span>{record.doctor}</span>
                </div>
                <div className="flex gap-2 mt-4">
                  {record.status === "completed" ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleDownloadRecord(record)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleGenerateReport(record)}
                      disabled={isGenerating}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      {isGenerating ? "Generating..." : "Generate Report"}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      setSelectedRecord(record);
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

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Record Details</DialogTitle>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-500">Record Number:</span>
                <span>{selectedRecord.recordNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span>{selectedRecord.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span>{selectedRecord.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Doctor:</span>
                <span>{selectedRecord.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <Badge className={getStatusColor(selectedRecord.status)}>
                  {selectedRecord.status}
                </Badge>
              </div>
              {selectedRecord.fileUrl && (
                <div className="flex justify-between">
                  <span className="text-gray-500">File Available:</span>
                  <span className="text-green-600">Yes</span>
                </div>
              )}
              <div className="flex justify-end mt-4">
                {selectedRecord.status === "completed" ? (
                  <Button
                    variant="default"
                    onClick={() => handleDownloadRecord(selectedRecord)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Record
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={() => handleGenerateReport(selectedRecord)}
                    disabled={isGenerating}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate Report"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicalRecordsPage; 