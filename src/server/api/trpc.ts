import { prisma } from './../db';
import { TRPCError, initTRPC } from '@trpc/server';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { ZodError } from 'zod';
import { getServerAuthSession } from '../auth';
import { DefaultSession } from 'next-auth';



export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts
  const session = await getServerAuthSession({ req, res });
  return {
    session,
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
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    }
  })
})

export const publicProcedure = t.procedure;
export const protectProcedure = t.procedure.use(enforceUserIsAuthed);