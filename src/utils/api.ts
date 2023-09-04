
import { queryClient } from '@/components/Provider';
import { AppRouter } from '@/server/api/root';
import { httpBatchLink, httpLink, loggerLink, splitLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { createTRPCReact } from '@trpc/react-query';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

function getBaseUrl() {
  if (typeof window !== 'undefined')
    // browser should use relative path
    return '';

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}
const url = `${getBaseUrl()}/api/trpc`
export const api = createTRPCNext<AppRouter>({
  // overrides: {
  //   useMutation: {
  //     onSuccess: async (opt) => {
  //       await opt.originalFn()
  //       await opt.queryClient.invalidateQueries()
  //     }
  //   }
  // },
  config(opts) {
    return {
      links: [
        loggerLink({
          enabled: (opts) =>
            (process.env.NODE_ENV === 'development' &&
              typeof window !== 'undefined') ||
            (opts.direction === 'down' && opts.result instanceof Error),
        }),
        splitLink({
          condition(op) {
            // check for context property `skipBatch`
            return op.context.skipBatch === true;
          },
          // when condition is true, use normal request
          true: httpLink({
            /**
             * If you want to use SSR, you need to use the server's full URL
             * @link https://trpc.io/docs/ssr
             **/
            url: `${getBaseUrl()}/api/trpc`,
            // You can pass any HTTP headers you wish here
            async headers() {
              return {
                // authorization: getAuthCookie(),
              };
            }
          }),
          // when condition is false, use batching
          false: httpBatchLink({
            /**
             * If you want to use SSR, you need to use the server's full URL
             * @link https://trpc.io/docs/ssr
             **/
            url: `${getBaseUrl()}/api/trpc`,
            async headers() {
              return {
                // authorization: getAuthCookie(),
              };
            },
            // maxURLLength: 2083, // 限制 413 Payload Too Large、414 URI Too Long和404 Not Found
            maxURLLength: 2083
          }),
        }),
      ],
      queryClient
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   **/
  ssr: true,
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;