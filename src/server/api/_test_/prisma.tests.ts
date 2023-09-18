import { prismaMock } from "@/server/__mocks__/prisma";

import {
  getByPostId,
  createPosts,
  updatePost,
  deletePost,
  createUser,
  createPostsWithTransaction
} from "@/server/scripts";
import { faker } from "@faker-js/faker";
import { describe, vi, it, expect } from "vitest";

describe('post CRUD', () => {
  it.only('create posts', async () => {
    const newUser = {
      name: 'names',
      email: faker.internet.email(),
      emailVerified: null,
      hashedPassword: '',
      image: ''
    }
    prismaMock.user.create.mockResolvedValue({ ...newUser, id: '1' })
    const results = await createUser(newUser)
    console.log(results)
    expect(results).toStrictEqual({ ...newUser, id: '1' })
    // const newPost: Prisma.PostCreateInput = {
    //   title: 'test title',
    //   author: {
    //     connect: {
    //       id: 'test_userid'
    //     }
    //   }
    // }
    // const result = await createPosts(newPost)
  })
  it('get by post id should throw error', async () => {
    prismaMock.post.findFirstOrThrow.mockImplementation(() => {
      throw new Error('No Post found')
    })
    await expect(getByPostId(1)).rejects.toThrow()
    await expect(getByPostId(1)).rejects.toThrowError('No Post found')
  })
  it('createPostsWithTransaction should return object containing the new post and the total count', async () => {
    const mockPost = {
      title: faker.lorem.slug(),
      content: faker.lorem.paragraph({ max: 3, min: 1 }),
    }

    const mockResponse = [{ ...mockPost, id: 1 }, 100]
    prismaMock.$transaction.mockResolvedValue(mockResponse)
    const data = await createPostsWithTransaction()
    expect(data).toStrictEqual({
      // newPost: mockResponse[0],
      count: mockResponse[1]
    })
  })
})