import { createNextApiHandler } from '@trpc/server/adapters/next';

import { appRouter } from '@/server/api/root';

// @see https://nextjs.org/docs/api-routes/introduction
export default createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});