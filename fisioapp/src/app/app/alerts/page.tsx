import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveAlert, runAlertSweep } from "@/app/app/actions";
import { Field, Input } from "@/components/ui/field";

export default async function AlertsPage() {
  const supabase = createSupabaseServerClient();

  const { data: alerts } = await supabase
    .from("alerts")
    .select("id, alert_type, summary, priority, status, triggered_at")
    .order("triggered_at", { ascending: false })
    .limit(25);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Ejecutar evaluación de alertas</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={runAlertSweep}>
            <Button type="submit">Correr análisis ahora</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alertas activas y recientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(alerts ?? []).length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No hay alertas registradas.</p>
          ) : (
            alerts?.map((alert) => (
              <div
                key={alert.id}
                className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-4"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">{alert.summary}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {alert.alert_type} · {new Date(alert.triggered_at).toLocaleString("es-CO")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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
                    <Badge variant="neutral">{alert.status}</Badge>
                  </div>
                </div>
                {alert.status === "active" ? (
                  <form action={resolveAlert} className="mt-4 flex flex-wrap items-end gap-3">
                    <input type="hidden" name="alert_id" value={alert.id} />
                    <Field label="Acción tomada">
                      <Input name="action" placeholder="Ej: Llamé al paciente" />
                    </Field>
                    <Button type="submit" variant="subtle">
                      Resolver alerta
                    </Button>
                  </form>
                ) : null}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
