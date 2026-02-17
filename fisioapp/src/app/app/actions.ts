"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sweepAlerts } from "@/lib/alerts";

export async function createPatient(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const firstName = String(formData.get("first_name") ?? "").trim();
  const lastName = String(formData.get("last_name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone_whatsapp") ?? "").trim();
  const pathology = String(formData.get("primary_pathology") ?? "").trim();
  const professionalId = String(formData.get("professional_id") ?? "").trim();

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("center_id")
    .eq("is_active", true)
    .single();

  if (!roleRow) {
    return { error: "No se encontró centro activo." };
  }

  const { data: patient, error } = await supabase
    .from("patients")
    .insert({
      center_id: roleRow.center_id,
      first_name: firstName,
      last_name: lastName,
      email,
      phone_whatsapp: phone,
      primary_pathology: pathology,
      status: "active",
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  if (professionalId) {
    await supabase.from("patient_assignments").insert({
      patient_id: patient.id,
      professional_id: professionalId,
      assignment_role: "primary",
    });
  }

  revalidatePath("/app/patients");
  return { data: patient };
}

export async function createExercise(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const source = String(formData.get("source") ?? "youtube").trim();
  const sourceUrl = String(formData.get("source_url") ?? "").trim();
  const segment = String(formData.get("segment") ?? "").trim();
  const goal = String(formData.get("goal") ?? "").trim();
  const phase = String(formData.get("phase") ?? "").trim();

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("center_id")
    .eq("is_active", true)
    .single();

  if (!roleRow) {
    return { error: "No se encontró centro activo." };
  }

  const { data: exercise, error } = await supabase
    .from("exercise_library")
    .insert({
      center_id: roleRow.center_id,
      title,
      description,
      source,
      source_url: sourceUrl,
      segment,
      goal,
      phase,
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/app/exercises");
  return { data: exercise };
}

export async function createAppointment(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const patientId = String(formData.get("patient_id") ?? "").trim();
  const professionalId = String(formData.get("professional_id") ?? "").trim();
  const startsAt = String(formData.get("starts_at") ?? "").trim();
  const duration = Number(formData.get("duration") ?? 45);
  const appointmentType = String(formData.get("appointment_type") ?? "session");

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("center_id")
    .eq("is_active", true)
    .single();

  if (!roleRow) {
    return { error: "No se encontró centro activo." };
  }

  const { error } = await supabase.from("appointments").insert({
    center_id: roleRow.center_id,
    patient_id: patientId,
    professional_id: professionalId,
    starts_at: startsAt,
    duration_minutes: duration,
    appointment_type: appointmentType,
    status: "scheduled",
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/app/agenda");
  return { ok: true };
}

export async function createPainEvent(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const patientId = String(formData.get("patient_id") ?? "").trim();
  const intensity = Number(formData.get("intensity") ?? 0);
  const location = String(formData.get("location") ?? "").trim();
  const trigger = String(formData.get("trigger") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const note = String(formData.get("note") ?? "").trim();

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("center_id")
    .eq("is_active", true)
    .single();

  if (!roleRow) {
    return { error: "No se encontró centro activo." };
  }

  const { error } = await supabase.from("pain_events").insert({
    center_id: roleRow.center_id,
    patient_id: patientId,
    intensity,
    location,
    trigger,
    duration,
    note,
    occurred_at: new Date().toISOString(),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/app/patients/${patientId}`);
  return { ok: true };
}

export async function createSession(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const patientId = String(formData.get("patient_id") ?? "").trim();
  const sessionType = String(formData.get("session_type") ?? "therapeutic");
  const subjective = String(formData.get("subjective") ?? "").trim();
  const objective = String(formData.get("objective") ?? "").trim();
  const assessment = String(formData.get("assessment") ?? "").trim();
  const plan = String(formData.get("plan") ?? "").trim();
  const painBefore = Number(formData.get("pain_before") ?? 0);
  const painAfter = Number(formData.get("pain_after") ?? 0);

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("center_id")
    .eq("is_active", true)
    .single();

  if (!roleRow) {
    return { error: "No se encontró centro activo." };
  }

  const { error } = await supabase.from("sessions").insert({
    center_id: roleRow.center_id,
    patient_id: patientId,
    session_type: sessionType,
    subjective,
    objective,
    assessment,
    plan,
    pain_before: painBefore,
    pain_after: painAfter,
    started_at: new Date().toISOString(),
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath(`/app/patients/${patientId}`);
  return { ok: true };
}

export async function createPlan(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const patientId = String(formData.get("patient_id") ?? "").trim();
  const exerciseId = String(formData.get("exercise_id") ?? "").trim();
  const expectedPerWeek = Number(formData.get("expected_per_week") ?? 3);
  const notes = String(formData.get("notes") ?? "").trim();

  const { data: roleRow } = await supabase
    .from("user_roles")
    .select("center_id")
    .eq("is_active", true)
    .single();

  if (!roleRow) {
    return { error: "No se encontró centro activo." };
  }

  const { data: plan, error } = await supabase
    .from("exercise_plans")
    .insert({
      center_id: roleRow.center_id,
      patient_id: patientId,
      status: "active",
      start_date: new Date().toISOString(),
      notes,
    })
    .select()
    .single();

  if (error || !plan) {
    return { error: error?.message ?? "No se pudo crear plan" };
  }

  await supabase.from("plan_exercises").insert({
    center_id: roleRow.center_id,
    plan_id: plan.id,
    exercise_id: exerciseId,
    expected_per_week: expectedPerWeek,
  });

  revalidatePath(`/app/patients/${patientId}`);
  return { ok: true };
}

export async function resolveAlert(formData: FormData) {
  const supabase = createSupabaseServerClient();
  const alertId = String(formData.get("alert_id") ?? "").trim();
  const action = String(formData.get("action") ?? "").trim();

  await supabase
    .from("alerts")
    .update({ status: "resolved", resolved_at: new Date().toISOString() })
    .eq("id", alertId);

  if (action) {
    await supabase.from("alert_events").insert({
      alert_id: alertId,
      action,
    });
  }

  revalidatePath("/app/alerts");
  return { ok: true };
}

export async function runAlertSweep() {
  const supabase = createSupabaseServerClient();
  await sweepAlerts(supabase);
  revalidatePath("/app/alerts");
  return { ok: true };
}
