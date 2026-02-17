import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const { data: alerts } = await supabase
    .from("alerts")
    .select("id, summary, priority, status")
    .eq("status", "active")
    .order("triggered_at", { ascending: false })
    .limit(5);

  const { data: appointments } = await supabase
    .from("appointments")
    .select("id, starts_at, appointment_type, status, patients(first_name,last_name)")
    .gte("starts_at", startOfDay.toISOString())
    .lt("starts_at", endOfDay.toISOString())
    .order("starts_at", { ascending: true });

  const { data: patients } = await supabase
    .from("patients")
    .select("id")
    .eq("status", "active");

  return (
    <div className="space-y-6">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
        <Card>
          <CardHeader>
            <CardTitle>Resumen operativo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--accent-soft)] p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#7a6d5b]">
                  Pacientes activos
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {patients?.length ?? 0}
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#7a6d5b]">
                  Citas hoy
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {appointments?.length ?? 0}
                </p>
              </div>
              <div className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-[#7a6d5b]">
                  Alertas activas
                </p>
                <p className="mt-2 text-3xl font-semibold">
                  {alerts?.length ?? 0}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/app/patients">
                <Button variant="ghost">Ver pacientes</Button>
              </Link>
              <Link href="/app/agenda">
                <Button variant="ghost">Abrir agenda</Button>
              </Link>
              <Link href="/app/alerts">
                <Button variant="ghost">Revisar alertas</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Alertas recientes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(alerts ?? []).length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                No hay alertas activas en este momento.
              </p>
            ) : (
              alerts?.map((alert) => (
                <div
                  key={alert.id}
                  className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-3"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{alert.summary}</p>
                    <Badge
                      variant={
                        alert.priority === "critical"
                          ? "red"
                          : alert.priority === "high"
                          ? "amber"
                          : "teal"
                      }
                    >
                      {alert.priority}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Agenda de hoy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(appointments ?? []).length === 0 ? (
              <p className="text-sm text-[var(--muted)]">
                No hay citas registradas para hoy.
              </p>
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
                      {new Date(appointment.starts_at).toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })} · {appointment.appointment_type}
                    </p>
                  </div>
                  <Badge variant="neutral">{appointment.status}</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Acciones rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/app/patients">
              <Button className="w-full" variant="subtle">
                Registrar nuevo paciente
              </Button>
            </Link>
            <Link href="/app/exercises">
              <Button className="w-full" variant="ghost">
                Agregar ejercicio
              </Button>
            </Link>
            <Link href="/app/sessions">
              <Button className="w-full" variant="ghost">
                Registrar sesión
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
