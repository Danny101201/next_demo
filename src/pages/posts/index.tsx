import { Button } from "@/components/Button";
import { DebounceInput } from "@/components/DebounceInput";
import { PostForm } from "@/components/PostForm";
import { SearchInput } from "@/components/SearchInput";


import { api } from "@/utils/api";
import { Prisma, Post } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiFillDelete } from "react-icons/ai";
import { IoIosArchive } from "react-icons/io";
import { useInView } from 'react-intersection-observer';
import { toast } from "react-toastify";

export default function Home() {

  const session = useSession({
    // true 要求這個 component 必須要是 signin 否則處法下面的 onUnauthenticated callback，如果 required 是 true ，但沒有定義 onUnauthenticated 則會執行 signIn()
    required: true,
    onUnauthenticated: () => {
      console.log('onUnauthenticated')
    }
  })
  const [filterValue, setFilterValue] = useState<string>('')
  const router = useRouter()
  const bottomOfPanelRef = useRef<HTMLDivElement | null>(null)
  const scrollToBottom = () => {
    if (!bottomOfPanelRef.current) return
    bottomOfPanelRef.current.scrollTo({ top: 0, behavior: "smooth" })
  }
  const { ref, inView, entry } = useInView({
    /* Optional options */
    threshold: 0,
  });
  const utils = api.useContext()
  // const { data: posts, isLoading, isError, error } = api.posts.getPosts.useQuery(undefined, {
  //   trpc: {
  //     context: {
  //       skipBatch: true,
  //     }
  //   }
  // })

  const { data, isLoading, isError, error, fetchNextPage, hasNextPage } = api.posts.infinitePosts.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      select: (data) => {
        const checkColumns: (keyof Post)[] = ['title']
        return {
          ...data,
          pages: data.pages.map(page => ({
            ...page,
            posts: page.posts.filter(post => checkColumns.some(k => String(post[k]).toLowerCase().includes(filterValue.toLowerCase())))
          }))
        }
      }
    }
  )
  console.log(error)
  useEffect(() => {
    if (!inView) return
    fetchNextPage()
  }, [inView])
  const posts = data?.pages.flatMap(page => page.posts) || []
  const showNoMoreDataText = useMemo(() => !hasNextPage && posts.length > 5, [hasNextPage, posts])


  const { mutateAsync: togglePost } = api.posts.togglePostPublish.useMutation({
    onSuccess: () => {
      utils.posts.invalidate()
    }
  })
  const { mutateAsync: deletePost } = api.posts.deletePost.useMutation({
    onSuccess: () => {
      utils.posts.invalidate()
      toast.success('success delete post')
    }
  })
  const handelSearchText = (value: string) => {
    setFilterValue(value)
    // console.log(value)
  }
  const [windowHeight, setWindowHeight] = useState('100px')
  return (
    <div className="bg-gray-100 min-h-screen overflow-y-auto p-4">
      <div className="text-lg leading-8 text-gray-600">
        Every custom pool we design starts as a used shipping container, and is
        retrofitted with state of the art technology and finishes to turn it into
        a beautiful and functional way to entertain your guests all summer long.
      </div>
      <h2 className="text-center text-3xl">Create posts ({session.data?.user.name})</h2>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md flex flex-col gap-[2rem]">
        <PostForm updateSuccessCallBack={scrollToBottom} />
        <SearchInput value={filterValue} onChange={handelSearchText} />
        <div className="max-h-[300px] overflow-y-scroll" ref={bottomOfPanelRef}>
          <ul className="flex flex-col gap-[1rem] justify-center mt-5" >
            {posts.map((post, index) => (
              <li
                key={post.id}
                className="flex items-center justify-between cursor-pointer"
              >
                <label
                  htmlFor=""
                  className={`
                  text-2xl 
                  ${!!post.published && "line-through"}
                `}
                  onClick={async () => {
                    await togglePost({ id: post.id, published: !post.published })
                  }}
                >{post.title}</label>
                <div className="flex items-center gap-[1rem]">
                  <AiFillDelete
                    color="red"
                    className="cursor-pointer"
                    size={20}
                    onClick={async () => {
                      await deletePost({ id: post.id })
                    }}
                  />
                  <IoIosArchive
                    onClick={() => router.push(`/posts/${post.id}`)}
                  />
                </div>
              </li>
            ))}
          </ul>
          {showNoMoreDataText && <p className="text-gray-500 py-2 text-center">no more data</p>}
          <div ref={ref} className="invisible"></div>
        </div>
        <Button type='button' disabled={false} danger onClick={() => signOut()}>sign out</Button>

      </div>

    </div>
  );
}

