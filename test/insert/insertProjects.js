const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const projects = [
    {
      name: 'project1',
      num: 1,
      teamId: ctx.teams.obj.slug_team_1.id,
      type: 'people-count'
    },
    {
      name: 'project2',
      num: 2,
      teamId: ctx.teams.obj.slug_team_2.id,
      type: 'people-count'
    },
    {
      name: 'project3',
      num: 3,
      teamId: ctx.teams.obj.slug_team_3.id,
      type: 'car-count'
    }
  ]

  await prisma.project.createMany({
    data: projects
  })
  const docs = await prisma.project.findMany({})

  ctx.projects = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.name
    })
  }
}
