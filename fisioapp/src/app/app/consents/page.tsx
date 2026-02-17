import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function ConsentsPage() {
  const supabase = createSupabaseServerClient();

  const { data: consents } = await supabase
    .from("consents")
    .select("id, consent_type, accepted, accepted_at, patients(first_name,last_name)")
    .order("accepted_at", { ascending: false })
    .limit(20);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Consentimientos registrados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(consents ?? []).length === 0 ? (
            <p className="text-sm text-[var(--muted)]">Aún no hay consentimientos.</p>
          ) : (
            consents?.map((consent) => (
              <div
                key={consent.id}
                className="flex items-center justify-between rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-3"
              >
                <div>
                  <p className="text-sm font-semibold">
                    {(consent.patients as { first_name: string; last_name: string })?.first_name} {(consent.patients as { first_name: string; last_name: string })?.last_name}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{consent.consent_type}</p>
                </div>
                <Badge variant={consent.accepted ? "green" : "red"}>
                  {consent.accepted ? "Aceptado" : "Pendiente"}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
