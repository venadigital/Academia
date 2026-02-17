import Link from "next/link";
import { signIn } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function SignInPage() {
  return (
    <div className="min-h-screen">
      <div className="container grid min-h-screen items-center gap-10 py-12 lg:grid-cols-[1fr_0.8fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9c8f7e]">
            Acceso seguro
          </p>
          <h1 className="text-4xl">Bienvenido/a a FISIOAPP</h1>
          <p className="text-lg text-[var(--muted)]">
            Inicia sesión para gestionar pacientes, ejercicios, sesiones y
            alertas clínicas desde un solo lugar.
          </p>
        </div>

        <div className="surface p-8">
          <form action={signIn} className="space-y-5">
            <Field label="Correo">
              <Input name="email" type="email" placeholder="nombre@centro.com" required />
            </Field>
            <Field label="Contraseña">
              <Input name="password" type="password" placeholder="••••••••" required />
            </Field>
            <Button type="submit" className="w-full" size="lg">
              Entrar
            </Button>
          </form>
          <p className="mt-4 text-sm text-[var(--muted)]">
            ¿Primera vez?{" "}
            <Link href="/auth/sign-up" className="font-semibold text-[var(--accent)]">
              Crea tu centro
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
