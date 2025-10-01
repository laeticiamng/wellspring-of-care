import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.58.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InvitationEmailRequest {
  invitationId: string;
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
      from: "EmotionsCare <onboarding@resend.dev>",
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
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Authorization header required");
    }

    const { invitationId }: InvitationEmailRequest = await req.json();

    // Récupérer les détails de l'invitation
    const { data: invitation, error: invitationError } = await supabaseClient
      .from("invitations")
      .select(`
        *,
        organizations(name),
        teams(name)
      `)
      .eq("id", invitationId)
      .single();

    if (invitationError || !invitation) {
      throw new Error("Invitation not found");
    }

    const acceptUrl = `${Deno.env.get("SUPABASE_URL")}/accept-invitation?token=${invitation.token}`;

    const emailResponse = await sendEmail(
      invitation.email,
      `Invitation à rejoindre ${invitation.organizations?.name}`,
      `
        <h1>Vous êtes invité à rejoindre ${invitation.organizations?.name}</h1>
        <p>Vous avez été invité en tant que <strong>${invitation.role}</strong> dans l'équipe <strong>${invitation.teams?.name}</strong>.</p>
        <p>Cliquez sur le bouton ci-dessous pour accepter l'invitation :</p>
        <a href="${acceptUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">
          Accepter l'invitation
        </a>
        <p>Ou copiez ce lien dans votre navigateur :</p>
        <p style="color: #6B7280; font-size: 14px;">${acceptUrl}</p>
        <p style="margin-top: 30px; color: #6B7280; font-size: 12px;">Cette invitation expire le ${new Date(invitation.expires_at).toLocaleDateString('fr-FR')}.</p>
      `
    );

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({ success: true, messageId: emailResponse.id }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in send-invitation-email function:", error);
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
