import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Bell, Mail, Lock, Shield, Globe, Moon, Smartphone,
  Palette, EyeOff, LogOut 
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useTheme } from "@/contexts/ThemeContext";
import { Theme } from "@/contexts/ThemeContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PasswordErrors {
  newPassword?: string;
  confirmPassword?: string;
}

export default function SettingsPage() {
  const { user, updateProfile, deleteAccount, logout } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, translations } = useLanguage();
  const [passwordData, setPasswordData] = useState<PasswordFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<PasswordErrors>({});

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    appointmentReminders: true,
    prescriptionReminders: true,
    marketingEmails: false,
    smsNotifications: true,
  });

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const validatePassword = (password: string): string | null => {
    if (!/^[A-Z]/.test(password)) {
      return "Password must start with an uppercase letter";
    }
    if (!/\d/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setPasswordErrors({});

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
      setIsUpdating(false);
      return;
    }

    const passwordError = validatePassword(passwordData.newPassword);
    if (passwordError) {
      setPasswordErrors(prev => ({ ...prev, newPassword: passwordError }));
      setIsUpdating(false);
      return;
    }

    try {
      await updateProfile({ password: passwordData.newPassword });
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update password",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSwitchChange = (name: string) => {
    setNotificationSettings(prev => ({
      ...prev,
      [name]: !prev[name as keyof typeof notificationSettings]
    }));
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please make sure your new password and confirmation match.",
      });
      return;
    }

    // In a real app, this would send data to the backend
    toast({
      title: "Password updated successfully",
      description: "Your password has been changed.",
    });
    
    // Reset the form
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const saveNotificationSettings = () => {
    // In a real app, this would send data to the backend
    toast({
      title: "Settings saved",
      description: "Your notification preferences have been updated.",
    });
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    toast({
      title: "Theme Updated",
      description: `Theme changed to ${newTheme}`,
    });
  };

  const handleEmailNotifications = (checked: boolean) => {
    setEmailNotifications(checked);
    toast({
      title: "Notifications Updated",
      description: `Email notifications ${checked ? 'enabled' : 'disabled'}`,
    });
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as 'en' | 'hi' | 'mr');
    toast({
      title: "Language Changed",
      description: "Your language preference has been updated.",
    });
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      await deleteAccount();
      // The user will be logged out and redirected by the AuthContext
    } catch (error) {
      console.error('Failed to delete account:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">{translations.settings}</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </header>

      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-8">
          <TabsTrigger value="account">{translations.account}</TabsTrigger>
          <TabsTrigger value="notifications">{translations.notifications}</TabsTrigger>
          <TabsTrigger value="security">{translations.security}</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{translations.account}</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{translations.language}</Label>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                        <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{translations.timezone}</Label>
                    <select 
                      className="w-full h-10 px-3 py-2 border rounded-md border-gray-300"
                      defaultValue="est"
                    >
                      <option value="est">Eastern Standard Time (EST)</option>
                      <option value="cst">Central Standard Time (CST)</option>
                      <option value="mst">Mountain Standard Time (MST)</option>
                      <option value="pst">Pacific Standard Time (PST)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button>{translations.saveChanges}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">{translations.dangerZone}</CardTitle>
              <CardDescription>
                {translations.deleteAccountWarning}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="destructive"
                onClick={handleDeleteAccount}
                disabled={isDeleting}
              >
                {isDeleting ? translations.deleting : translations.deleteAccount}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{translations.notifications}</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{translations.emailNotifications}</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications for important updates
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications}
                    onCheckedChange={handleEmailNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{translations.appointmentReminders}</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders about upcoming appointments
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.appointmentReminders}
                    onCheckedChange={() => handleSwitchChange("appointmentReminders")}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{translations.prescriptionReminders}</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminders about prescription refills
                    </p>
                  </div>
                  <Switch 
                    checked={notificationSettings.prescriptionReminders}
                    onCheckedChange={() => handleSwitchChange("prescriptionReminders")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{translations.security}</CardTitle>
              <CardDescription>Update your security settings</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label>{translations.currentPassword}</Label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>{translations.newPassword}</Label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => {
                      setPasswordData(prev => ({ ...prev, newPassword: e.target.value }));
                      setPasswordErrors(prev => ({ ...prev, newPassword: undefined }));
                    }}
                    required
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>{translations.confirmPassword}</Label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => {
                      setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }));
                      setPasswordErrors(prev => ({ ...prev, confirmPassword: undefined }));
                    }}
                    required
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : translations.updatePassword}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
