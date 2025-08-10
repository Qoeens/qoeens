import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(req) {
  const { firstName, lastName, email, password } = await req.json();

  const { data, error } = await supabase
    .from("users")
    .insert([{ first_name: firstName, last_name: lastName, email, password }]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Account created successfully" });
}
