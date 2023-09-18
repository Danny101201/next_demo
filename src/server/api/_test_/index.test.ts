
import { beforeEach, describe, expect, it } from "vitest";
import { prisma } from "@/server/db";
import { AppRouter, appRouter } from "../root";
import { inferProcedureInput } from "@trpc/server";
import { createInnerTRPCContext } from "../trpc";
import { prismaMock } from "@/server/__mocks__/prisma";
import { Post, Prisma } from "@prisma/client";
import { Session } from "next-auth";
import { faker } from '@faker-js/faker'


describe('trpc api', () => {

  let mockData =
  {
    "id": faker.number.int(),
    "title": faker.lorem.slug(),
    "content": faker.lorem.paragraph(2),
    "published": faker.datatype.boolean(0.5),
    "createdAt": faker.date.anytime(),
    "updatedAt": faker.date.anytime(),
    "userId": faker.string.uuid(),
  }
  let mockUserSession = {
    user: {
      id: faker.string.uuid()
    },
    expires: faker.date.anytime().toString()
  }
  let ctx = createInnerTRPCContext({
    session: mockUserSession
  })

  const caller = appRouter.createCaller({ session: ctx.session, prisma: prismaMock })

  it('greeting input', async () => {
    type GreetInput = inferProcedureInput<AppRouter['greeting']>
    const input: GreetInput = {
      name: 'Danny'
    }
    const results = await caller.greeting(input)
    expect(results).toStrictEqual('hello Danny')
  })
  it('getPosts should return equal mockData', async () => {
    const mockDatas = [mockData]
    prismaMock.post.findMany.mockResolvedValue(mockDatas)
    const results = await caller.posts.getPosts()
    expect(results).toHaveLength(mockDatas.length)
    expect(results).toStrictEqual(mockDatas)
  })
  it('success create Post', async () => {
    prismaMock.post.create.mockResolvedValue(mockData)
    const result = await caller.posts.addPost({
      title: mockData.title,
      content: mockData.content
    })
    expect(result).toStrictEqual({
      message: 'success create post',
      id: mockData.id
    })
  })
  it('success toggle post published type', async () => {
    prismaMock.post.update.mockResolvedValue(mockData)
    const result = await caller.posts.togglePostPublish({ id: mockData.id, published: !mockData.published })
    expect(result).toStrictEqual({
      message: 'success update post',
      id: mockData.id
    })
  })
  it('success delete post ', async () => {
    prismaMock.post.delete.mockResolvedValue(mockData)
    const result = await caller.posts.deletePost({ id: mockData.id })
    expect(result).toStrictEqual({
      message: 'success delete post',
      id: mockData.id
    })
  })
  it('success get infinite Posts ', async () => {
    prismaMock.post.findMany.mockResolvedValue([mockData])
    const result = await caller.posts.infinitePosts({ limit: 10 })
    console.log(result)
    expect(result).toStrictEqual({
      posts: [mockData],
      nextCursor: undefined
    })
  })
})