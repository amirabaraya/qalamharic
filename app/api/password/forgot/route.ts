import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const forgotSchema = z.object({
  email: z.string().email()
});

export async function POST(request: Request) {
  const parsed = forgotSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "No FidelAmharic account uses that email." }, { status: 404 });
  }

  const code = crypto.randomInt(100000, 999999).toString();
  await prisma.verificationToken.deleteMany({ where: { identifier: `password-code:${email}` } });
  await prisma.verificationToken.create({
    data: {
      identifier: `password-code:${email}`,
      token: code,
      expires: new Date(Date.now() + 1000 * 60 * 10)
    }
  });

  const canEmail = Boolean(process.env.EMAIL_FROM && process.env.RESEND_API_KEY);

  return NextResponse.json({
    message: canEmail
      ? "A 6-digit reset code was sent to your email."
      : "Email delivery is not connected yet. Use this verification code to reset your password.",
    delivery: canEmail ? "email" : "onscreen",
    code: canEmail ? undefined : code
  });
}
