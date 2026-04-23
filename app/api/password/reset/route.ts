import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const resetSchema = z.object({
  token: z.string().min(20),
  password: z.string().min(8).max(100)
});

export async function POST(request: Request) {
  const parsed = resetSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a valid reset link and a password with at least 8 characters." }, { status: 400 });
  }

  const verification = await prisma.verificationToken.findUnique({
    where: { token: parsed.data.token }
  });

  if (!verification || !verification.identifier.startsWith("password-reset:") || verification.expires < new Date()) {
    return NextResponse.json({ error: "This reset link is invalid or expired." }, { status: 400 });
  }

  const email = verification.identifier.replace("password-reset:", "");
  const passwordHash = await bcrypt.hash(parsed.data.password, 12);
  await prisma.$transaction([
    prisma.user.update({
      where: { email },
      data: { passwordHash }
    }),
    prisma.verificationToken.deleteMany({ where: { identifier: verification.identifier } })
  ]);

  return NextResponse.json({ message: "Password updated. You can log in now." });
}
