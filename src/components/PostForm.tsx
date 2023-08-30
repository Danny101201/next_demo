import { RouterInputs, api } from '@/utils/api'
import { createPostSchema, type CreatePostSchema } from '@/validate/api/post'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { FieldError, FieldErrors, SubmitHandler, useForm } from 'react-hook-form'
import { Input } from './Input'
import { Button } from './Button'
import { TRPCClientError } from '@trpc/client'
import { queryClient } from './Provider'

export const PostForm = () => {
  const utils = api.useContext()
  const { mutateAsync: createPost } = api.posts.addPost.useMutation({
    onSuccess: () => {
      utils.posts.getPosts.invalidate()
      console.log('onSuccess')
    },
    onError: (e) => {
      if (e instanceof TRPCClientError) {
        console.log('TRPCClientError')
      }
    }
  })
  const { register, formState: { errors }, handleSubmit } = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    mode: 'onChange',
    defaultValues: {
      published: false
    }
  })
  const onSubmit: SubmitHandler<CreatePostSchema> = async (data) => {
    await createPost(data)
  }

  return (

    <div
      className="
        bg-white
          px-4
          py-8
          shadow
          sm:rounded-lg
          sm:px-10
        "
    >
      <form
        className="space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label='Title'
          register={register}
          id='title'
          disable={false}
          required
          error={errors.title}
        />
        <Input
          label='content'
          register={register}
          id='content'
          disable={false}
          error={errors.content}
        />
        <Button type='submit' disabled={false} fullWidth>submit</Button>
      </form>

    </div>
  );
}

