import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { createAppointment } from "@/app/app/actions";

export default async function AgendaPage() {
  const supabase = createSupabaseServerClient();

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, starts_at, status, appointment_type, patients(first_name,last_name)")
    .order("starts_at", { ascending: true })
    .limit(20);

  const { data: patients } = await supabase
    .from("patients")
    .select("id, first_name, last_name")
    .order("first_name", { ascending: true });

  const { data: professionals } = await supabase
    .from("user_roles")
    .select("user_id, role, users(full_name)")
    .in("role", ["fisiatra", "fisioterapeuta"])
    .eq("is_active", true);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Programar cita</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAppointment} className="grid gap-4 md:grid-cols-2">
            <Field label="Paciente">
              <Select name="patient_id" required>
                <option value="">Selecciona paciente</option>
                {patients?.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Profesional">
              <Select name="professional_id" required>
                <option value="">Selecciona profesional</option>
                {professionals?.map((professional) => (
                  <option key={professional.user_id} value={professional.user_id}>
                    {(professional.users as { full_name: string })?.full_name} ({professional.role})
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Fecha y hora">
              <Input name="starts_at" type="datetime-local" required />
            </Field>
            <Field label="Duración (min)">
              <Input name="duration" type="number" min={15} max={120} defaultValue={45} />
            </Field>
            <Field label="Tipo">
              <Select name="appointment_type" defaultValue="session">
                <option value="session">Sesión</option>
                <option value="medical">Consulta médica</option>
                <option value="evaluation">Evaluación</option>
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Button type="submit">Crear cita</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Próximas citas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(appointments ?? []).length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No hay citas registradas.</p>
          ) : (
            appointments?.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-3"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {(appointment.patients as { first_name: string; last_name: string })?.first_name} {(appointment.patients as { first_name: string; last_name: string })?.last_name}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {new Date(appointment.starts_at).toLocaleString("es-CO")} · {appointment.appointment_type}
                  </p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#9c8f7e]">
                  {appointment.status}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
