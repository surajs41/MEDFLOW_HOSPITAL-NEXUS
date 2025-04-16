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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole } from "@/types/auth";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  role: UserRole;
  status: "active" | "inactive" | "pending";
  lastLogin: string;
  createdAt: string;
  specialization?: string;
  department?: string;
  assignedDoctor?: string;
}

// Initial mock data that matches with patient records
const INITIAL_USERS: User[] = [
  {
    id: "1",
    name: "Rajesh Kumar",
    email: "rajesh.kumar@example.com",
    phone: "9876543210",
    dateOfBirth: "1985-05-15",
    address: "123 Main Street, Mumbai",
    role: "patient",
    status: "active",
    lastLogin: new Date().toISOString(),
    createdAt: "2024-01-01",
    assignedDoctor: "2"
  },
  {
    id: "2",
    name: "Dr. Priya Sharma",
    email: "priya.sharma@example.com",
    phone: "9876543211",
    dateOfBirth: "1980-03-20",
    address: "456 Doctor Lane, Mumbai",
    role: "doctor",
    status: "active",
    lastLogin: new Date().toISOString(),
    createdAt: "2024-01-01",
    specialization: "Neurology",
    department: "Neurology"
  },
  {
    id: "3",
    name: "Anjali Patel",
    email: "anjali.patel@example.com",
    phone: "9876543212",
    dateOfBirth: "1990-07-10",
    address: "789 Patient Street, Mumbai",
    role: "patient",
    status: "active",
    lastLogin: new Date().toISOString(),
    createdAt: "2024-01-02",
    assignedDoctor: "5"
  },
  {
    id: "4",
    name: "Nurse Sunita Desai",
    email: "sunita.desai@example.com",
    phone: "9876543213",
    dateOfBirth: "1988-11-25",
    address: "321 Nurse Avenue, Mumbai",
    role: "nurse",
    status: "active",
    lastLogin: new Date().toISOString(),
    createdAt: "2024-01-02",
    department: "Neurology"
  },
  {
    id: "5",
    name: "Dr. Vikram Singh",
    email: "vikram.singh@example.com",
    phone: "9876543214",
    dateOfBirth: "1975-09-15",
    address: "654 Doctor Road, Mumbai",
    role: "doctor",
    status: "active",
    lastLogin: new Date().toISOString(),
    createdAt: "2024-01-03",
    specialization: "Cardiology",
    department: "Cardiology"
  },
  {
    id: "6",
    name: "Receptionist Ramesh Gupta",
    email: "ramesh.gupta@example.com",
    phone: "9876543215",
    dateOfBirth: "1992-02-28",
    address: "987 Reception Street, Mumbai",
    role: "receptionist",
    status: "active",
    lastLogin: new Date().toISOString(),
    createdAt: "2024-01-03"
  }
];

export default function ManageUsersPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<UserRole | "all">("all");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Initialize users in localStorage if not present
    const storedUsers = localStorage.getItem('users');
    if (!storedUsers) {
      localStorage.setItem('users', JSON.stringify(INITIAL_USERS));
      setUsers(INITIAL_USERS);
    } else {
      const parsedUsers = JSON.parse(storedUsers);
      setUsers(parsedUsers);
    }

    // Listen for storage changes to update the users list
    const handleStorageChange = () => {
      const updatedUsers = localStorage.getItem('users');
      if (updatedUsers) {
        setUsers(JSON.parse(updatedUsers));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "doctor":
        return "bg-blue-100 text-blue-800";
      case "nurse":
        return "bg-purple-100 text-purple-800";
      case "receptionist":
        return "bg-orange-100 text-orange-800";
      case "admin":
        return "bg-red-100 text-red-800";
      default:
        return "bg-green-100 text-green-800";
    }
  };

  const getStatusColor = (status: User["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
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

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = activeTab === "all" || user.role === activeTab;
    return matchesSearch && matchesRole;
  });

  const renderRoleSpecificColumns = (user: User) => {
    switch (user.role) {
      case "doctor":
        return (
          <>
            <TableCell>{user.specialization || "-"}</TableCell>
            <TableCell>{user.department || "-"}</TableCell>
          </>
        );
      case "patient":
        return (
          <>
            <TableCell>{user.assignedDoctor || "-"}</TableCell>
            <TableCell>{formatDate(user.dateOfBirth)}</TableCell>
          </>
        );
      case "nurse":
        return (
          <>
            <TableCell>{user.department || "-"}</TableCell>
            <TableCell>-</TableCell>
          </>
        );
      default:
        return (
          <>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </>
        );
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage all users in the system
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>
            View and manage all users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as UserRole | "all")}>
            <TabsList>
              <TabsTrigger value="all">All Users</TabsTrigger>
              <TabsTrigger value="patient">Patients</TabsTrigger>
              <TabsTrigger value="doctor">Doctors</TabsTrigger>
              <TabsTrigger value="nurse">Nurses</TabsTrigger>
              <TabsTrigger value="receptionist">Receptionists</TabsTrigger>
              <TabsTrigger value="admin">Admins</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    {activeTab === "doctor" && (
                      <>
                        <TableHead>Specialization</TableHead>
                        <TableHead>Department</TableHead>
                      </>
                    )}
                    {activeTab === "patient" && (
                      <>
                        <TableHead>Assigned Doctor</TableHead>
                        <TableHead>Date of Birth</TableHead>
                      </>
                    )}
                    {activeTab === "nurse" && (
                      <>
                        <TableHead>Department</TableHead>
                        <TableHead></TableHead>
                      </>
                    )}
                    {activeTab === "all" && (
                      <>
                        <TableHead>Additional Info</TableHead>
                        <TableHead>Details</TableHead>
                      </>
                    )}
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.phone}</TableCell>
                      <TableCell>
                        <Badge className={getRoleColor(user.role)}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      {renderRoleSpecificColumns(user)}
                      <TableCell>{formatDate(user.lastLogin)}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            View Details
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