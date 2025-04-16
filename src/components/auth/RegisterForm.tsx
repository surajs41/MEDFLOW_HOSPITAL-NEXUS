import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useNavigate } from "react-router-dom";
import { UserRole } from "@/types/auth";
import { useToast } from "@/components/ui/use-toast";
import { RegisterData } from "@/types/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  phone?: string;
  dateOfBirth?: string;
  specialization?: string;
  assignedDoctor?: string;
  department?: string;
}

export function RegisterForm() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    role: "patient",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validatePassword = (password: string): boolean => {
    // Password must start with uppercase letter
    if (!/^[A-Z]/.test(password)) {
      setErrors((prev) => ({ ...prev, password: "Password must start with an uppercase letter" }));
      return false;
    }
    // Password must contain at least one number
    if (!/\d/.test(password)) {
      setErrors((prev) => ({ ...prev, password: "Password must contain at least one number" }));
      return false;
    }
    // Password must contain at least one special character
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setErrors((prev) => ({ ...prev, password: "Password must contain at least one special character" }));
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate password
    if (!validatePassword(formData.password)) {
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
      return;
    }

    // Validate role-specific fields
    if (formData.role === "doctor" && !formData.specialization) {
      setErrors((prev) => ({ ...prev, specialization: "Specialization is required" }));
      return;
    }
    if (formData.role === "patient" && !formData.assignedDoctor) {
      setErrors((prev) => ({ ...prev, assignedDoctor: "Assigned doctor is required" }));
      return;
    }
    if (formData.role === "nurse" && !formData.department) {
      setErrors((prev) => ({ ...prev, department: "Department is required" }));
      return;
    }

    setIsLoading(true);
    try {
      await register(formData);
      toast({
        title: "Registration successful",
        description: "You have been registered successfully.",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Failed to register. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Enter your details to register for an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter your 10-digit phone number"
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleChange}
              required
            />
            {errors.dateOfBirth && (
              <p className="text-sm text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              placeholder="Enter your address"
            />
          </div>

          <div className="space-y-2">
            <Label>Role</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => setFormData(prev => ({ ...prev, role: value as UserRole }))}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="patient" id="patient" />
                <Label htmlFor="patient">Patient</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="doctor" id="doctor" />
                <Label htmlFor="doctor">Doctor</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="nurse" id="nurse" />
                <Label htmlFor="nurse">Nurse</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="receptionist" id="receptionist" />
                <Label htmlFor="receptionist">Receptionist</Label>
              </div>
            </RadioGroup>
          </div>

          {formData.role === "doctor" && (
            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                name="specialization"
                type="text"
                value={formData.specialization}
                onChange={handleChange}
                required
              />
              {errors.specialization && (
                <p className="text-sm text-red-500">{errors.specialization}</p>
              )}
            </div>
          )}

          {formData.role === "patient" && (
            <div className="space-y-2">
              <Label htmlFor="assignedDoctor">Assigned Doctor</Label>
              <Input
                id="assignedDoctor"
                name="assignedDoctor"
                type="text"
                value={formData.assignedDoctor}
                onChange={handleChange}
                required
              />
              {errors.assignedDoctor && (
                <p className="text-sm text-red-500">{errors.assignedDoctor}</p>
              )}
            </div>
          )}

          {formData.role === "nurse" && (
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                name="department"
                type="text"
                value={formData.department}
                onChange={handleChange}
                required
              />
              {errors.department && (
                <p className="text-sm text-red-500">{errors.department}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <a href="/login" className="text-primary hover:underline">
            Login
          </a>
        </p>
      </CardFooter>
    </Card>
  );
}

export default RegisterForm;
