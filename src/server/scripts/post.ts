import { Prisma } from "@prisma/client";
import { prisma } from "../db";
import { createUser } from ".";
import { faker } from "@faker-js/faker";

export const getPosts = async () => {
  return await prisma.post.findMany({})
}
export const getByPostId = async (id: number) => {
  return await prisma.post.findFirstOrThrow({ where: { id } })
}
export const createPosts = async (data: Prisma.PostCreateInput) => {
  return await prisma.post.create({ data })
}
export const createPostsWithTransaction = async () => {

  const newUser = await createUser({
    name: faker.person.fullName(),
    email: faker.internet.email()
  })
  const [newPost, count] = await prisma.$transaction([
    prisma.post.create({
      data: {
        title: faker.lorem.slug(),
        content: faker.lorem.paragraph({ max: 3, min: 1 }),
        author: {
          connect: {
            id: newUser.id
          }
        }
      }
    }),
    prisma.post.count()
  ])
  return {
    newPost,
    count
  }
}

export const updatePost = async (postId: number, data: Prisma.PostCreateInput) => {
  return await prisma.post.update({
    where: {
      id: postId,
    },
    data
  })
}
export const deletePost = async (postId: number) => {
  return await prisma.post.delete({
    where: {
      id: postId,
    }
  })
}