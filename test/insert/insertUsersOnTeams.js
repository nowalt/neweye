const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const teamObjs = ctx.teams.obj
  const userObjs = ctx.users.obj
  const usersOnTeams = [
    {
      teamId: teamObjs.slug_team_1.id,
      userId: userObjs.user1.id,
      isAdmin: true
    },
    {
      teamId: teamObjs.slug_team_1.id,
      userId: userObjs.user2.id,
      isAdmin: false
    },
    {
      teamId: teamObjs.slug_team_1.id,
      userId: userObjs.user3.id,
      isAdmin: false
    },

    {
      teamId: teamObjs.slug_team_2.id,
      userId: userObjs.user1.id,
      isAdmin: false
    },
    {
      teamId: teamObjs.slug_team_2.id,
      userId: userObjs.user2.id,
      isAdmin: true
    },
    {
      teamId: teamObjs.slug_team_2.id,
      userId: userObjs.user3.id,
      isAdmin: false
    },

    {
      teamId: teamObjs.slug_team_3.id,
      userId: userObjs.user1.id,
      isAdmin: false
    },
    {
      teamId: teamObjs.slug_team_3.id,
      userId: userObjs.user2.id,
      isAdmin: false
    },
    {
      teamId: teamObjs.slug_team_3.id,
      userId: userObjs.user3.id,
      isAdmin: true
    }
  ]

  await prisma.usersOnTeams.createMany({
    data: usersOnTeams
  })
  const docs = await prisma.usersOnTeams.findMany({})

  ctx.usersOnTeams = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.id
    })
  }
}
