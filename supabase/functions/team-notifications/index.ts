import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  orgId: string;
  notificationType: 'threshold' | 'weekly' | 'monthly';
  teamId?: string;
}

async function sendEmail(to: string, subject: string, html: string) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${resendApiKey}`,
    },
    body: JSON.stringify({
      from: "EmotionsCare Notifications <notifications@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to send email: ${error}`);
  }

  return response.json();
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { orgId, notificationType, teamId }: NotificationRequest = await req.json();

    console.log("Processing team notification:", { orgId, notificationType, teamId });

    // Récupérer les managers de l'organisation
    const { data: managers, error: managersError } = await supabaseClient
      .from("profiles")
      .select("id, email, full_name")
      .eq("org_id", orgId)
      .in("role", ["manager_b2b", "admin"]);

    if (managersError) throw managersError;

    if (!managers || managers.length === 0) {
      return new Response(
        JSON.stringify({ message: "No managers found for this organization" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Récupérer les données de l'équipe selon le type de notification
    let notificationData: any = {};
    let emailSubject = "";
    let emailBody = "";

    if (notificationType === "threshold") {
      // Alerte seuil dépassé
      const { data: teamData } = await supabaseClient
        .from("team_emotion_summary")
        .select("*")
        .eq("org_id", orgId)
        .eq("team_id", teamId)
        .order("date", { ascending: false })
        .limit(1)
        .single();

      emailSubject = "⚠️ Alerte: Seuil de bien-être dépassé";
      emailBody = `
        <h2>Alerte Équipe</h2>
        <p>Une équipe de votre organisation nécessite votre attention.</p>
        <div style="background: #FEF3C7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Détails</h3>
          <p><strong>Équipe:</strong> ${teamData?.team_name || "N/A"}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
          <p>Des indicateurs de bien-être nécessitent votre attention.</p>
        </div>
        <p>Connectez-vous au tableau de bord RH pour plus de détails.</p>
      `;
    } else if (notificationType === "weekly") {
      // Rapport hebdomadaire
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      
      const { data: weeklyData } = await supabaseClient
        .from("team_emotion_summary")
        .select("*")
        .eq("org_id", orgId)
        .gte("date", startDate.toISOString())
        .order("date", { ascending: false });

      emailSubject = "📊 Rapport hebdomadaire - EmotionsCare";
      emailBody = `
        <h2>Rapport Hebdomadaire</h2>
        <p>Voici le résumé de la semaine dernière pour votre organisation.</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Statistiques</h3>
          <p><strong>Nombre d'entrées:</strong> ${weeklyData?.length || 0}</p>
          <p><strong>Période:</strong> ${startDate.toLocaleDateString('fr-FR')} - ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        <p>Consultez le tableau de bord pour l'analyse complète.</p>
      `;
    } else if (notificationType === "monthly") {
      // Rapport mensuel
      const startDate = new Date();
      startDate.setDate(1);
      
      const { data: monthlyData } = await supabaseClient
        .from("team_emotion_summary")
        .select("*")
        .eq("org_id", orgId)
        .gte("date", startDate.toISOString())
        .order("date", { ascending: false });

      emailSubject = "📈 Rapport mensuel - EmotionsCare";
      emailBody = `
        <h2>Rapport Mensuel</h2>
        <p>Résumé du mois en cours pour votre organisation.</p>
        <div style="background: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Vue d'ensemble</h3>
          <p><strong>Nombre d'entrées:</strong> ${monthlyData?.length || 0}</p>
          <p><strong>Mois:</strong> ${new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</p>
        </div>
        <p>Connectez-vous pour voir les tendances et analyses détaillées.</p>
      `;
    }

    // Envoyer l'email à tous les managers
    const emailPromises = managers.map(manager =>
      sendEmail(
        manager.email,
        emailSubject,
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #4F46E5; color: white; padding: 20px; text-align: center;">
              <h1>EmotionsCare</h1>
            </div>
            <div style="padding: 20px;">
              ${emailBody}
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #E5E7EB;">
                <a href="${Deno.env.get("SUPABASE_URL")}/app/rh-dashboard" 
                   style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px;">
                  Voir le tableau de bord
                </a>
              </div>
            </div>
            <div style="background: #F9FAFB; padding: 20px; text-align: center; color: #6B7280; font-size: 12px;">
              <p>EmotionsCare - Plateforme de bien-être en entreprise</p>
            </div>
          </div>
        `
      )
    );

    await Promise.all(emailPromises);

    console.log(`Sent ${managers.length} notifications for ${notificationType}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        notificationsSent: managers.length,
        type: notificationType 
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error sending team notifications:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
