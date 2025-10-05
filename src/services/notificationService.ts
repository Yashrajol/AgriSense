import { NASAData, Advisory } from "@/types";

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  timestamp: Date;
  read: boolean;
  type: 'weather' | 'advisory' | 'irrigation' | 'harvest' | 'general';
  priority: 'high' | 'medium' | 'low';
}

export interface WeatherAlert {
  type: 'temperature' | 'precipitation' | 'wind' | 'humidity';
  severity: 'low' | 'moderate' | 'high' | 'extreme';
  message: string;
  action: string;
  validUntil: Date;
}

export interface AdvisoryAlert {
  type: 'irrigation' | 'fertilization' | 'pest_control' | 'harvest_timing';
  priority: 'urgent' | 'important' | 'scheduled';
  message: string;
  action: string;
  validUntil: Date;
}

class NotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private notifications: PushNotification[] = [];
  private isSupported: boolean = false;

  constructor() {
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator;
    this.loadStoredNotifications();
  }

  /**
   * Initialize the notification service
   */
  async initialize(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service worker registered successfully');

      // Check if we can use push messaging
      if ('PushManager' in window) {
        console.log('Push messaging is supported');
      }

      return true;
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      return false;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported) {
      return { granted: false, denied: true, default: false };
    }

    try {
      const permission = await Notification.requestPermission();
      
      return {
        granted: permission === 'granted',
        denied: permission === 'denied',
        default: permission === 'default'
      };
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return { granted: false, denied: true, default: false };
    }
  }

  /**
   * Check current notification permission status
   */
  getPermissionStatus(): NotificationPermission {
    if (!this.isSupported) {
      return { granted: false, denied: true, default: false };
    }

    const permission = Notification.permission;
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default'
    };
  }

  /**
   * Send a push notification
   */
  async sendNotification(notification: Omit<PushNotification, 'id' | 'timestamp' | 'read'>): Promise<boolean> {
    if (!this.isSupported || !this.getPermissionStatus().granted) {
      console.warn('Notifications not supported or permission not granted');
      return false;
    }

    try {
      const fullNotification: PushNotification = {
        ...notification,
        id: this.generateId(),
        timestamp: new Date(),
        read: false
      };

      // Store notification
      this.notifications.unshift(fullNotification);
      this.saveNotifications();

      // Show browser notification
      const browserNotification = new Notification(notification.title, {
        body: notification.body,
        icon: notification.icon || '/favicon.ico',
        badge: notification.badge || '/favicon.ico',
        tag: notification.tag,
        data: notification.data,
        requireInteraction: notification.priority === 'high'
      });

      // Handle notification click
      browserNotification.onclick = () => {
        window.focus();
        browserNotification.close();
        this.markAsRead(fullNotification.id);
      };

      // Auto-close after 5 seconds for low priority notifications
      if (notification.priority === 'low') {
        setTimeout(() => {
          browserNotification.close();
        }, 5000);
      }

      return true;
    } catch (error) {
      console.error('Failed to send notification:', error);
      return false;
    }
  }

  /**
   * Generate weather alerts based on NASA data
   */
  generateWeatherAlerts(nasaData: NASAData): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];

    // Temperature alerts
    if (nasaData.temperature < 0) {
      alerts.push({
        type: 'temperature',
        severity: 'extreme',
        message: 'Extreme cold warning: Temperature below freezing',
        action: 'Protect sensitive crops with frost covers',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
    } else if (nasaData.temperature > 40) {
      alerts.push({
        type: 'temperature',
        severity: 'extreme',
        message: 'Extreme heat warning: Temperature above 40°C',
        action: 'Increase irrigation frequency and provide shade',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
    } else if (nasaData.temperature > 35) {
      alerts.push({
        type: 'temperature',
        severity: 'high',
        message: 'High temperature alert: Temperature above 35°C',
        action: 'Monitor soil moisture and consider additional irrigation',
        validUntil: new Date(Date.now() + 12 * 60 * 60 * 1000)
      });
    }

    // Precipitation alerts
    if (nasaData.precipitation > 50) {
      alerts.push({
        type: 'precipitation',
        severity: 'high',
        message: 'Heavy rainfall expected: Over 50mm precipitation',
        action: 'Check drainage systems and avoid field work',
        validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000)
      });
    } else if (nasaData.precipitation < 5 && nasaData.soilMoisture < 30) {
      alerts.push({
        type: 'precipitation',
        severity: 'moderate',
        message: 'Drought conditions: Low precipitation and soil moisture',
        action: 'Schedule irrigation and monitor crop stress',
        validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
      });
    }

    // Soil moisture alerts
    if (nasaData.soilMoisture < 20) {
      alerts.push({
        type: 'humidity',
        severity: 'high',
        message: 'Critical soil moisture: Below 20%',
        action: 'Immediate irrigation required',
        validUntil: new Date(Date.now() + 2 * 60 * 60 * 1000)
      });
    } else if (nasaData.soilMoisture > 90) {
      alerts.push({
        type: 'humidity',
        severity: 'moderate',
        message: 'Excessive soil moisture: Above 90%',
        action: 'Check drainage and avoid overwatering',
        validUntil: new Date(Date.now() + 6 * 60 * 60 * 1000)
      });
    }

    return alerts;
  }

  /**
   * Generate advisory alerts based on advisories
   */
  generateAdvisoryAlerts(advisories: Advisory[]): AdvisoryAlert[] {
    const alerts: AdvisoryAlert[] = [];

    advisories.forEach(advisory => {
      if (advisory.status === 'alert') {
        alerts.push({
          type: this.mapAdvisoryType(advisory.type),
          priority: 'urgent',
          message: advisory.message,
          action: advisory.action || 'Take immediate action',
          validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000)
        });
      } else if (advisory.status === 'caution') {
        alerts.push({
          type: this.mapAdvisoryType(advisory.type),
          priority: 'important',
          message: advisory.message,
          action: advisory.action || 'Monitor and plan action',
          validUntil: new Date(Date.now() + 48 * 60 * 60 * 1000)
        });
      }
    });

    return alerts;
  }

  /**
   * Send weather alerts as notifications
   */
  async sendWeatherAlerts(nasaData: NASAData): Promise<void> {
    const alerts = this.generateWeatherAlerts(nasaData);

    for (const alert of alerts) {
      await this.sendNotification({
        title: `Weather Alert: ${alert.type.toUpperCase()}`,
        body: alert.message,
        type: 'weather',
        priority: alert.severity === 'extreme' ? 'high' : alert.severity === 'high' ? 'medium' : 'low',
        tag: `weather-${alert.type}`,
        data: { alert, nasaData }
      });
    }
  }

  /**
   * Send advisory alerts as notifications
   */
  async sendAdvisoryAlerts(advisories: Advisory[]): Promise<void> {
    const alerts = this.generateAdvisoryAlerts(advisories);

    for (const alert of alerts) {
      await this.sendNotification({
        title: `Advisory Alert: ${alert.type.replace('_', ' ').toUpperCase()}`,
        body: alert.message,
        type: 'advisory',
        priority: alert.priority === 'urgent' ? 'high' : 'medium',
        tag: `advisory-${alert.type}`,
        data: { alert, advisories }
      });
    }
  }

  /**
   * Send scheduled notifications (daily summaries, weekly reports)
   */
  async sendScheduledNotifications(nasaData: NASAData, advisories: Advisory[]): Promise<void> {
    // Daily weather summary
    await this.sendNotification({
      title: 'Daily Weather Summary',
      body: `Temperature: ${nasaData.temperature}°C, Precipitation: ${nasaData.precipitation}mm, Soil Moisture: ${nasaData.soilMoisture}%`,
      type: 'general',
      priority: 'low',
      tag: 'daily-summary'
    });

    // Weekly advisory summary
    const urgentAdvisories = advisories.filter(a => a.status === 'alert');
    if (urgentAdvisories.length > 0) {
      await this.sendNotification({
        title: 'Weekly Advisory Summary',
        body: `${urgentAdvisories.length} urgent advisories require attention`,
        type: 'advisory',
        priority: 'medium',
        tag: 'weekly-summary'
      });
    }
  }

  /**
   * Get all notifications
   */
  getNotifications(): PushNotification[] {
    return [...this.notifications];
  }

  /**
   * Get unread notifications
   */
  getUnreadNotifications(): PushNotification[] {
    return this.notifications.filter(n => !n.read);
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveNotifications();
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): void {
    this.notifications.forEach(n => n.read = true);
    this.saveNotifications();
  }

  /**
   * Clear old notifications (older than 7 days)
   */
  clearOldNotifications(): void {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    this.notifications = this.notifications.filter(n => n.timestamp > weekAgo);
    this.saveNotifications();
  }

  /**
   * Clear all notifications
   */
  clearAllNotifications(): void {
    this.notifications = [];
    this.saveNotifications();
  }

  /**
   * Subscribe to push notifications (for future implementation)
   */
  async subscribeToPush(): Promise<PushSubscription | null> {
    if (!this.registration || !('PushManager' in window)) {
      return null;
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(
          process.env.VITE_VAPID_PUBLIC_KEY || ''
        )
      });

      return subscription;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribeFromPush(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to unsubscribe from push notifications:', error);
      return false;
    }
  }

  // Private helper methods
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private mapAdvisoryType(type: string): AdvisoryAlert['type'] {
    switch (type.toLowerCase()) {
      case 'irrigation': return 'irrigation';
      case 'fertilization': return 'fertilization';
      case 'pest_control': return 'pest_control';
      case 'harvest_timing': return 'harvest_timing';
      default: return 'irrigation';
    }
  }

  private loadStoredNotifications(): void {
    try {
      const stored = localStorage.getItem('agrisense-notifications');
      if (stored) {
        this.notifications = JSON.parse(stored).map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }));
      }
    } catch (error) {
      console.error('Failed to load stored notifications:', error);
      this.notifications = [];
    }
  }

  private saveNotifications(): void {
    try {
      localStorage.setItem('agrisense-notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Create singleton instance
const notificationService = new NotificationService();

export default notificationService;
