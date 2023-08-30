import { z } from "zod";

export const getPostSchema = z.object({
  post_id: z.string()
})
export type GetPostSchema = z.infer<typeof getPostSchema>

export const createPostSchema = z.object({
  title: z.string().min(1, { message: 'title required' }),
  content: z.string().optional(),
  published: z.boolean().default(false)
})
export type CreatePostSchema = z.infer<typeof createPostSchema>


export const togglePostPuPublishedSchema = z.object({
  id: z.number(),
  published: z.boolean()
})
export type TogglePostPuPublishedSchema = z.infer<typeof togglePostPuPublishedSchema>


export const deletePostSchema = z.object({
  id: z.number()
})
export type DeletePostSchema = z.infer<typeof deletePostSchema>

