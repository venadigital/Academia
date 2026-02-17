"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function signIn(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/app");
}

export async function signUp(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const fullName = String(formData.get("full_name") ?? "").trim();
  const centerName = String(formData.get("center_name") ?? "").trim();

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "No se pudo crear el usuario." };
  }

  try {
    const admin = createSupabaseAdminClient();
    const { data: center, error: centerError } = await admin
      .from("centers")
      .insert({ name: centerName })
      .select()
      .single();

    if (centerError || !center) {
      throw centerError ?? new Error("No se pudo crear el centro");
    }

    await admin.from("users").insert({
      id: data.user.id,
      center_id: center.id,
      email,
      full_name: fullName,
    });

    await admin.from("user_roles").insert({
      user_id: data.user.id,
      center_id: center.id,
      role: "superadmin",
      is_active: true,
    });
  } catch {
    const { data: center } = await supabase
      .from("centers")
      .insert({ name: centerName })
      .select()
      .single();

    if (center) {
      await supabase.from("users").insert({
        id: data.user.id,
        center_id: center.id,
        email,
        full_name: fullName,
      });

      await supabase.from("user_roles").insert({
        user_id: data.user.id,
        center_id: center.id,
        role: "superadmin",
        is_active: true,
      });
    }
  }

  redirect("/app");
}

export async function signOut() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}
