import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock, History, Key, AlertTriangle, Download, Trash2 } from 'lucide-react';
import { useSecurity } from '@/hooks/useSecurity';
import { useGDPR } from '@/hooks/useGDPR';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SecuritySettings() {
  const {
    sessions,
    auditLogs,
    loading: securityLoading,
    is2FAEnabled,
    enable2FA,
    verify2FACode,
    disable2FA,
    revokeSession,
  } = useSecurity();

  const {
    preferences,
    loading: gdprLoading,
    exporting,
    deleting,
    updatePreferences,
    exportUserData,
    deleteAccount,
  } = useGDPR();

  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCode, setQrCode] = useState<any>(null);
  const [verificationCode, setVerificationCode] = useState('');

  const handle2FAEnable = async () => {
    const result = await enable2FA();
    if (result) {
      setQrCode(result);
      setShow2FASetup(true);
    }
  };

  const handleVerify2FA = async () => {
    if (qrCode && verificationCode) {
      const success = await verify2FACode(qrCode.id, verificationCode);
      if (success) {
        setShow2FASetup(false);
        setQrCode(null);
        setVerificationCode('');
      }
    }
  };

  if (securityLoading || gdprLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Chargement des paramètres de sécurité...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="h-8 w-8" />
          Sécurité et Confidentialité
        </h1>
        <p className="text-muted-foreground mt-2">
          Gérez la sécurité de votre compte et vos données personnelles
        </p>
      </div>

      <Tabs defaultValue="2fa" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="2fa">
            <Lock className="h-4 w-4 mr-2" />
            2FA
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Key className="h-4 w-4 mr-2" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="audit">
            <History className="h-4 w-4 mr-2" />
            Audit
          </TabsTrigger>
          <TabsTrigger value="gdpr">
            <AlertTriangle className="h-4 w-4 mr-2" />
            RGPD
          </TabsTrigger>
        </TabsList>

        {/* 2FA Tab */}
        <TabsContent value="2fa">
          <Card>
            <CardHeader>
              <CardTitle>Authentification à deux facteurs (2FA)</CardTitle>
              <CardDescription>
                Ajoutez une couche de sécurité supplémentaire à votre compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Statut 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    {is2FAEnabled ? 'Activé' : 'Désactivé'}
                  </p>
                </div>
                <Badge variant={is2FAEnabled ? 'default' : 'secondary'}>
                  {is2FAEnabled ? 'Actif' : 'Inactif'}
                </Badge>
              </div>

              {!is2FAEnabled && !show2FASetup && (
                <Button onClick={handle2FAEnable}>
                  <Lock className="h-4 w-4 mr-2" />
                  Activer le 2FA
                </Button>
              )}

              {show2FASetup && qrCode && (
                <div className="space-y-4 border rounded-lg p-4">
                  <p className="text-sm font-medium">1. Scannez ce QR code avec votre application d'authentification</p>
                  <div className="flex justify-center p-4 bg-white rounded-lg">
                    <img src={qrCode.totp.qr_code} alt="QR Code 2FA" className="max-w-[200px]" />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">2. Entrez le code de vérification</p>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="000000"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        maxLength={6}
                      />
                      <Button onClick={handleVerify2FA}>
                        Vérifier
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sessions Tab */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Sessions actives</CardTitle>
              <CardDescription>
                Gérez les appareils connectés à votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{session.user_agent || 'Appareil inconnu'}</p>
                      <p className="text-sm text-muted-foreground">
                        IP: {session.ip_address as string || 'Non disponible'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Dernière activité: {format(new Date(session.session_start), 'Pp', { locale: fr })}
                      </p>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => revokeSession(session.id)}
                    >
                      Révoquer
                    </Button>
                  </div>
                ))}
                {sessions.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune session active
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Audit Tab */}
        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Journal d'audit</CardTitle>
              <CardDescription>
                Historique des actions sur votre compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{log.event_type}</p>
                      <p className="text-sm text-muted-foreground">
                        {JSON.stringify(log.event_details).substring(0, 50)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.created_at), 'Pp', { locale: fr })}
                      </p>
                    </div>
                    {log.ip_address && (
                      <Badge variant="outline">{log.ip_address as string}</Badge>
                    )}
                  </div>
                ))}
                {auditLogs.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Aucune action enregistrée
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GDPR Tab */}
        <TabsContent value="gdpr">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Préférences de confidentialité</CardTitle>
                <CardDescription>
                  Contrôlez l'utilisation de vos données
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Analytics</Label>
                    <p className="text-sm text-muted-foreground">
                      Autoriser la collecte de données d'utilisation anonymes
                    </p>
                  </div>
                  <Switch
                    checked={preferences?.analytics_opt_in || false}
                    onCheckedChange={(checked) => 
                      updatePreferences({ analytics_opt_in: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Rétention des données</Label>
                    <p className="text-sm text-muted-foreground">
                      Durée de conservation: {preferences?.retention_days || 365} jours
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vos droits RGPD</CardTitle>
                <CardDescription>
                  Exercez vos droits sur vos données personnelles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={exportUserData}
                  disabled={exporting}
                >
                  <Download className="h-4 w-4 mr-2" />
                  {exporting ? 'Export en cours...' : 'Télécharger mes données'}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start"
                      disabled={deleting}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={deleteAccount}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
