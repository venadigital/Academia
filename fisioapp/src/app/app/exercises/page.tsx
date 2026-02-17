import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { createExercise } from "@/app/app/actions";

export default async function ExercisesPage() {
  const supabase = createSupabaseServerClient();

  const { data: exercises } = await supabase
    .from("exercise_library")
    .select("id, title, segment, goal, phase, source")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Agregar ejercicio</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createExercise} className="grid gap-4 md:grid-cols-2">
            <Field label="Título">
              <Input name="title" required />
            </Field>
            <Field label="Fuente">
              <Select name="source" defaultValue="youtube">
                <option value="youtube">YouTube</option>
                <option value="upload">Upload</option>
              </Select>
            </Field>
            <Field label="URL de video">
              <Input name="source_url" placeholder="https://youtube.com/..." />
            </Field>
            <Field label="Segmento corporal">
              <Input name="segment" placeholder="Ej: hombro" />
            </Field>
            <Field label="Objetivo">
              <Input name="goal" placeholder="Ej: movilidad" />
            </Field>
            <Field label="Fase">
              <Input name="phase" placeholder="Ej: recuperación" />
            </Field>
            <Field label="Descripción">
              <Textarea name="description" rows={3} />
            </Field>
            <div className="md:col-span-2">
              <Button type="submit">Guardar ejercicio</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Biblioteca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(exercises ?? []).length === 0 ? (
            <p className="text-sm text-[var(--muted)]">Aún no hay ejercicios.</p>
          ) : (
            exercises?.map((exercise) => (
              <div
                key={exercise.id}
                className="rounded-[var(--radius-md)] border border-[var(--line)] bg-white p-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{exercise.title}</p>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#9c8f7e]">
                    {exercise.source}
                  </span>
                </div>
                <p className="text-xs text-[var(--muted)]">
                  {exercise.segment ?? "Segmento"} · {exercise.goal ?? "Objetivo"} · {exercise.phase ?? "Fase"}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
