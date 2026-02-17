import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { sweepAlerts } from "@/lib/alerts";

export async function GET() {
  try {
    const admin = createSupabaseAdminClient();
    await sweepAlerts(admin);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
