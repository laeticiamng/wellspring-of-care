import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Get JWT from header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Verify JWT and get user
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    const { userId } = await req.json();

    // Security: users can only delete their own data
    if (user.id !== userId) {
      throw new Error("Unauthorized: can only delete own data");
    }

    console.log(`Starting data deletion for user: ${userId}`);

    // Delete user data from all tables (cascade deletes will handle most)
    // Manual deletion for tables without CASCADE
    const deletionTasks = [
      supabaseClient.from("mood_entries").delete().eq("user_id", userId),
      supabaseClient.from("assessments").delete().eq("user_id", userId),
      supabaseClient.from("music_therapy_sessions").delete().eq("user_id", userId),
      supabaseClient.from("chat_conversations").delete().eq("user_id", userId),
      supabaseClient.from("badges").delete().eq("user_id", userId),
      supabaseClient.from("user_settings").delete().eq("user_id", userId),
      supabaseClient.from("user_achievements").delete().eq("user_id", userId),
      supabaseClient.from("emotional_scan_results").delete().eq("user_id", userId),
      supabaseClient.from("story_sessions").delete().eq("user_id", userId),
      supabaseClient.from("nyvee_sessions").delete().eq("user_id", userId),
      supabaseClient.from("implicit_tracking").delete().eq("user_id", userId),
      supabaseClient.from("notifications").delete().eq("user_id", userId),
      supabaseClient.from("ai_coach_sessions").delete().eq("user_id", userId),
      supabaseClient.from("aura_history").delete().eq("user_id", userId),
    ];

    const results = await Promise.allSettled(deletionTasks);
    
    // Log any failures
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        console.error(`Deletion task ${index} failed:`, result.reason);
      }
    });

    // Mark profile for deletion (soft delete, actual deletion after 30 days)
    const { error: profileError } = await supabaseClient
      .from("profiles")
      .update({ 
        deletion_scheduled_at: new Date().toISOString(),
        full_name: "[COMPTE SUPPRIMÉ]",
        bio: null,
      })
      .eq("id", userId);

    if (profileError) {
      console.error("Error marking profile for deletion:", profileError);
    }

    // Log the deletion request in admin_changelog
    await supabaseClient.from("admin_changelog").insert({
      action_type: "user_deletion_requested",
      table_name: "profiles",
      record_id: userId,
      metadata: {
        requested_at: new Date().toISOString(),
        scheduled_deletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
    });

    console.log(`User data deletion completed for: ${userId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Compte marqué pour suppression. Données supprimées sous 30 jours.",
        scheduledDeletion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("Error in delete-user-data function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: error.message === "Unauthorized" ? 401 : 500,
      }
    );
  }
});
