import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AppointmentsPage = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  
  // Mock data - would come from API in a real app
  const upcomingAppointments = [
    {
      id: 1,
      doctor: "Dr. Priya Deshmukh",
      specialty: "General Practitioner",
      date: "Today",
      time: "3:00 PM",
      type: "Follow-up",
      status: "confirmed"
    },
    {
      id: 2,
      doctor: "Dr. Rajesh Patil",
      specialty: "Cardiologist",
      date: "Tomorrow",
      time: "10:30 AM",
      type: "Consultation",
      status: "confirmed"
    }
  ];
  
  const pastAppointments = [
    {
      id: 3,
      doctor: "Dr. Priya Deshmukh",
      specialty: "General Practitioner",
      date: "Last week",
      time: "2:00 PM",
      type: "Check-up",
      status: "completed"
    },
    {
      id: 4,
      doctor: "Dr. Sunil Kulkarni",
      specialty: "Dermatologist",
      date: "2 weeks ago",
      time: "11:15 AM",
      type: "Consultation",
      status: "completed"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Appointments</h1>
          <p className="text-muted-foreground">
            View and manage your appointments
          </p>
        </div>
        <Button>Schedule New Appointment</Button>
      </header>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{appointment.doctor}</h3>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-hospital-primary">{appointment.date}</p>
                    <p className="text-sm text-muted-foreground">{appointment.time}</p>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-50 text-blue-700 border-blue-200">
                    {appointment.type}
                  </span>
                  <div className="space-x-2">
                    <Button size="sm">Check In</Button>
                    <Button size="sm" variant="outline">Reschedule</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          {pastAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardContent className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{appointment.doctor}</h3>
                    <p className="text-sm text-muted-foreground">{appointment.specialty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{appointment.date}</p>
                    <p className="text-sm text-muted-foreground">{appointment.time}</p>
                  </div>
                </div>
                <div className="flex justify-between mt-4">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border-green-200">
                    Completed
                  </span>
                  <Button size="sm" variant="outline">View Summary</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsPage;
