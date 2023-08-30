import { prisma } from './../db';
import { initTRPC } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { ZodError } from 'zod';


export const createTRPCContext = async (opts: CreateNextContextOptions) => {

  return {
    prisma
  };
};

// You can use any variable name you like.
// We use t to keep things simple.
const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter(opts) {
    const { shape, error } = opts
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null
      }
    }
  }
});


export const router = t.router;
export const middleware = t.middleware;
export const publicProcedure = t.procedure;