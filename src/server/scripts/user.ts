import { Prisma } from "@prisma/client";
import { prisma } from "../db";


export const createUser = async (data: Prisma.UserCreateInput) => {
  return await prisma.user.create({ data })
}
