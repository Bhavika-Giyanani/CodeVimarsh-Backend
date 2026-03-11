import prisma from "../../config/prisma.js";

const PUBLIC_USER_SELECT = {
  id: true,
  prn: true,
  name: true,
  email: true,
  role: true,
  avatar: true,
  xp: true,
  level: true,
  global_rank: true,
  created_at: true,
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: PUBLIC_USER_SELECT,
  });

  if (!user) {
    const error = new Error("User not found.");
    error.statusCode = 404;
    throw error;
  }

  return user;
};

export const updateUserById = async (requesterId, targetId, data) => {
  const requester = await prisma.user.findUnique({
    where: { id: requesterId },
  });

  if (requesterId !== targetId && requester.role !== "SUPER_ADMIN") {
    const error = new Error("You are not allowed to update this profile.");
    error.statusCode = 403;
    throw error;
  }

  const updated = await prisma.user.update({
    where: { id: targetId },
    data,
    select: PUBLIC_USER_SELECT,
  });

  return updated;
};

export const getLeaderboard = async () =>
  prisma.user.findMany({
    where: { role: "USER" },
    orderBy: { xp: "desc" },
    take: 50,
    select: {
      id: true,
      prn: true,
      name: true,
      avatar: true,
      xp: true,
      level: true,
      global_rank: true,
    },
  });
