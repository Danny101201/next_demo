import { prisma } from "@/server/db"
import { faker } from '@faker-js/faker';

let PostsCount = 100
const main = async () => {
  try {
    await prisma.post.deleteMany({})
    const user = await prisma.user.findFirst({})
    if (!user) return
    const Posts = new Array(PostsCount).fill('_').map(() => prisma.post.create({
      data: {
        title: faker.lorem.slug(),
        content: faker.lorem.paragraph({ max: 3, min: 1 }),
        published: faker.datatype.boolean(0.5),
        author: {
          connect: {
            id: user?.id
          }
        }
      }
    }))
    await prisma.$transaction(Posts)
    console.log('success add post data')
  } catch (e) {
    console.log(e)
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.log(e)
    await prisma.$disconnect()
    process.exit(-1)
  })

