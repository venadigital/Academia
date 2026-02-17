import type { SupabaseClient } from "@supabase/supabase-js";

type AlertSupabase = SupabaseClient;

async function hasActiveAlert(
  supabase: AlertSupabase,
  patientId: string,
  alertType: string
) {
  const { data } = await supabase
    .from("alerts")
    .select("id")
    .eq("patient_id", patientId)
    .eq("alert_type", alertType)
    .eq("status", "active")
    .maybeSingle();
  return Boolean(data);
}

export async function sweepAlerts(supabase: AlertSupabase) {
  const { data: patients, error } = await supabase
    .from("patients")
    .select("id, center_id")
    .eq("status", "active");

  if (error || !patients) {
    throw error ?? new Error("No se pudieron cargar pacientes");
  }

  const now = new Date();
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(now.getDate() - 7);

  const fourteenDaysAgo = new Date(now);
  fourteenDaysAgo.setDate(now.getDate() - 14);

  for (const patient of patients) {
    const { data: painEvents } = await supabase
      .from("pain_events")
      .select("intensity, occurred_at")
      .eq("patient_id", patient.id)
      .gte("occurred_at", twoDaysAgo.toISOString());

    const criticalCount = (painEvents ?? []).filter(
      (event) => (event.intensity ?? 0) >= 8
    ).length;

    if (criticalCount >= 5) {
      const exists = await hasActiveAlert(
        supabase,
        patient.id,
        "critical_pain"
      );
      if (!exists) {
        await supabase.from("alerts").insert({
          center_id: patient.center_id,
          patient_id: patient.id,
          alert_type: "critical_pain",
          priority: "critical",
          status: "active",
          triggered_at: new Date().toISOString(),
          summary: "Dolor crítico repetido (≥8) 5+ veces en 2 días.",
        });
      }
    }

    const { data: recentEvents } = await supabase
      .from("pain_events")
      .select("intensity, occurred_at")
      .eq("patient_id", patient.id)
      .gte("occurred_at", sevenDaysAgo.toISOString());

    const { data: priorEvents } = await supabase
      .from("pain_events")
      .select("intensity, occurred_at")
      .eq("patient_id", patient.id)
      .gte("occurred_at", fourteenDaysAgo.toISOString())
      .lt("occurred_at", sevenDaysAgo.toISOString());

    const avg = (events: { intensity: number | null }[]) => {
      if (!events.length) return 0;
      const sum = events.reduce((acc, e) => acc + (e.intensity ?? 0), 0);
      return sum / events.length;
    };

    const recentAvg = avg(recentEvents ?? []);
    const priorAvg = avg(priorEvents ?? []);

    if (recentAvg - priorAvg >= 2 && recentEvents && priorEvents) {
      const exists = await hasActiveAlert(supabase, patient.id, "pain_trend");
      if (!exists) {
        await supabase.from("alerts").insert({
          center_id: patient.center_id,
          patient_id: patient.id,
          alert_type: "pain_trend",
          priority: "medium",
          status: "active",
          triggered_at: new Date().toISOString(),
          summary: `Tendencia de dolor al alza (+${(recentAvg - priorAvg).toFixed(1)}).`,
        });
      }
    }
  }
}
