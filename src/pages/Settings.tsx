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
import { User, Bell, Lock, CreditCard, Shield, Palette, Sparkles, HelpCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useSettings } from "@/hooks/useSettings";
import { setImplicitTracking, getImplicitTrackingState } from "@/lib/implicitAssess";

const Settings = () => {
  const { user } = useAuth();
  const { profile, preferences, loading, updateProfile, updatePreferences } = useSettings();
  
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
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="mr-2 h-4 w-4" />
              Sécurité
            </TabsTrigger>
            <TabsTrigger value="billing">
              <CreditCard className="mr-2 h-4 w-4" />
              Facturation
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
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez des updates par email
                    </p>
                  </div>
                  <Switch
                    checked={preferencesData.email_notifications}
                    onCheckedChange={(checked) =>
                      setPreferencesData({ ...preferencesData, email_notifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications activées</Label>
                    <p className="text-sm text-muted-foreground">
                      Recevez des notifications sur votre appareil
                    </p>
                  </div>
                  <Switch
                    checked={preferencesData.notifications_enabled}
                    onCheckedChange={(checked) =>
                      setPreferencesData({ ...preferencesData, notifications_enabled: checked })
                    }
                  />
                </div>

                <Button 
                  className="bg-gradient-primary"
                  onClick={handleSavePreferences}
                  disabled={loading}
                >
                  {loading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Personalization Tab - Added to Security tab */}
          <TabsContent value="security">
            <div className="space-y-6">
              {/* Existing Security Card */}
              <Card className="border-0 shadow-soft">
                <CardHeader>
                  <CardTitle>Sécurité et confidentialité</CardTitle>
                  <CardDescription>
                    Gérez vos paramètres de sécurité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Changer le mot de passe</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                          <Input id="currentPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                          <Input id="newPassword" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                          <Input id="confirmPassword" type="password" />
                        </div>
                        <Button className="bg-gradient-primary">
                          Mettre à jour le mot de passe
                        </Button>
                      </div>
                    </div>

                    <div className="pt-6 border-t">
                      <div className="flex items-start space-x-4">
                        <Shield className="h-6 w-6 text-primary mt-1" />
                        <div className="flex-1">
                          <h3 className="font-medium mb-2">Authentification à deux facteurs</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Ajoutez une couche de sécurité supplémentaire à votre compte
                          </p>
                          <Button variant="outline">Activer 2FA</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* NEW: Personalization Card */}
              <Card className="border-0 shadow-soft bg-gradient-healing/10 border border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>Personnalisation bien-être</span>
                  </CardTitle>
                  <CardDescription>
                    Améliorez votre expérience grâce à l'adaptation automatique
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1 flex-1">
                      <h4 className="font-medium">Adaptation intelligente</h4>
                      <p className="text-sm text-muted-foreground">
                        L'app s'adapte discrètement à vos préférences d'utilisation pour vous offrir des suggestions plus pertinentes
                      </p>
                    </div>
                    <Switch
                      checked={implicitTracking}
                      onCheckedChange={(checked) => {
                        setImplicitTrackingState(checked);
                        setImplicitTracking(checked);
                        toast(checked ? "Personnalisation activée" : "Personnalisation désactivée", {
                          description: checked 
                            ? "L'app s'adaptera progressivement à vos préférences"
                            : "Les adaptations automatiques sont désactivées"
                        });
                      }}
                    />
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg space-y-2">
                    <h5 className="font-medium text-sm">Comment ça marche ?</h5>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>Analyse de vos interactions (modules préférés, durées, choix)</li>
                      <li>Suggestions personnalisées selon votre rythme</li>
                      <li>Aucun questionnaire - tout se fait naturellement</li>
                      <li>Données chiffrées uniquement, anonymes et sécurisées</li>
                      <li>Vous gardez le contrôle total</li>
                    </ul>
                  </div>

                  <Button variant="outline" className="w-full" asChild>
                    <a href="#" onClick={(e) => { e.preventDefault(); toast("Page en construction"); }}>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      En savoir plus sur la personnalisation
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Facturation et abonnement</CardTitle>
                <CardDescription>
                  Gérez votre abonnement et moyens de paiement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-gradient-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Plan Gratuit</h3>
                      <p className="text-sm text-muted-foreground">
                        Accès aux fonctionnalités de base
                      </p>
                    </div>
                    <Button className="bg-gradient-secondary">
                      Passer à Premium
                    </Button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Moyens de paiement</h3>
                  <Button variant="outline">Ajouter une carte</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Tab */}
          <TabsContent value="appearance">
            <Card className="border-0 shadow-soft">
              <CardHeader>
                <CardTitle>Apparence</CardTitle>
                <CardDescription>
                  Personnalisez l'apparence de l'application
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-base mb-4 block">Thème</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Card className="cursor-pointer hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="aspect-video bg-background rounded-md mb-2" />
                          <p className="text-sm font-medium">Clair</p>
                        </CardContent>
                      </Card>
                      <Card className="cursor-pointer hover:border-primary transition-colors">
                        <CardContent className="p-4">
                          <div className="aspect-video bg-foreground rounded-md mb-2" />
                          <p className="text-sm font-medium">Sombre</p>
                        </CardContent>
                      </Card>
                    </div>
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
