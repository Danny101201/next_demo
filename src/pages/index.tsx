import { PostForm } from "@/components/PostForm";
import { api } from "@/utils/api";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { AiFillDelete } from "react-icons/ai";
import { IoIosArchive } from "react-icons/io";

export default function Home() {
  const router = useRouter()
  const utils = api.useContext()
  const { data: posts, isLoading, isError, error } = api.posts.getPosts.useQuery(undefined, {
    trpc: {
      context: {
        skipBatch: true,
      }
    }
  })
  const { data: greetingdata } = api.greeting.useQuery({ name: 'Danny' })


  const { mutateAsync: togglePost } = api.posts.togglePostPublish.useMutation({
    onSuccess: () => {
      utils.posts.invalidate()
    }
  })
  const { mutateAsync: deletePost } = api.posts.deletePost.useMutation({
    onSuccess: () => {
      utils.posts.invalidate()
    }
  })
  if (isLoading) return 'isLoading'
  if (isError) return error.message
  return (
    <div className="bg-gray-100 min-h-screen overflow-y-auto p-4">
      <h2 className="text-center text-3xl">Create posts</h2>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <PostForm />
        <ul className="flex flex-col gap-[1rem] justify-center mt-5">
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
      </div>

    </div>
  );
}

