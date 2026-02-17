import Link from "next/link";
import { signUp } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";

export default function SignUpPage() {
  return (
    <div className="min-h-screen">
      <div className="container grid min-h-screen items-center gap-10 py-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#9c8f7e]">
            Activación
          </p>
          <h1 className="text-4xl">Crea tu centro en minutos</h1>
          <p className="text-lg text-[var(--muted)]">
            Configura el centro, el usuario superadministrador y comienza a
            registrar pacientes con seguimiento clínico estandarizado.
          </p>
        </div>

        <div className="surface p-8">
          <form action={signUp} className="space-y-5">
            <Field label="Nombre del centro">
              <Input name="center_name" placeholder="Clínica Fisio Vida" required />
            </Field>
            <Field label="Nombre completo">
              <Input name="full_name" placeholder="Laura Salazar" required />
            </Field>
            <Field label="Correo">
              <Input name="email" type="email" placeholder="admin@centro.com" required />
            </Field>
            <Field label="Contraseña">
              <Input name="password" type="password" placeholder="Mínimo 8 caracteres" required />
            </Field>
            <Button type="submit" className="w-full" size="lg">
              Crear cuenta
            </Button>
          </form>
          <p className="mt-4 text-sm text-[var(--muted)]">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/sign-in" className="font-semibold text-[var(--accent)]">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
