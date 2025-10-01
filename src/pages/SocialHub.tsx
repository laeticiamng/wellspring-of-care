import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CommunityFeed } from '@/components/CommunityFeed';
import { SupportGroupsList } from '@/components/SupportGroupsList';
import { Users, Heart } from 'lucide-react';

export default function SocialHub() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Hub Social</h1>
        <p className="text-muted-foreground">
          Connectez-vous avec d'autres personnes et partagez votre parcours
        </p>
      </div>

      <Tabs defaultValue="feed" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="feed" className="gap-2">
            <Heart className="h-4 w-4" />
            Fil d'actualité
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-2">
            <Users className="h-4 w-4" />
            Groupes de soutien
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feed">
          <CommunityFeed />
        </TabsContent>

        <TabsContent value="groups">
          <SupportGroupsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
