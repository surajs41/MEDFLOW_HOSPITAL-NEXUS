import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity, Calendar, DollarSign, FileMinus, FileText, Package, Thermometer, Users
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Mock data for charts
const patientActivityData = [
  { name: "Mon", admissions: 4, discharges: 3, appointments: 15 },
  { name: "Tue", admissions: 6, discharges: 5, appointments: 18 },
  { name: "Wed", admissions: 8, discharges: 7, appointments: 20 },
  { name: "Thu", admissions: 5, discharges: 6, appointments: 17 },
  { name: "Fri", admissions: 7, discharges: 8, appointments: 22 },
  { name: "Sat", admissions: 3, discharges: 4, appointments: 12 },
  { name: "Sun", admissions: 2, discharges: 3, appointments: 10 },
];

const departmentData = [
  { name: "Emergency", patients: 42 },
  { name: "Cardiology", patients: 28 },
  { name: "Pediatrics", patients: 18 },
  { name: "Orthopedics", patients: 15 },
  { name: "Neurology", patients: 12 },
  { name: "Oncology", patients: 10 },
];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here's an overview of the hospital's operations.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors" 
          onClick={() => navigate("/admin/users")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,284</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate("/admin/appointments")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85</div>
            <p className="text-xs text-muted-foreground">15 waiting, 3 delayed</p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate("/admin/billing")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2,45,890</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate("/admin/inventory")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Beds</CardTitle>
            <Thermometer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">43 / 120</div>
            <p className="text-xs text-muted-foreground">ICU: 5 available</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Patient Activity (Weekly)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={patientActivityData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="admissions" stroke="#1EAEDB" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="discharges" stroke="#0FA0CE" />
                  <Line type="monotone" dataKey="appointments" stroke="#33C3F0" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Patients by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={departmentData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="patients" fill="#1EAEDB" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate("/admin/manage-users")}
        >
          <CardHeader className="flex flex-row items-center space-y-0">
            <Activity className="h-5 w-5 mr-3 text-hospital-primary" />
            <CardTitle className="text-base">Staff on Duty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Doctors</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span>Nurses</span>
                <span className="font-medium">45</span>
              </div>
              <div className="flex justify-between">
                <span>Support Staff</span>
                <span className="font-medium">18</span>
              </div>
              <div className="flex justify-between">
                <span>Admin</span>
                <span className="font-medium">12</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate("/admin/patients")}
        >
          <CardHeader className="flex flex-row items-center space-y-0">
            <FileText className="h-5 w-5 mr-3 text-hospital-primary" />
            <CardTitle className="text-base">Today's Procedures</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Surgeries</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span>Lab Tests</span>
                <span className="font-medium">57</span>
              </div>
              <div className="flex justify-between">
                <span>X-Rays</span>
                <span className="font-medium">24</span>
              </div>
              <div className="flex justify-between">
                <span>MRIs</span>
                <span className="font-medium">6</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card 
          className="cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => navigate("/admin/inventory")}
        >
          <CardHeader className="flex flex-row items-center space-y-0">
            <Package className="h-5 w-5 mr-3 text-hospital-primary" />
            <CardTitle className="text-base">Inventory Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Medications</span>
                <span className="font-medium">92%</span>
              </div>
              <div className="flex justify-between">
                <span>Medical Supplies</span>
                <span className="font-medium">78%</span>
              </div>
              <div className="flex justify-between">
                <span>Equipment</span>
                <span className="font-medium">100%</span>
              </div>
              <div className="flex justify-between text-red-500 font-medium">
                <span>Surgical Gloves</span>
                <span>LOW STOCK</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
