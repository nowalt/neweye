const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const projectObjs = ctx.projects.obj
  const eyes = [
    {
      name: 'eye1',
      type: 'YOLOv1',
      num: 1,
      projectId: projectObjs.project1.id
    },
    {
      name: 'eye2',
      type: 'YOLOv2',
      num: 2,
      projectId: projectObjs.project2.id
    },
    {
      name: 'eye3',
      type: 'R-FCN',
      num: 3,
      projectId: projectObjs.project3.id
    }
  ]

  const docs = await prisma.$transaction(
    eyes.map((eye) => prisma.eye.create({ data: eye }))
  )

  ctx.eyes = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.name
    })
  }
}
