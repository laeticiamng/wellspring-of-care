import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Heart, Menu, MessageCircle, Moon, Sun, User, LogOut, Settings as SettingsIcon, Building2 } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success("Déconnexion réussie");
    navigate("/");
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
        <nav className="hidden md:flex items-center space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Modules ▾
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuItem asChild>
                <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/nyvee" className="cursor-pointer">Nyvée - Bulle Respirante</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/scan" className="cursor-pointer">Scan émotionnel</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/music" className="cursor-pointer">Thérapie musicale</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/chat" className="cursor-pointer">Coach IA</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/journal" className="cursor-pointer">Journal</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/vr-breath" className="cursor-pointer">VR Breath</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/vr-galaxy" className="cursor-pointer">VR Galaxy</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/flash-glow" className="cursor-pointer">Flash Glow</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/breath" className="cursor-pointer">Breathwork</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/face-ar" className="cursor-pointer">AR Filters</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/bubble-beat" className="cursor-pointer">Bubble Beat</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/boss-grit" className="cursor-pointer">Boss Level Grit</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/mood-mixer" className="cursor-pointer">Mood Mixer</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/community" className="cursor-pointer">Communauté</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/leaderboard" className="cursor-pointer">Leaderboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/story-synth" className="cursor-pointer">Story Synth Lab</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/activity" className="cursor-pointer">Activity</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/weekly-bars" className="cursor-pointer">Weekly Bars</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/ambition-arcade" className="cursor-pointer">Ambition Arcade</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button 
            variant="ghost" 
            className={`text-foreground hover:text-primary ${isActive('/therapy') ? 'text-primary bg-primary/10' : ''}`}
            asChild
          >
            <Link to="/therapy">Thérapie</Link>
          </Button>
          <Button 
            variant="ghost" 
            className={`text-foreground hover:text-primary ${isActive('/pricing') ? 'text-primary bg-primary/10' : ''}`}
            asChild
          >
            <Link to="/pricing">Tarifs</Link>
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-3 hover:bg-primary/5">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium">{user?.email?.split('@')[0] || 'Utilisateur'}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/settings" className="cursor-pointer">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  Paramètres
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/organizations" className="cursor-pointer">
                  <Building2 className="mr-2 h-4 w-4" />
                  Organisations B2B
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
export { Header };