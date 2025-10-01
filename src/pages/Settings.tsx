import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bell, Lock, Palette, Sparkles, HelpCircle, Eye, Volume2, Smartphone } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useSettings } from "@/hooks/useSettings";
import { useUserSettings } from "@/hooks/useUserSettings";
import { setImplicitTracking, getImplicitTrackingState } from "@/lib/implicitAssess";

const Settings = () => {
  const { user } = useAuth();
  const { profile, preferences, loading, updateProfile, updatePreferences } = useSettings();
  const { settings, updateSettings } = useUserSettings();
  
  const [profileData, setProfileData] = useState({
    full_name: "",
    bio: "",
  });

  const [preferencesData, setPreferencesData] = useState({
    theme: "light",
    language: "fr",
    notifications_enabled: true,
    email_notifications: true,
  });
  
  const [implicitTracking, setImplicitTrackingState] = useState(true);

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: profile.full_name || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (preferences) {
      setPreferencesData({
        theme: preferences.theme,
        language: preferences.language,
        notifications_enabled: preferences.notifications_enabled,
        email_notifications: preferences.email_notifications,
      });
    }
    // Charger l'état du tracking implicite
    setImplicitTrackingState(getImplicitTrackingState());
  }, [preferences]);

  const handleSaveProfile = async () => {
    const success = await updateProfile(profileData);
    if (success) {
      toast.success("Profil mis à jour avec succès !");
    } else {
      toast.error("Erreur lors de la mise à jour du profil");
    }
  };

  const handleSavePreferences = async () => {
    const success = await updatePreferences(preferencesData);
    if (success) {
      toast.success("Préférences mises à jour !");
    } else {
      toast.error("Erreur lors de la mise à jour");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-calm">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">
            Gérez votre compte et vos préférences
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="accessibility">
              <Eye className="mr-2 h-4 w-4" />
              Accessibilité
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Palette className="mr-2 h-4 w-4" />
              Apparence
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Informations personnelles</CardTitle>
                <CardDescription>
                  Mettez à jour vos informations de profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-gradient-primary text-primary-foreground text-2xl">
                      {user?.email?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Changer la photo</Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={user?.email || ''} disabled />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input 
                      id="fullName" 
                      placeholder="Votre nom complet" 
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      placeholder="Parlez-nous de vous..."
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    />
                  </div>

                  <Button 
                    className="bg-gradient-primary" 
                    onClick={handleSaveProfile}
                    disabled={loading}
                  >
                    {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Accessibility Tab */}
          <TabsContent value="accessibility">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Accessibilité</CardTitle>
                <CardDescription>
                  Personnalisez votre expérience pour qu'elle soit confortable
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mode faible stimulation</Label>
                    <p className="text-sm text-muted-foreground">
                      Réduit les animations et effets visuels
                    </p>
                  </div>
                  <Switch
                    checked={settings?.low_stim_mode ?? false}
                    onCheckedChange={(checked) => updateSettings({ low_stim_mode: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Synthèse vocale (TTS)</Label>
                    <p className="text-sm text-muted-foreground">
                      Lecture audio des textes importants
                    </p>
                  </div>
                  <Switch
                    checked={settings?.tts_enabled ?? false}
                    onCheckedChange={(checked) => updateSettings({ tts_enabled: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Contraste élevé</Label>
                    <p className="text-sm text-muted-foreground">
                      Améliore la lisibilité des textes
                    </p>
                  </div>
                  <Switch
                    checked={settings?.high_contrast ?? false}
                    onCheckedChange={(checked) => updateSettings({ high_contrast: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Retours haptiques</Label>
                    <p className="text-sm text-muted-foreground">
                      Vibrations douces lors des interactions
                    </p>
                  </div>
                  <Switch
                    checked={settings?.haptics_enabled ?? false}
                    onCheckedChange={(checked) => updateSettings({ haptics_enabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Préférences de notifications</CardTitle>
                <CardDescription>
                  Choisissez comment vous souhaitez être notifié
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rappels Nyvée 🌙</Label>
                    <p className="text-sm text-muted-foreground">
                      Suggestions douces pour prendre soin de toi
                    </p>
                  </div>
                  <Switch
                    checked={settings?.nyvee_reminders ?? true}
                    onCheckedChange={(checked) => updateSettings({ nyvee_reminders: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Pauses Screen Silk 👁️</Label>
                    <p className="text-sm text-muted-foreground">
                      Rappels pour reposer tes yeux
                    </p>
                  </div>
                  <Switch
                    checked={settings?.screen_silk_reminders ?? true}
                    onCheckedChange={(checked) => updateSettings({ screen_silk_reminders: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rappels journal 📖</Label>
                    <p className="text-sm text-muted-foreground">
                      Moments pour écrire tes émotions
                    </p>
                  </div>
                  <Switch
                    checked={settings?.journal_reminders ?? true}
                    onCheckedChange={(checked) => updateSettings({ journal_reminders: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personalization & Consents */}
          <TabsContent value="privacy">
            <Card className="border-0 shadow-soft bg-gradient-healing/10 border border-accent/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Confidentialité & Consentements</span>
                </CardTitle>
                <CardDescription>
                  Contrôlez vos données et vos préférences cliniques
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1 flex-1">
                    <h4 className="font-medium">Adaptation intelligente</h4>
                    <p className="text-sm text-muted-foreground">
                      L'app s'adapte discrètement à vos préférences d'utilisation
                    </p>
                  </div>
                  <Switch
                    checked={implicitTracking}
                    onCheckedChange={(checked) => {
                      setImplicitTrackingState(checked);
                      setImplicitTracking(checked);
                      toast(checked ? "Personnalisation activée" : "Personnalisation désactivée");
                    }}
                  />
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h4 className="font-medium">Consentements cliniques</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>WHO-5 (bien-être hebdo)</Label>
                      <p className="text-sm text-muted-foreground">Carte tarot émotionnelle</p>
                    </div>
                    <Switch
                      checked={settings?.consent_who5 ?? true}
                      onCheckedChange={(checked) => updateSettings({ consent_who5: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>PANAS (humeur journal)</Label>
                      <p className="text-sm text-muted-foreground">Pages émotionnelles</p>
                    </div>
                    <Switch
                      checked={settings?.consent_panas ?? true}
                      onCheckedChange={(checked) => updateSettings({ consent_panas: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Agrégation anonyme</Label>
                      <p className="text-sm text-muted-foreground">Données anonymes pour améliorer l'expérience</p>
                    </div>
                    <Switch
                      checked={settings?.consent_anonymous_aggregation ?? true}
                      onCheckedChange={(checked) => updateSettings({ consent_anonymous_aggregation: checked })}
                    />
                  </div>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <h5 className="font-medium text-sm">🔒 Engagement confidentialité</h5>
                  <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                    <li>Jamais de score affiché → badges verbaux uniquement</li>
                    <li>Aucune donnée revendue</li>
                    <li>100% implicite, science OMS</li>
                    <li>Vous gardez le contrôle total</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Ambiances visuelles</CardTitle>
                <CardDescription>
                  Choisis la palette qui te ressemble
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Label className="text-base mb-4 block">Palette émotionnelle</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Card 
                      className={`cursor-pointer hover:border-primary transition-all ${
                        settings?.theme_palette === 'clair' ? 'border-primary ring-2 ring-primary/20' : ''
                      }`}
                      onClick={() => updateSettings({ theme_palette: 'clair' })}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-background to-accent/20 rounded-md mb-2" />
                        <p className="text-sm font-medium">Clair 🌅</p>
                      </CardContent>
                    </Card>
                    <Card 
                      className={`cursor-pointer hover:border-primary transition-all ${
                        settings?.theme_palette === 'sombre' ? 'border-primary ring-2 ring-primary/20' : ''
                      }`}
                      onClick={() => updateSettings({ theme_palette: 'sombre' })}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-foreground to-primary/20 rounded-md mb-2" />
                        <p className="text-sm font-medium">Sombre 🌙</p>
                      </CardContent>
                    </Card>
                    <Card 
                      className={`cursor-pointer hover:border-primary transition-all ${
                        settings?.theme_palette === 'pastel' ? 'border-primary ring-2 ring-primary/20' : ''
                      }`}
                      onClick={() => updateSettings({ theme_palette: 'pastel' })}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-pink-100 via-blue-100 to-green-100 rounded-md mb-2" />
                        <p className="text-sm font-medium">Pastel 🌸</p>
                      </CardContent>
                    </Card>
                    <Card 
                      className={`cursor-pointer hover:border-primary transition-all ${
                        settings?.theme_palette === 'monochrome' ? 'border-primary ring-2 ring-primary/20' : ''
                      }`}
                      onClick={() => updateSettings({ theme_palette: 'monochrome' })}
                    >
                      <CardContent className="p-4">
                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-300 rounded-md mb-2" />
                        <p className="text-sm font-medium">Monochrome ⚫</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Settings;
