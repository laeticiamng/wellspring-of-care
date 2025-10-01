import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Building2, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';

export default function Organizations() {
  const navigate = useNavigate();

  const { data: memberships, isLoading } = useQuery({
    queryKey: ['org-memberships'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('org_memberships')
        .select(`
          *,
          organizations (
            id,
            name,
            logo_url
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  const managerOrgs = memberships?.filter(m => 
    m.role === 'manager' || m.role === 'admin'
  );

  return (
    <>
      <Helmet>
        <title>Organisations - Emotions Care</title>
        <meta name="description" content="Gérez vos organisations et accédez aux tableaux de bord managers" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Mes organisations</h1>

          {!managerOrgs || managerOrgs.length === 0 ? (
            <Card className="p-8 text-center">
              <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground mb-4">
                Vous n'avez pas encore accès à un tableau de bord manager
              </p>
              <p className="text-sm text-muted-foreground">
                Contactez votre administrateur pour obtenir les droits d'accès
              </p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {managerOrgs.map(membership => {
                const org = membership.organizations as any;
                return (
                  <Card
                    key={membership.id}
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(`/app/rh?org=${org.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {org.logo_url ? (
                          <img
                            src={org.logo_url}
                            alt={org.name}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-primary" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{org.name}</h3>
                          <p className="text-sm text-muted-foreground capitalize">
                            {membership.role}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Équipe : {membership.team_name}
                    </p>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
