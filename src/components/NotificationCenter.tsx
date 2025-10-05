import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Bell, 
  BellOff, 
  Settings, 
  Trash2, 
  Check, 
  AlertTriangle, 
  Info, 
  Droplets, 
  Thermometer, 
  CloudRain,
  Sprout,
  Calendar,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import notificationService, { PushNotification, NotificationPermission } from "@/services/notificationService";

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>({ granted: false, denied: false, default: false });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      loadNotifications();
      checkPermission();
    }
  }, [isOpen]);

  const loadNotifications = () => {
    const allNotifications = notificationService.getNotifications();
    setNotifications(allNotifications);
  };

  const checkPermission = () => {
    const currentPermission = notificationService.getPermissionStatus();
    setPermission(currentPermission);
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

  const markAsRead = (notificationId: string) => {
    notificationService.markAsRead(notificationId);
    loadNotifications();
  };

  const markAllAsRead = () => {
    notificationService.markAllAsRead();
    loadNotifications();
    toast({
      title: "All Notifications Read",
      description: "All notifications have been marked as read.",
    });
  };

  const clearAll = () => {
    notificationService.clearAllNotifications();
    loadNotifications();
    toast({
      title: "Notifications Cleared",
      description: "All notifications have been cleared.",
    });
  };

  const clearOld = () => {
    notificationService.clearOldNotifications();
    loadNotifications();
    toast({
      title: "Old Notifications Cleared",
      description: "Notifications older than 7 days have been cleared.",
    });
  };

  const getNotificationIcon = (type: PushNotification['type']) => {
    switch (type) {
      case 'weather':
        return <CloudRain className="h-4 w-4" />;
      case 'advisory':
        return <AlertTriangle className="h-4 w-4" />;
      case 'irrigation':
        return <Droplets className="h-4 w-4" />;
      case 'harvest':
        return <Sprout className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: PushNotification['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTypeColor = (type: PushNotification['type']) => {
    switch (type) {
      case 'weather':
        return 'text-blue-600';
      case 'advisory':
        return 'text-orange-600';
      case 'irrigation':
        return 'text-cyan-600';
      case 'harvest':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const weatherNotifications = notifications.filter(n => n.type === 'weather');
  const advisoryNotifications = notifications.filter(n => n.type === 'advisory');
  const otherNotifications = notifications.filter(n => !['weather', 'advisory'].includes(n.type));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <CardTitle>Notification Center</CardTitle>
            {unreadCount > 0 && (
              <Badge variant="destructive">{unreadCount}</Badge>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={requestPermission}
              disabled={loading || permission.granted}
            >
              {permission.granted ? (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  Enabled
                </>
              ) : (
                <>
                  <BellOff className="h-4 w-4 mr-2" />
                  Enable
                </>
              )}
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <Tabs defaultValue="all" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="weather">Weather ({weatherNotifications.length})</TabsTrigger>
              <TabsTrigger value="advisory">Advisory ({advisoryNotifications.length})</TabsTrigger>
              <TabsTrigger value="other">Other ({otherNotifications.length})</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="all" className="h-full overflow-hidden">
                <NotificationList
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  getNotificationIcon={getNotificationIcon}
                  getPriorityColor={getPriorityColor}
                  getTypeColor={getTypeColor}
                  formatTimestamp={formatTimestamp}
                />
              </TabsContent>

              <TabsContent value="weather" className="h-full overflow-hidden">
                <NotificationList
                  notifications={weatherNotifications}
                  onMarkAsRead={markAsRead}
                  getNotificationIcon={getNotificationIcon}
                  getPriorityColor={getPriorityColor}
                  getTypeColor={getTypeColor}
                  formatTimestamp={formatTimestamp}
                />
              </TabsContent>

              <TabsContent value="advisory" className="h-full overflow-hidden">
                <NotificationList
                  notifications={advisoryNotifications}
                  onMarkAsRead={markAsRead}
                  getNotificationIcon={getNotificationIcon}
                  getPriorityColor={getPriorityColor}
                  getTypeColor={getTypeColor}
                  formatTimestamp={formatTimestamp}
                />
              </TabsContent>

              <TabsContent value="other" className="h-full overflow-hidden">
                <NotificationList
                  notifications={otherNotifications}
                  onMarkAsRead={markAsRead}
                  getNotificationIcon={getNotificationIcon}
                  getPriorityColor={getPriorityColor}
                  getTypeColor={getTypeColor}
                  formatTimestamp={formatTimestamp}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>

        <div className="border-t p-4 flex items-center justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-2" />
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" onClick={clearOld}>
              <Calendar className="h-4 w-4 mr-2" />
              Clear Old
            </Button>
            <Button variant="outline" size="sm" onClick={clearAll}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {notifications.length} total notifications
          </div>
        </div>
      </Card>
    </div>
  );
};

interface NotificationListProps {
  notifications: PushNotification[];
  onMarkAsRead: (id: string) => void;
  getNotificationIcon: (type: PushNotification['type']) => React.ReactNode;
  getPriorityColor: (priority: PushNotification['priority']) => string;
  getTypeColor: (type: PushNotification['type']) => string;
  formatTimestamp: (timestamp: Date) => string;
}

const NotificationList = ({
  notifications,
  onMarkAsRead,
  getNotificationIcon,
  getPriorityColor,
  getTypeColor,
  formatTimestamp
}: NotificationListProps) => {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
        <Bell className="h-8 w-8 mb-2 opacity-50" />
        <p>No notifications</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="space-y-2 p-2">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
              !notification.read ? 'bg-blue-50 border-blue-200' : 'bg-background'
            }`}
            onClick={() => onMarkAsRead(notification.id)}
          >
            <div className="flex items-start space-x-3">
              <div className={`flex-shrink-0 ${getTypeColor(notification.type)}`}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium truncate">{notification.title}</h4>
                  <div className="flex items-center space-x-2">
                    <Badge className={getPriorityColor(notification.priority)}>
                      {notification.priority}
                    </Badge>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.body}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">
                    {formatTimestamp(notification.timestamp)}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {notification.type}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationCenter;
