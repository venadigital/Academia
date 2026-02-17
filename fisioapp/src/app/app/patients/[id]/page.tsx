import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { createPainEvent, createPlan, createSession } from "@/app/app/actions";

export default async function PatientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();

  const { data: patient } = await supabase
    .from("patients")
    .select("id, first_name, last_name, status, primary_pathology, phone_whatsapp, email")
    .eq("id", params.id)
    .single();

  if (!patient) {
    notFound();
  }

  const { data: painEvents } = await supabase
    .from("pain_events")
    .select("id, intensity, location, trigger, note, occurred_at")
    .eq("patient_id", params.id)
    .order("occurred_at", { ascending: false })
    .limit(6);

  const { data: plans } = await supabase
    .from("exercise_plans")
    .select("id, status, start_date, notes, plan_exercises(exercise_library(title))")
    .eq("patient_id", params.id)
    .order("start_date", { ascending: false });

  const { data: exercises } = await supabase
    .from("exercise_library")
    .select("id, title")
    .eq("is_archived", false)
    .order("title", { ascending: true });

  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, session_type, started_at, pain_before, pain_after, plan")
    .eq("patient_id", params.id)
    .order("started_at", { ascending: false })
    .limit(5);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {patient.first_name} {patient.last_name}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">
          <Badge variant="neutral">{patient.status}</Badge>
          <Badge variant="teal">{patient.primary_pathology ?? "Sin patología"}</Badge>
          <span className="text-sm text-[var(--muted)]">
            {patient.phone_whatsapp ?? "Sin WhatsApp"}
          </span>
          <span className="text-sm text-[var(--muted)]">
            {patient.email ?? "Sin email"}
          </span>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Registrar dolor</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createPainEvent} className="space-y-4">
              <input type="hidden" name="patient_id" value={patient.id} />
              <Field label="Intensidad (0-10)">
                <Input name="intensity" type="number" min={0} max={10} required />
              </Field>
              <Field label="Ubicación">
                <Input name="location" placeholder="Ej: lumbar" required />
              </Field>
              <Field label="Disparador">
                <Input name="trigger" placeholder="Ej: ejercicio, estrés" />
              </Field>
              <Field label="Duración">
                <Input name="duration" placeholder="Ej: 30 min" />
              </Field>
              <Field label="Nota">
                <Textarea name="note" rows={3} />
              </Field>
              <Button type="submit">Guardar evento</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos eventos de dolor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(painEvents ?? []).length === 0 ? (
              <p className="text-sm text-[var(--muted)]">Sin registros recientes.</p>
            ) : (
              painEvents?.map((event) => (
                <div
                  key={event.id}
                  className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{event.location}</p>
                    <Badge variant={event.intensity >= 8 ? "red" : "teal"}>
                      {event.intensity}/10
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--muted)]">{event.trigger}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Plan de ejercicios</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createPlan} className="space-y-4">
              <input type="hidden" name="patient_id" value={patient.id} />
              <Field label="Ejercicio">
                <Select name="exercise_id" required>
                  <option value="">Selecciona ejercicio</option>
                  {exercises?.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.title}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Frecuencia semanal (estimada)">
                <Input name="expected_per_week" type="number" min={1} max={21} defaultValue={3} />
              </Field>
              <Field label="Indicaciones generales">
                <Textarea name="notes" rows={3} placeholder="Ej: si dolor >5, suspender" />
              </Field>
              <Button type="submit">Crear plan</Button>
            </form>
            <div className="mt-6 space-y-3">
              {(plans ?? []).length === 0 ? (
                <p className="text-sm text-[var(--muted)]">Sin planes activos.</p>
              ) : (
                plans?.map((plan) => (
                  <div
                    key={plan.id}
                    className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-3"
                  >
                    <p className="text-sm font-semibold">{plan.status}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {plan.plan_exercises?.length ?? 0} ejercicios
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Registrar sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createSession} className="space-y-4">
              <input type="hidden" name="patient_id" value={patient.id} />
              <Field label="Tipo de sesión">
                <Select name="session_type" defaultValue="therapeutic">
                  <option value="therapeutic">Sesión terapéutica</option>
                  <option value="medical">Consulta médica</option>
                </Select>
              </Field>
              <Field label="Subjetivo">
                <Textarea name="subjective" rows={2} />
              </Field>
              <Field label="Objetivo">
                <Textarea name="objective" rows={2} />
              </Field>
              <Field label="Evaluación">
                <Textarea name="assessment" rows={2} />
              </Field>
              <Field label="Plan">
                <Textarea name="plan" rows={2} />
              </Field>
              <div className="grid gap-3 md:grid-cols-2">
                <Field label="Dolor antes">
                  <Input name="pain_before" type="number" min={0} max={10} />
                </Field>
                <Field label="Dolor después">
                  <Input name="pain_after" type="number" min={0} max={10} />
                </Field>
              </div>
              <Button type="submit">Guardar sesión</Button>
            </form>
            <div className="mt-6 space-y-3">
              {(sessions ?? []).length === 0 ? (
                <p className="text-sm text-[var(--muted)]">Sin sesiones recientes.</p>
              ) : (
                sessions?.map((session) => (
                  <div
                    key={session.id}
                    className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-3"
                  >
                    <p className="text-sm font-semibold">
                      {session.session_type === "medical" ? "Consulta médica" : "Sesión terapéutica"}
                    </p>
                    <p className="text-xs text-[var(--muted)]">
                      {new Date(session.started_at).toLocaleDateString("es-CO")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
