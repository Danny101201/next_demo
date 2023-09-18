import { z } from "zod";
import { authProcedure, publicProcedure, router } from "./trpc";
import { TRPCError } from "@trpc/server";

import {
  getPostSchema,
  createPostSchema,
  togglePostPuPublishedSchema,
  deletePostSchema,
  getInfinitePostSchema
} from "@/validate/api/post";
import { Prisma } from "@prisma/client";

export const postsRouter = router({
  infinitePosts:
    authProcedure
      .meta({
        authRequired: true
      })
      .input(getInfinitePostSchema)
      .query(async ({ input, ctx }) => {
        const { cursor, where } = input
        const { prisma } = ctx
        const limit = input.limit ?? 50
        const whereClause = Prisma.validator<Prisma.PostWhereInput>()({
          OR: [
            {
              title: {
                contains: where?.title
              }
            },
            {
              content: {
                contains: where?.content
              }
            }
          ]
        })
        const posts = await prisma.post.findMany({
          where: where ? whereClause : undefined,
          orderBy: {
            id: 'desc'
          },
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          include: {
            author: true
          }
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
  getPosts:
    authProcedure
      .meta({
        authRequired: true
      })
      .query(async ({ ctx }) => {
        const { prisma } = ctx
        const posts = await prisma.post.findMany({})
        return posts
      }),
  getPost:
    authProcedure
      .meta({
        authRequired: true
      })
      .input(getPostSchema)
      .query(async ({ input, ctx }) => {
        const { post_id } = input
        const { prisma } = ctx
        const post = await prisma.post.findFirst({
          where: {
            id: Number(post_id)
          },
          include: {
            author: true
          }
        })
        if (!post) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'post not found' })
        }
        return post
      }),

  addPost: authProcedure
    .meta({
      authRequired: true
    })
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      const { prisma, session } = ctx
      const { title } = input
      const duplicatePost = await prisma.post.findFirst({
        where: {
          title: title
        }
      })
      if (duplicatePost) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Title already exists' })
      }

      const newPost = await prisma.post.create({
        data: {
          title: input.title,
          content: input.content,
          author: {
            connect: {
              id: session?.user?.id
            }
          }
        },
      })

      return { message: 'success create post', id: newPost.id }
    }),
  togglePostPublish:
    authProcedure
      .meta({
        authRequired: true
      })
      .input(togglePostPuPublishedSchema)
      .mutation(async ({ input, ctx }) => {
        const { id, published } = input
        const { prisma } = ctx
        const result = await prisma.post.update({
          where: {
            id
          },
          data: {
            published
          }
        })

        return { message: 'success update post', id: result.id }
      }),
  deletePost:
    authProcedure
      .meta({
        authRequired: true
      })
      .input(deletePostSchema)
      .mutation(async ({ input, ctx }) => {
        const { id } = input
        const { prisma } = ctx
        const result = await prisma.post.delete({
          where: {
            id
          }
        })
        return { message: 'success delete post', id: result.id }
      })
})