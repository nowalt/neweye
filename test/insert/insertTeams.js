const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const teams = [
    {
      name: 'personalTeam1',
      slug: 'slug_team_1',
      userId: ctx.users.obj.user1.id
    },
    {
      name: 'personalTeam2',
      slug: 'slug_team_2',
      userId: ctx.users.obj.user2.id
    },
    {
      name: 'personalTeam3',
      slug: 'slug_team_3',
      userId: ctx.users.obj.user3.id
    },
    {
      name: 'publicTeam1',
      slug: 'slug_team_4'
    },
    {
      name: 'publicTeam2',
      slug: 'slug_team_5'
    },
    {
      name: 'publicTeam3',
      slug: 'slug_team_6'
    }
  ]

  await prisma.team.createMany({
    data: teams
  })
  const docs = await prisma.team.findMany({})

  ctx.teams = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.slug
    })
  }
}
