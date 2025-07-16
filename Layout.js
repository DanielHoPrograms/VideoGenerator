
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  Video, 
  Sparkles, 
  Crown, 
  Menu, 
  X, 
  User as UserIcon, 
  LogOut,
  Globe,
  Home,
  Play,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const translations = {
  en: {
    home: "Home",
    generate: "Generate",
    dashboard: "Dashboard",
    pricing: "Pricing",
    login: "Login",
    logout: "Logout",
    profile: "Profile",
    language: "Language",
    videosLeft: "videos left today",
    unlimited: "Unlimited",
    upgrade: "Upgrade"
  },
  zh: {
    home: "首页",
    generate: "生成视频",
    dashboard: "仪表板",
    pricing: "定价",
    login: "登录",
    logout: "退出",
    profile: "个人资料",
    language: "语言",
    videosLeft: "今日剩余视频",
    unlimited: "无限制",
    upgrade: "升级"
  }
};

const subscriptionLimits = {
  free: 1,
  pro: 5,
  ultimate: 999
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(true);

  const t = translations[language];

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setLanguage(userData.preferred_language || "en");
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
      window.location.href = createPageUrl("Home");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const switchLanguage = async (newLang) => {
    setLanguage(newLang);
    if (user) {
      try {
        await User.updateMyUserData({ preferred_language: newLang });
      } catch (error) {
        console.error("Failed to update language:", error);
      }
    }
  };

  const getRemainingVideos = () => {
    if (!user) return 0;
    
    const tier = user.subscription_tier || 'free';
    const limit = subscriptionLimits[tier];

    const today = new Date().toISOString().split('T')[0];
    const lastGenDate = user.last_generation_date;
    
    // Reset count if it's a new day
    if (lastGenDate !== today) {
      return limit;
    }
    
    return Math.max(0, limit - (user.videos_generated_today || 0));
  };

  const getSubscriptionColor = (tier) => {
    switch (tier) {
      case 'pro': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      case 'ultimate': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      default: return 'bg-gradient-to-r from-gray-400 to-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="bg-black/20 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                <Video className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                VideoAI
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                to={createPageUrl("Home")} 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  location.pathname === createPageUrl("Home") 
                    ? 'bg-purple-500/20 text-purple-300' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Home className="w-4 h-4" />
                {t.home}
              </Link>
              
              {user && (
                <Link 
                  to={createPageUrl("Generate")} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    location.pathname === createPageUrl("Generate") 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  {t.generate}
                </Link>
              )}
              
              {user && (
                <Link 
                  to={createPageUrl("Dashboard")} 
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                    location.pathname === createPageUrl("Dashboard") 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  {t.dashboard}
                </Link>
              )}
              
              <Link 
                to={createPageUrl("Pricing")} 
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  location.pathname === createPageUrl("Pricing") 
                    ? 'bg-purple-500/20 text-purple-300' 
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                {t.pricing}
              </Link>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-4">
              {user ? (
                <>
                  {/* Usage Indicator */}
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                    <Badge className={`${getSubscriptionColor(user.subscription_tier)} text-white border-0`}>
                      {(user.subscription_tier || "free").toUpperCase()}
                    </Badge>
                    <span className="text-sm text-gray-300">
                      {user.subscription_tier === 'ultimate' ? t.unlimited : `${getRemainingVideos()} ${t.videosLeft}`}
                    </span>
                  </div>

                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
                        <UserIcon className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700">
                      <div className="p-2">
                        <p className="text-sm font-medium text-white">{user.full_name}</p>
                        <p className="text-xs text-gray-400">{user.email}</p>
                      </div>
                      <DropdownMenuSeparator className="bg-slate-700" />
                      
                      <DropdownMenuItem className="text-gray-300 focus:bg-slate-700 focus:text-white">
                        <Globe className="w-4 h-4 mr-2" />
                        {t.language}
                        <div className="ml-auto flex gap-1">
                          <button
                            onClick={() => switchLanguage('en')}
                            className={`px-2 py-1 text-xs rounded ${language === 'en' ? 'bg-purple-500 text-white' : 'bg-slate-600 text-gray-300'}`}
                          >
                            EN
                          </button>
                          <button
                            onClick={() => switchLanguage('zh')}
                            className={`px-2 py-1 text-xs rounded ${language === 'zh' ? 'bg-purple-500 text-white' : 'bg-slate-600 text-gray-300'}`}
                          >
                            中文
                          </button>
                        </div>
                      </DropdownMenuItem>
                      
                      <DropdownMenuSeparator className="bg-slate-700" />
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        className="text-red-400 focus:bg-slate-700 focus:text-red-300"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        {t.logout}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button 
                  onClick={() => User.login()}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0"
                >
                  {t.login}
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-gray-300 hover:text-white"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/40 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-4 space-y-2">
              <Link 
                to={createPageUrl("Home")} 
                className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.home}
              </Link>
              {user && (
                <Link 
                  to={createPageUrl("Generate")} 
                  className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.generate}
                </Link>
              )}
              {user && (
                <Link 
                  to={createPageUrl("Dashboard")} 
                  className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t.dashboard}
                </Link>
              )}
              <Link 
                to={createPageUrl("Pricing")} 
                className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => setIsMenuOpen(false)}
              >
                {t.pricing}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
