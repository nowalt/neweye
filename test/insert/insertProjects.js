const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const projects = [
    {
      name: 'project1',
      num: 1,
      teamId: ctx.teams.obj.slug_team_1.id
    },
    {
      name: 'project2',
      num: 2,
      teamId: ctx.teams.obj.slug_team_2.id
    },
    {
      name: 'project3',
      num: 3,
      teamId: ctx.teams.obj.slug_team_3.id
    }
  ]

  const docs = await prisma.$transaction(
    projects.map((project) => prisma.project.create({ data: project }))
  )

  ctx.projects = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.name
    })
  }
}
