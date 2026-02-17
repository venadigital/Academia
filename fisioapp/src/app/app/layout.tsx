import { redirect } from "next/navigation";
import { Sidebar } from "@/components/app/sidebar";
import { Button } from "@/components/ui/button";
import { getCurrentRole, getCurrentUserProfile } from "@/lib/data";
import { toRoleLabel } from "@/lib/roles";
import { signOut } from "@/app/auth/actions";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentUserProfile();
  if (!profile) {
    redirect("/auth/sign-in");
  }
  const role = await getCurrentRole();

  return (
    <div className="min-h-screen">
      <div className="container grid gap-6 py-6 lg:grid-cols-[260px_1fr]">
        <Sidebar
          userName={profile?.full_name ?? profile?.email ?? "Usuario"}
          roleLabel={toRoleLabel(role?.role)}
        />
        <div className="flex min-h-[calc(100vh-48px)] flex-col gap-6">
          <header className="flex items-center justify-between rounded-[var(--radius-lg)] border border-[var(--line)] bg-white/80 px-6 py-4 shadow-[var(--shadow-md)]">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#9c8f7e]">
                Centro activo
              </p>
              <p className="text-lg font-semibold">{profile?.full_name}</p>
            </div>
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit">
                Cerrar sesión
              </Button>
            </form>
          </header>
          <main className="flex-1 space-y-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
