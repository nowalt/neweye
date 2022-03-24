const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const users = [
    {
      name: 'user1',
      username: 'user1',
      phoneNumber: '11111111'
    },
    {
      name: 'user2',
      username: 'user2',
      phoneNumber: '22222222'
    },
    {
      name: 'user3',
      username: 'user3',
      phoneNumber: '33333333'
    }
  ]

  await prisma.user.createMany({
    data: users
  })
  const docs = await prisma.user.findMany({})

  ctx.users = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.username
    })
  }
}
