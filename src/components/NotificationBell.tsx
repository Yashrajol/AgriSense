import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Bell, BellOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import notificationService, { NotificationPermission } from "@/services/notificationService";

interface NotificationBellProps {
  onOpenNotificationCenter: () => void;
}

const NotificationBell = ({ onOpenNotificationCenter }: NotificationBellProps) => {
  const [permission, setPermission] = useState<NotificationPermission>({ granted: false, denied: false, default: false });
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkPermission();
    updateUnreadCount();
    
    // Check for unread notifications every 30 seconds
    const interval = setInterval(updateUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const checkPermission = () => {
    const currentPermission = notificationService.getPermissionStatus();
    setPermission(currentPermission);
  };

  const updateUnreadCount = () => {
    const unreadNotifications = notificationService.getUnreadNotifications();
    setUnreadCount(unreadNotifications.length);
  };

  const requestPermission = async () => {
    setLoading(true);
    try {
      const newPermission = await notificationService.requestPermission();
      setPermission(newPermission);
      
      if (newPermission.granted) {
        toast({
          title: "Notifications Enabled",
          description: "You'll now receive weather alerts and advisory updates.",
        });
        updateUnreadCount();
      } else if (newPermission.denied) {
        toast({
          title: "Notifications Disabled",
          description: "You can enable notifications in your browser settings.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Failed to request permission:', error);
      toast({
        title: "Error",
        description: "Failed to request notification permission.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClick = () => {
    if (!permission.granted && !permission.denied) {
      requestPermission();
    } else {
      onOpenNotificationCenter();
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleClick}
        disabled={loading}
        className="relative"
      >
        {permission.granted ? (
          <Bell className="h-4 w-4" />
        ) : (
          <BellOff className="h-4 w-4" />
        )}
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
    </div>
  );
};

export default NotificationBell;
