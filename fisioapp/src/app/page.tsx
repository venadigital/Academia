import Link from "next/link";
import { Button } from "@/components/ui/button";

const highlights = [
  {
    title: "Dolor en contexto",
    description:
      "Registro rápido y objetivo en menos de 30 segundos, con tendencias claras antes de cada sesión.",
  },
  {
    title: "Ejercicios guiados",
    description:
      "Biblioteca estandarizada con videos cortos, puntos clave y errores comunes para mejorar adherencia.",
  },
  {
    title: "Operación clínica",
    description:
      "Sesiones, agenda y alertas clínicas unificadas para que el equipo trabaje con continuidad.",
  },
];

const modules = [
  "Registro de dolor y evolución",
  "Planes de ejercicios y adherencia",
  "Sesiones terapéuticas y médicas",
  "Agenda con recordatorios",
  "Alertas clínicas y seguimiento",
  "Roles, permisos y consentimientos",
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-20 border-b border-white/40">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-[14px] bg-[var(--accent)] text-white font-semibold">
              F
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#9c8f7e]">
                Centro Clínico
              </p>
              <p className="text-lg font-semibold">FISIOAPP</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/sign-in" className="text-sm font-semibold">
              Iniciar sesión
            </Link>
            <Link href="/auth/sign-up">
              <Button size="sm">Crear cuenta</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-12">
        <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9c8f7e]">
              MVP Clínico-Operativo
            </p>
            <h1 className="text-4xl leading-tight md:text-5xl">
              La extensión digital de la sesión presencial.
            </h1>
            <p className="text-lg text-[var(--muted)]">
              FISIOAPP conecta el registro de dolor, los ejercicios guiados y la
              operación del centro en una sola plataforma. Pensado para reducir
              la anamnesis improvisada y mejorar la continuidad clínica.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/auth/sign-up">
                <Button size="lg">Activar centro</Button>
              </Link>
              <Link href="/app">
                <Button size="lg" variant="ghost">
                  Ver demo
                </Button>
              </Link>
            </div>
          </div>
          <div className="surface p-8">
            <h2 className="text-xl font-semibold">Lo esencial en una mirada</h2>
            <div className="mt-6 space-y-4">
              {highlights.map((item) => (
                <div key={item.title} className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-4">
                  <p className="text-sm font-semibold text-[var(--accent-2)]">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted)]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 grid gap-6 rounded-[var(--radius-xl)] border border-[var(--line)] bg-white/80 p-8 shadow-[var(--shadow-lg)]">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <h2 className="text-2xl font-semibold">
              Módulos incluidos en Fase 1A
            </h2>
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9c8f7e]">
              PWA + Next.js + Supabase
            </span>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {modules.map((module) => (
              <div
                key={module}
                className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-white px-4 py-3"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)]" />
                <p className="text-sm font-medium text-[var(--ink)]">
                  {module}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
