import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orgId, month } = await req.json();

    if (!orgId || !month) {
      throw new Error("orgId and month are required");
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch team assessments for the org
    const { data: assessments, error: assessError } = await supabase
      .from("team_assessments")
      .select("*")
      .eq("org_id", orgId)
      .eq("period", month)
      .order("team_name");

    if (assessError) throw assessError;

    // Fetch manager actions
    const { data: actions, error: actionsError } = await supabase
      .from("manager_actions")
      .select("*")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false });

    if (actionsError) throw actionsError;

    // Generate simple HTML report (you can enhance this with proper PDF library)
    const htmlReport = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Rapport RH - ${month}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f4f4f4; }
            .status-pending { color: orange; }
            .status-completed { color: green; }
          </style>
        </head>
        <body>
          <h1>Rapport RH - ${month}</h1>
          
          <h2>Évaluations d'équipe</h2>
          <table>
            <thead>
              <tr>
                <th>Équipe</th>
                <th>Phrases</th>
                <th>Réponses</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${assessments.map(a => `
                <tr>
                  <td>${a.team_name}</td>
                  <td>${a.phrases?.[0] || 'N/A'}</td>
                  <td>${a.response_count}</td>
                  <td>${new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <h2>Actions Manager</h2>
          <table>
            <thead>
              <tr>
                <th>Action</th>
                <th>Catégorie</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              ${actions.map(a => `
                <tr>
                  <td>${a.action_title}</td>
                  <td>${a.category}</td>
                  <td class="status-${a.status}">${a.status}</td>
                  <td>${new Date(a.created_at).toLocaleDateString()}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <footer>
            <p>Généré le ${new Date().toLocaleString()}</p>
            <p>EmotionsCare - Rapport confidentiel</p>
          </footer>
        </body>
      </html>
    `;

    return new Response(
      JSON.stringify({
        html: htmlReport,
        filename: `rapport-rh-${month}.html`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error generating PDF:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
