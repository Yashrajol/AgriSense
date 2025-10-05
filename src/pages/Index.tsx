import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import LocationDisplay from "@/components/LocationDisplay";
import AdvisoryPanel from "@/components/AdvisoryPanel";
import WeatherCard from "@/components/WeatherCard";
import CropPredictor from "@/components/CropPredictor";
import CommunityFeed from "@/components/CommunityFeed";
import FieldDiary from "@/components/FieldDiary";
import PlantScheduleChat from "@/components/PlantScheduleChat";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import EducationalContent from "@/components/EducationalContent";
import ContactUs from "@/components/ContactUs";
import NotificationCenter from "@/components/NotificationCenter";
import NotificationBell from "@/components/NotificationBell";
import AuthModal from "@/components/auth/AuthModal";
import GamificationPanel from "@/components/GamificationPanel";
import FarmGames from "@/components/FarmGames";
import FunFactsSection from "@/components/FunFactsSection";
import SuccessStories from "@/components/SuccessStories";
import InteractiveTutorials from "@/components/InteractiveTutorials";
import FarmerDashboard from "@/components/FarmerDashboard";
import { useTranslation } from "react-i18next";
import { getMockNASAData, getAdvisories, getCropSuggestions } from "@/utils/mockNasaData";
import { NASAData, Advisory, CropSuggestion } from "@/types";
import { getCurrentLocation } from "@/utils/locationService";
import { useAuth } from "@/contexts/AuthContext";
import notificationService from "@/services/notificationService";
import heroImage from "@/assets/hero-farmland.jpg";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [nasaData, setNasaData] = useState<NASAData | null>(null);
  const [advisories, setAdvisories] = useState<Advisory[]>([]);
  const [cropSuggestions, setCropSuggestions] = useState<CropSuggestion[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect unauthenticated users to landing page
    if (!authLoading && !user) {
      navigate('/');
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    // Only initialize if user is authenticated
    if (!user) return;

    // Initialize notification service
    const initNotifications = async () => {
      await notificationService.initialize();
    };

    // Fetch NASA data with location
    const fetchData = async () => {
      try {
        // Get user location first
        const location = await getCurrentLocation();
        const data = await getMockNASAData(location);
        setNasaData(data);
        const advisoriesData = getAdvisories(data);
        setAdvisories(advisoriesData);
        setCropSuggestions(getCropSuggestions());

        // Send notifications for weather alerts and advisories
        await notificationService.sendWeatherAlerts(data);
        await notificationService.sendAdvisoryAlerts(advisoriesData);
      } catch (error) {
        console.error('Failed to fetch NASA data:', error);
        // Use fallback data
        const data = await getMockNASAData();
        setNasaData(data);
        const advisoriesData = getAdvisories(data);
        setAdvisories(advisoriesData);
        setCropSuggestions(getCropSuggestions());

        // Send notifications even with fallback data
        await notificationService.sendWeatherAlerts(data);
        await notificationService.sendAdvisoryAlerts(advisoriesData);
      }
    };

    initNotifications();
    fetchData();

    // Set up periodic notifications (every 6 hours)
    const notificationInterval = setInterval(async () => {
      if (nasaData && advisories.length > 0) {
        await notificationService.sendScheduledNotifications(nasaData, advisories);
      }
    }, 6 * 60 * 60 * 1000); // 6 hours

    return () => clearInterval(notificationInterval);
  }, []); // Remove dependencies to prevent re-fetching

  const renderContent = () => {
    if (!nasaData) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case "dashboard":
        return <FarmerDashboard />;

      case "advisory":
        return (
          <div className="space-y-6">
            <AdvisoryPanel advisories={advisories} />
            <WeatherCard data={nasaData} />
          </div>
        );

      case "weather":
        return (
          <div className="space-y-6">
            <WeatherCard data={nasaData} />
            <LocationDisplay />
          </div>
        );

      case "crops":
        return <CropPredictor suggestions={cropSuggestions} />;

      case "planner":
        return <PlantScheduleChat />;

      case "community":
        return <CommunityFeed />;

      case "diary":
        return <FieldDiary />;

      case "analytics":
        return <AnalyticsDashboard nasaData={nasaData} />;

      case "education":
        return <EducationalContent />;

      case "contact":
        return <ContactUs />;

      case "games":
        return <FarmGames />;

      case "achievements":
        return <GamificationPanel />;

      case "funfacts":
        return <FunFactsSection />;

      case "stories":
        return <SuccessStories />;

      case "tutorials":
        return <InteractiveTutorials />;

      default:
        return null;
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show loading while redirecting
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation 
        activeSection={activeSection} 
        onSectionChange={setActiveSection}
        onAuthClick={() => setAuthModalOpen(true)}
        notificationBell={
          <NotificationBell onOpenNotificationCenter={() => setNotificationCenterOpen(true)} />
        }
      />
      
      <main className="pt-16 pb-24 lg:pt-0 lg:pb-0 lg:pl-64 min-h-screen">
        <div className="container max-w-6xl mx-auto px-4 py-6 md:py-8 overflow-x-hidden">
          {renderContent()}
        </div>
      </main>

      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <NotificationCenter 
        isOpen={notificationCenterOpen}
        onClose={() => setNotificationCenterOpen(false)}
      />
    </div>
  );
};

export default Index;
