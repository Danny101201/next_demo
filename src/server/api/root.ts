import * as trpc from '@trpc/server';
import { publicProcedure, router } from './trpc';
import { z } from 'zod';
import { postsRouter } from './post';

export const appRouter = router({
  greeting: publicProcedure
    .input(z.object({
      name: z.string()
    }))
    .query(({ input, ctx }) => `hello ${input.name}`),
  posts: postsRouter
});

// Export only the type of a router!
// This prevents us from importing server code on the client.
export type AppRouter = typeof appRouter;

