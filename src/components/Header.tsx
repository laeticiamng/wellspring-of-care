import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Heart, Menu, MessageCircle, Moon, Sun, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
          <div className="relative">
            <Heart className="h-8 w-8 text-primary animate-pulse-soft" />
            <div className="absolute inset-0 h-8 w-8 text-primary animate-glow opacity-50" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              EmotionsCare
            </h1>
            <p className="text-xs text-muted-foreground">Plateforme de bien-être</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Button 
            variant="ghost" 
            className={`text-foreground hover:text-primary ${isActive('/dashboard') ? 'text-primary bg-primary/10' : ''}`}
            asChild
          >
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <Button 
            variant="ghost" 
            className={`text-foreground hover:text-primary ${isActive('/journal') ? 'text-primary bg-primary/10' : ''}`}
            asChild
          >
            <Link to="/journal">Journal</Link>
          </Button>
          <Button 
            variant="ghost" 
            className={`text-foreground hover:text-primary ${isActive('/meditation') ? 'text-primary bg-primary/10' : ''}`}
            asChild
          >
            <Link to="/meditation">Méditation</Link>
          </Button>
          <Button 
            variant="ghost" 
            className={`text-foreground hover:text-primary ${isActive('/community') ? 'text-primary bg-primary/10' : ''}`}
            asChild
          >
            <Link to="/community">Communauté</Link>
          </Button>
          <Button 
            variant="ghost" 
            className={`text-foreground hover:text-primary ${isActive('/therapy') ? 'text-primary bg-primary/10' : ''}`}
            asChild
          >
            <Link to="/therapy">Thérapie</Link>
          </Button>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-gradient-secondary text-secondary-foreground">
              3
            </Badge>
          </Button>

          {/* Messages */}
          <Button variant="ghost" size="icon" className="relative">
            <MessageCircle className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-gradient-healing text-accent-foreground">
              2
            </Badge>
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
              <AvatarImage src="/api/placeholder/32/32" alt="User" />
              <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Sophie Martin</p>
              <p className="text-xs text-muted-foreground">Membre premium</p>
            </div>
          </div>

          {/* Mobile Menu */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;