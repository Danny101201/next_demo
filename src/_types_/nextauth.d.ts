import 'next-auth'
declare module "next-auth/jwt" {
  interface JWT {
    update_session: Record<string, unknown>
  }
}
