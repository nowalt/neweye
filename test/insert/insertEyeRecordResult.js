const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const eyeObjs = ctx.eyes.obj
  const recordObjs = ctx.eyeRecords.obj
  const projectObjs = ctx.projects.obj
  const eyeRecordResults = [
    {
      eyeId: eyeObjs.eye1.id,
      recordId: recordObjs.cam1.id,
      type: 'people',
      count: 10,
      projectId: projectObjs.project1.id
    },
    {
      eyeId: eyeObjs.eye2.id,
      recordId: recordObjs.cam2.id,
      type: 'people',
      count: 20,
      projectId: projectObjs.project2.id
    },
    {
      eyeId: eyeObjs.eye3.id,
      recordId: recordObjs.cam3.id,
      type: 'dog',
      count: 10,
      projectId: projectObjs.project3.id
    }
  ]

  const docs = await prisma.$transaction(
    eyeRecordResults.map((result) => prisma.eyeRecordResult.create({ data: result }))
  )

  ctx.eyeRecordResults = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.id
    })
  }
}
