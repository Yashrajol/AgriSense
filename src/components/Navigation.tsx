import { useState } from "react";
import { Menu, X, Home, TrendingUp, Cloud, Sprout, MessageSquare, Users, BookOpen, Settings, LogIn, User, GraduationCap, Mail, Gamepad2, Trophy, Lightbulb, Award, PlayCircle } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onAuthClick: () => void;
  notificationBell?: React.ReactNode;
}

const Navigation = ({ activeSection, onSectionChange, onAuthClick, notificationBell }: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  const navItems = [
    { id: 'dashboard', label: t('navigation.dashboard'), icon: Home },
    { id: 'advisory', label: t('navigation.advisory'), icon: TrendingUp },
    { id: 'weather', label: t('navigation.weather'), icon: Cloud },
    { id: 'crops', label: t('navigation.crops'), icon: Sprout },
    { id: 'planner', label: t('navigation.planner'), icon: MessageSquare },
    { id: 'community', label: t('navigation.community'), icon: Users },
    { id: 'diary', label: t('navigation.diary'), icon: BookOpen },
    { id: 'analytics', label: t('navigation.analytics'), icon: TrendingUp },
    { id: 'education', label: t('navigation.education'), icon: GraduationCap },
    { id: 'games', label: t('navigation.games'), icon: Gamepad2 },
    { id: 'achievements', label: t('navigation.achievements'), icon: Trophy },
    { id: 'funfacts', label: 'Fun Facts', icon: Lightbulb },
    { id: 'stories', label: 'Success Stories', icon: Award },
    { id: 'tutorials', label: 'Interactive Tutorials', icon: PlayCircle },
    { id: 'contact', label: t('navigation.contact'), icon: Mail },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card border-b border-border lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-xl font-bold text-primary">{t('app.title')}</h1>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            {notificationBell}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-16 lg:hidden">
          <nav className="flex flex-col gap-2 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className="justify-start gap-3"
                  onClick={() => {
                    onSectionChange(item.id);
                    setMobileMenuOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 flex-col bg-card border-r border-border">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold text-primary">{t('app.title')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('app.subtitle')}</p>
          <div className="mt-4">
            <LanguageSwitcher />
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  className="justify-start gap-3"
                  onClick={() => onSectionChange(item.id)}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </div>
        </nav>
        <div className="p-4 border-t border-border">
          {user ? (
            <div className="space-y-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-start gap-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">
                        {user.user_metadata?.full_name || user.email}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {user.user_metadata?.farm_name || 'Farmer'}
                      </span>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    {t('common.profile')}
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    {t('common.settings')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => signOut()}
                    className="text-red-600"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    {t('common.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-3"
              onClick={onAuthClick}
            >
              <LogIn className="h-5 w-5" />
              {t('common.signIn')}
            </Button>
          )}
        </div>
      </aside>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border lg:hidden">
        <div className="flex justify-around items-center py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
