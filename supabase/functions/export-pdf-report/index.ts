import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { reportType, startDate, endDate } = await req.json();

    console.log(`Generating ${reportType} PDF report for user:`, user.id);

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get activities in date range
    const { data: activities } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate)
      .lte('created_at', endDate)
      .order('created_at', { ascending: false });

    // Get emotional scans
    const { data: scans } = await supabase
      .from('emotional_scans')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    // Get insights
    const { data: insights } = await supabase
      .from('user_insights')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', startDate)
      .lte('created_at', endDate);

    // Calculate statistics
    const stats = {
      totalActivities: activities?.length || 0,
      totalScans: scans?.length || 0,
      totalInsights: insights?.length || 0,
      activityTypes: activities?.reduce((acc: Record<string, number>, act) => {
        acc[act.activity_type] = (acc[act.activity_type] || 0) + 1;
        return acc;
      }, {}) || {},
      dominantEmotion: (scans && scans.length > 0) ? 
        Object.entries(
          scans.reduce((acc: Record<string, number>, scan) => {
            acc[scan.top_emotion] = (acc[scan.top_emotion] || 0) + 1;
            return acc;
          }, {})
        ).sort(([, a], [, b]) => (b as number) - (a as number))[0]?.[0] : 'N/A',
    };

    // Generate HTML report
    const htmlReport = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Rapport ${reportType} - ${profile?.full_name || 'Utilisateur'}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px;
          color: #333;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #6366f1;
          padding-bottom: 20px;
          margin-bottom: 40px;
        }
        h1 {
          color: #6366f1;
          margin: 0;
        }
        .subtitle {
          color: #666;
          margin-top: 10px;
        }
        .section {
          margin-bottom: 30px;
          padding: 20px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        .section h2 {
          color: #6366f1;
          margin-top: 0;
        }
        .stat {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e0e0e0;
        }
        .stat:last-child {
          border-bottom: none;
        }
        .stat-label {
          font-weight: 600;
        }
        .stat-value {
          color: #6366f1;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          color: #666;
          font-size: 0.9em;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Rapport ${reportType}</h1>
        <div class="subtitle">
          ${profile?.full_name || 'Utilisateur'}<br>
          Période: ${new Date(startDate).toLocaleDateString('fr-FR')} - ${new Date(endDate).toLocaleDateString('fr-FR')}
        </div>
      </div>

      <div class="section">
        <h2>📊 Statistiques générales</h2>
        <div class="stat">
          <span class="stat-label">Total d'activités</span>
          <span class="stat-value">${stats.totalActivities}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Scans émotionnels</span>
          <span class="stat-value">${stats.totalScans}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Insights générés</span>
          <span class="stat-value">${stats.totalInsights}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Émotion dominante</span>
          <span class="stat-value">${stats.dominantEmotion}</span>
        </div>
      </div>

      <div class="section">
        <h2>🎯 Répartition des activités</h2>
        ${Object.entries(stats.activityTypes).map(([type, count]) => `
          <div class="stat">
            <span class="stat-label">${type.replace(/_/g, ' ')}</span>
            <span class="stat-value">${count}</span>
          </div>
        `).join('')}
      </div>

      ${insights && insights.length > 0 ? `
      <div class="section">
        <h2>💡 Insights clés</h2>
        ${insights.slice(0, 5).map(insight => `
          <div style="margin-bottom: 15px; padding: 15px; background: white; border-radius: 5px;">
            <div style="font-weight: 600; color: #6366f1;">${insight.title}</div>
            <div style="margin-top: 5px; color: #666;">${insight.description}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div class="footer">
        Généré le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}<br>
        Ce rapport est confidentiel et destiné uniquement à ${profile?.full_name || 'l\'utilisateur'}
      </div>
    </body>
    </html>
    `;

    // In a production environment, you would use a PDF generation library here
    // For now, we'll return the HTML which can be printed to PDF by the browser
    return new Response(htmlReport, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="rapport-${reportType}-${new Date().toISOString().split('T')[0]}.html"`,
      },
      status: 200,
    });

  } catch (error) {
    console.error('Error in export-pdf-report:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
