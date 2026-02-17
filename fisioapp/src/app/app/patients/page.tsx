import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { createPatient } from "@/app/app/actions";

export default async function PatientsPage() {
  const supabase = createSupabaseServerClient();

  const { data: patients } = await supabase
    .from("patients")
    .select("id, first_name, last_name, status, primary_pathology")
    .order("created_at", { ascending: false });

  const { data: professionals } = await supabase
    .from("user_roles")
    .select("user_id, role, users(full_name)")
    .in("role", ["fisiatra", "fisioterapeuta"])
    .eq("is_active", true);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alta rápida de paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPatient} className="grid gap-4 md:grid-cols-2">
            <Field label="Nombre">
              <Input name="first_name" required />
            </Field>
            <Field label="Apellido">
              <Input name="last_name" required />
            </Field>
            <Field label="WhatsApp">
              <Input name="phone_whatsapp" placeholder="+57..." />
            </Field>
            <Field label="Email">
              <Input name="email" type="email" />
            </Field>
            <Field label="Patología principal">
              <Input name="primary_pathology" placeholder="Ej: Lumbalgia" />
            </Field>
            <Field label="Profesional principal">
              <Select name="professional_id" defaultValue="">
                <option value="">Sin asignar</option>
                {professionals?.map((professional) => (
                  <option key={professional.user_id} value={professional.user_id}>
                    {(professional.users as { full_name: string })?.full_name} ({professional.role})
                  </option>
                ))}
              </Select>
            </Field>
            <div className="md:col-span-2">
              <Button type="submit">Guardar paciente</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pacientes activos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(patients ?? []).length === 0 ? (
            <p className="text-sm text-[var(--muted)]">
              Aún no hay pacientes registrados.
            </p>
          ) : (
            patients?.map((patient) => (
              <Link
                key={patient.id}
                href={`/app/patients/${patient.id}`}
                className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--line)] bg-white px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {patient.first_name} {patient.last_name}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {patient.primary_pathology ?? "Sin patología"}
                  </p>
                </div>
                <Button variant="ghost" size="sm">
                  Abrir ficha
                </Button>
              </Link>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
