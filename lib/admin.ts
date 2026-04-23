import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getCurrentLearner } from "@/lib/learner";
import { prisma } from "@/lib/prisma";

export function canManageContent(role: string) {
  return role === "ADMIN" || role === "EDITOR";
}

export function canManageUsers(role: string) {
  return role === "ADMIN";
}

export async function requireContentAdmin() {
  const learner = await getCurrentLearner();
  if (!canManageContent(learner.role)) redirect("/dashboard");
  return learner;
}

export async function requireFullAdmin() {
  const learner = await getCurrentLearner();
  if (!canManageUsers(learner.role)) redirect("/dashboard");
  return learner;
}

export async function getApiAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true }
  });
  return user && canManageContent(user.role) ? user : null;
}

export async function getApiFullAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { id: true, role: true }
  });
  return user && canManageUsers(user.role) ? user : null;
}
