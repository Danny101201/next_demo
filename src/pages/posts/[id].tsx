import { appRouter } from '@/server/api/root';
import { GetStaticPaths, GetServerSidePropsContext, GetStaticPropsContext, InferGetStaticPropsType, } from 'next';
import React from 'react'
import { createServerSideHelpers } from '@trpc/react-query/server';
import { prisma } from '@/server/db';
import { api } from '@/utils/api';
import { useRouter } from 'next/router';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/Button';


interface PostDetailProps extends InferGetStaticPropsType<typeof getServerSideProps> {

}


const PostDetail = ({ id }: PostDetailProps) => {
  const { update, data: session } = useSession()
  const router = useRouter()

  const { data: post, status, ...rest } = api.posts.getPost.useQuery({ post_id: id })
  if (status !== 'success') {
    return <>Loading...</>
  }
  return (
    <>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Button danger onClick={() => update()}>update</Button>
      <h1>Post details Page</h1>
      <p>title : {post.title}</p>
      <p>Author: {post.author.name}</p>
      <p>id : {post.id}</p>
      <p>content : {post.content}</p>
      <button onClick={() => router.push('/posts')}>back to post lists</button>
    </>
  )
}
export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>,
) {
  const session = await getServerSession(context.req, context.res, authOptions)
  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
      session
    },
  });
  // const id = context.params?.id as string;
  const id = context.params?.id as string
  await helpers.posts.getPost.prefetch({ post_id: id })

  return {
    props: {
      trpcState: helpers.dehydrate(),
      id,
    }
  };
}
// export async function getStaticProps(
//   context: GetStaticPropsContext<{ id: string }>,
// ) {
//   console.log('getStaticProps')
//   const helpers = createServerSideHelpers({
//     router: appRouter,
//     ctx: {
//       prisma
//     },
//   });
//   // const id = context.params?.id as string;
//   const id = context.params?.id as string

//   await helpers.posts.getPost.prefetch({ post_id: id })

//   return {
//     props: {
//       trpcState: helpers.dehydrate(),
//       id,
//     },
//     revalidate: 1,
//   };
// }

// export const getStaticPaths: GetStaticPaths = async () => {
//   const posts = await prisma.post.findMany({
//     select: {
//       id: true
//     }
//   })
//   return {
//     paths: posts.map(post => ({
//       params: {
//         id: String(post.id)
//       }
//     })),
//     fallback: 'blocking'
//   }
// }
export default PostDetail