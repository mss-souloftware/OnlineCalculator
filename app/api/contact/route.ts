import { NextResponse } from "next/server";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form endpoint. Validates the submission server-side and acknowledges
 * it. Persistence (e.g. saving to MongoDB / emailing the team) is a later phase
 * — for now a valid submission is logged and accepted.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { name, email, subject, message } = (body ?? {}) as Record<
    string,
    string
  >;

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    typeof email !== "string" ||
    !emailRe.test(email) ||
    typeof message !== "string" ||
    message.trim().length < 10
  ) {
    return NextResponse.json(
      { error: "Please complete all required fields." },
      { status: 400 },
    );
  }

  // TODO(persistence): save to the ContactSubmission collection / notify team.
  console.info("[contact] new submission", {
    name: name.trim(),
    email: email.trim(),
    subject: typeof subject === "string" ? subject : "Other",
    length: message.trim().length,
  });

  return NextResponse.json({ ok: true });
}
