import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  translations: Record<string, string>;
}

const translations = {
  en: {
    // English translations
    'settings': 'Settings',
    'account': 'Account',
    'notifications': 'Notifications',
    'security': 'Security',
    'language': 'Language',
    'timezone': 'Time Zone',
    'saveChanges': 'Save Changes',
    'emailNotifications': 'Email Notifications',
    'appointmentReminders': 'Appointment Reminders',
    'prescriptionReminders': 'Prescription Reminders',
    'marketingEmails': 'Marketing Emails',
    'smsNotifications': 'SMS Notifications',
    'currentPassword': 'Current Password',
    'newPassword': 'New Password',
    'confirmPassword': 'Confirm Password',
    'updatePassword': 'Update Password',
    'deleteAccount': 'Delete Account',
    'dangerZone': 'Danger Zone',
    'deleteAccountWarning': 'Permanently delete your account and all associated data.',
    'deleting': 'Deleting...',
  },
  hi: {
    // Hindi translations
    'settings': 'सेटिंग्स',
    'account': 'खाता',
    'notifications': 'सूचनाएं',
    'security': 'सुरक्षा',
    'language': 'भाषा',
    'timezone': 'समय क्षेत्र',
    'saveChanges': 'परिवर्तन सहेजें',
    'emailNotifications': 'ईमेल सूचनाएं',
    'appointmentReminders': 'अपॉइंटमेंट रिमाइंडर्स',
    'prescriptionReminders': 'प्रिस्क्रिप्शन रिमाइंडर्स',
    'marketingEmails': 'मार्केटिंग ईमेल',
    'smsNotifications': 'एसएमएस सूचनाएं',
    'currentPassword': 'वर्तमान पासवर्ड',
    'newPassword': 'नया पासवर्ड',
    'confirmPassword': 'पासवर्ड की पुष्टि करें',
    'updatePassword': 'पासवर्ड अपडेट करें',
    'deleteAccount': 'खाता हटाएं',
    'dangerZone': 'खतरनाक क्षेत्र',
    'deleteAccountWarning': 'अपना खाता और सभी संबंधित डेटा स्थायी रूप से हटा दें।',
    'deleting': 'हटा रहा है...',
  },
  mr: {
    // Marathi translations
    'settings': 'सेटिंग्ज',
    'account': 'खाते',
    'notifications': 'सूचना',
    'security': 'सुरक्षा',
    'language': 'भाषा',
    'timezone': 'वेळ क्षेत्र',
    'saveChanges': 'बदल जतन करा',
    'emailNotifications': 'ईमेल सूचना',
    'appointmentReminders': 'अपॉइंटमेंट रिमाइंडर्स',
    'prescriptionReminders': 'प्रिस्क्रिप्शन रिमाइंडर्स',
    'marketingEmails': 'मार्केटिंग ईमेल',
    'smsNotifications': 'एसएमएस सूचना',
    'currentPassword': 'सध्याचा पासवर्ड',
    'newPassword': 'नवीन पासवर्ड',
    'confirmPassword': 'पासवर्डची पुष्टी करा',
    'updatePassword': 'पासवर्ड अपडेट करा',
    'deleteAccount': 'खाते हटवा',
    'dangerZone': 'धोकादायक क्षेत्र',
    'deleteAccountWarning': 'तुमचे खाते आणि सर्व संबंधित डेटा कायमस्वरूपी हटवा.',
    'deleting': 'हटवत आहे...',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 