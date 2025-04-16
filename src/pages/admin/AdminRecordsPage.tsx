import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { User } from "@/types/user";

interface MedicalRecord {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  date: string;
  type: string;
  diagnosis: string;
  treatment: string;
  medications: string[];
  status: "active" | "archived" | "pending";
  lastUpdated: string;
  attachments: string[];
}

export default function AdminRecordsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Get users from localStorage
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);

      // Find patients and their assigned doctors
      const patients = parsedUsers.filter(u => u.role === 'patient');
      const doctors = parsedUsers.filter(u => u.role === 'doctor');

      // Create records based on patient-doctor assignments
      const initialRecords: MedicalRecord[] = patients.flatMap(patient => {
        const assignedDoctor = doctors.find(d => d.id === patient.assignedDoctor);
        if (!assignedDoctor) return [];

        // Create different types of records based on doctor's specialization
        const recordTypes = {
          "Neurology": {
            type: "Neurology Consultation",
            diagnosis: "Neurological Assessment",
            treatment: "Neurological treatment plan",
            medications: ["Topiramate 50mg"]
          },
          "Cardiology": {
            type: "Cardiology Checkup",
            diagnosis: "Cardiac Assessment",
            treatment: "Cardiac treatment plan",
            medications: ["Lisinopril 10mg"]
          },
          "General": {
            type: "General Checkup",
            diagnosis: "General Health Assessment",
            treatment: "General treatment plan",
            medications: ["Paracetamol 500mg"]
          }
        };

        // Get the appropriate record type based on doctor's specialization
        const recordType = recordTypes[assignedDoctor.specialization as keyof typeof recordTypes] || recordTypes.General;

        return [
          {
            id: `REC-${patient.id}-1`,
            patientName: patient.name,
            patientId: patient.id,
            doctorName: assignedDoctor.name,
            doctorId: assignedDoctor.id,
            date: new Date().toISOString().split('T')[0],
            type: recordType.type,
            diagnosis: recordType.diagnosis,
            treatment: recordType.treatment,
            medications: recordType.medications,
            status: "active",
            lastUpdated: new Date().toISOString().split('T')[0],
            attachments: ["blood_test.pdf"],
          },
          {
            id: `REC-${patient.id}-2`,
            patientName: patient.name,
            patientId: patient.id,
            doctorName: assignedDoctor.name,
            doctorId: assignedDoctor.id,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            type: recordType.type,
            diagnosis: "Follow-up Assessment",
            treatment: "Continued treatment plan",
            medications: recordType.medications,
            status: "active",
            lastUpdated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            attachments: ["progress_report.pdf"],
          }
        ];
      });

      setRecords(initialRecords);
    }

    // Listen for storage changes to update records
    const handleStorageChange = () => {
      const updatedUsers = localStorage.getItem('users');
      if (updatedUsers) {
        setUsers(JSON.parse(updatedUsers));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getStatusColor = (status: MedicalRecord["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch = 
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || record.status === statusFilter;
    const matchesTab = activeTab === "all" || record.type.toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesStatus && matchesTab;
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Medical Records Management</h1>
        <p className="text-muted-foreground">
          View and manage all medical records in the system
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Medical Records</CardTitle>
          <CardDescription>
            Manage and track all medical records
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Records</TabsTrigger>
              <TabsTrigger value="General Checkup">General Checkup</TabsTrigger>
              <TabsTrigger value="Neurology Consultation">Neurology</TabsTrigger>
              <TabsTrigger value="Cardiology">Cardiology</TabsTrigger>
              <TabsTrigger value="Lab Results">Lab Results</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Record ID</TableHead>
                    <TableHead>Patient</TableHead>
                    <TableHead>Doctor</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Diagnosis</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.id}</TableCell>
                      <TableCell>{record.patientName}</TableCell>
                      <TableCell>{record.doctorName}</TableCell>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.diagnosis}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(record.lastUpdated)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 