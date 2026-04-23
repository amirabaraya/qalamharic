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

  const token = crypto.randomBytes(32).toString("hex");
  await prisma.verificationToken.deleteMany({ where: { identifier: `password-reset:${email}` } });
  await prisma.verificationToken.create({
    data: {
      identifier: `password-reset:${email}`,
      token,
      expires: new Date(Date.now() + 1000 * 60 * 30)
    }
  });

  const origin = new URL(request.url).origin;
  const resetUrl = `${origin}/reset-password?token=${token}`;

  return NextResponse.json({
    message: "Reset link created. It expires in 30 minutes.",
    resetUrl
  });
}
