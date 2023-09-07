import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

import {
  getPostSchema,
  createPostSchema,
  togglePostPuPublishedSchema,
  deletePostSchema,
  getInfinitePostSchema
} from "@/validate/api/post";

export const postsRouter = router({
  infinitePosts: publicProcedure
    .input(getInfinitePostSchema)
    .query(async ({ input, ctx }) => {
      const { cursor, where } = input
      const { prisma } = ctx
      const limit = input.limit ?? 50
      const posts = await prisma.post.findMany({
        where: {
          title: {
            contains: where?.title
          },
          content: {
            contains: where?.content
          },
        },
        orderBy: {
          id: 'desc'
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined
      })
      let nextCursor: number | undefined
      if (posts.length >= limit) {
        nextCursor = posts.pop()?.id
      }

      return {
        posts,
        nextCursor
      }
    }),
  getPosts: publicProcedure
    .query(async ({ ctx }) => {
      const { prisma } = ctx
      const posts = await prisma.post.findMany({})
      return posts
    }),
  getPost: publicProcedure.input(getPostSchema)
    .query(async ({ input, ctx }) => {
      const { post_id } = input
      const { prisma } = ctx
      const post = await prisma.post.findFirst({
        where: {
          id: Number(post_id)
        }
      })
      if (!post) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'post not found' })
      }
      return post
    }),

  addPost: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma } = ctx
      const duplicatePost = await prisma.post.findFirst({
        where: {
          title: input.title
        }
      })
      if (duplicatePost) {
        throw new TRPCError({ code: 'CONFLICT', message: 'Title already exists' })
      }
      const newPost = await prisma.post.create({
        data: input,
      })

      return { message: 'success create post', post: newPost }
    }),
  togglePostPublish: publicProcedure
    .input(togglePostPuPublishedSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, published } = input
      const { prisma } = ctx
      await prisma.post.update({
        where: {
          id
        },
        data: {
          published
        }
      })
    }),
  deletePost: publicProcedure
    .input(deletePostSchema)
    .mutation(async ({ input, ctx }) => {
      const { id } = input
      const { prisma } = ctx
      await prisma.post.delete({
        where: {
          id
        }
      })

    })
})