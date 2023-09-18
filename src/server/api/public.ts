import { publicProcedure, router } from "./trpc";
const waitFor = async (delay: number = 1000) => {
  return new Promise((r) => setTimeout(r, delay))
}
export const publicRouter = router({
  slowQueryCache:
    publicProcedure
      .query(async () => {
        await waitFor(5000)
        return new Date().toJSON()
      }),
})