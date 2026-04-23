import crypto from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().regex(/^\d{6}$/)
});

export async function POST(request: Request) {
  const parsed = verifySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter the 6-digit code." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const verification = await prisma.verificationToken.findUnique({
    where: { token: parsed.data.code }
  });

  if (!verification || verification.identifier !== `password-code:${email}` || verification.expires < new Date()) {
    return NextResponse.json({ error: "That code is invalid or expired." }, { status: 400 });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  await prisma.$transaction([
    prisma.verificationToken.deleteMany({ where: { identifier: `password-code:${email}` } }),
    prisma.verificationToken.deleteMany({ where: { identifier: `password-reset:${email}` } }),
    prisma.verificationToken.create({
      data: {
        identifier: `password-reset:${email}`,
        token: resetToken,
        expires: new Date(Date.now() + 1000 * 60 * 30)
      }
    })
  ]);

  const origin = new URL(request.url).origin;
  return NextResponse.json({ resetUrl: `${origin}/reset-password?token=${resetToken}` });
}
