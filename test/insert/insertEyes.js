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
      type: 'YOLOv1',
      num: 2,
      projectId: projectObjs.project1.id
    },
    {
      name: 'eye3',
      type: 'YOLOv2',
      num: 3,
      projectId: projectObjs.project2.id
    },
    {
      name: 'eye4',
      type: 'R-FCN',
      num: 4,
      projectId: projectObjs.project3.id
    }

  ]

  await prisma.eye.createMany({
    data: eyes
  })
  const docs = await prisma.eye.findMany({})

  ctx.eyes = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.name
    })
  }
}
