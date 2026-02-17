import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function SessionsPage() {
  const supabase = createSupabaseServerClient();

  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, session_type, started_at, patients(first_name,last_name)")
    .order("started_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sesiones recientes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(sessions ?? []).length === 0 ? (
            <p className="text-sm text-[var(--muted)]">No hay sesiones registradas.</p>
          ) : (
            sessions?.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-3"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {(session.patients as { first_name: string; last_name: string })?.first_name} {(session.patients as { first_name: string; last_name: string })?.last_name}
                  </p>
                  <p className="text-xs text-[var(--muted)]">
                    {new Date(session.started_at).toLocaleDateString("es-CO")} · {session.session_type}
                  </p>
                </div>
                <Link href="/app/patients">
                  <Button variant="ghost" size="sm">
                    Ver ficha
                  </Button>
                </Link>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
