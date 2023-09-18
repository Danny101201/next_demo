import { createNextApiHandler } from '@trpc/server/adapters/next';

import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

// @see https://nextjs.org/docs/api-routes/introduction
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  responseMeta(opts) {
    const { ctx, paths, errors, type } = opts
    const allPublic = paths && paths.every(path => path.includes('public'))
    const allOk = errors.length === 0
    const isQuery = type === 'query'
    if (
      allPublic &&
      allOk &&
      isQuery
    ) {
      const ONE_DAY_IN_SECONDS = 60 * 60 * 24
      // max-age=60 * 60 * 24 代表 1 天內 內的 response 都是返回 cache 資料，一天後重新發 request
      // max-age=1, stale-while-revalidate=60 * 60 * 24 代表 1s 內的 response 都是返回 cache 資料 ， 1s  - 1 天內 背景更改 cache  data，而不是透過 request update cache ，一天後才會重新發 request ，這是一個性能與即時性的平衡用法。
      return {
        headers: {
          'cache-control': `max-age=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
        }
      }
    }
    return {}
  }
});