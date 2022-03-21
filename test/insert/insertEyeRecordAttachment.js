const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const eyeObjs = ctx.eyes.obj
  const recordObjs = ctx.eyeRecords.obj
  const projectObjs = ctx.projects.obj
  const eyeRecordAttachments = [
    {
      name: 'attachment1',
      type: 'png',
      size: 1024,
      key: 'attachment1',
      url: 'fake.url/attachment1',
      eyeId: eyeObjs.eye1.id,
      recordId: recordObjs['cam1-202202010800'].id,
      projectId: projectObjs.project1.id
    },
    {
      name: 'attachment1',
      type: 'jpg',
      size: 512,
      key: 'attachment2',
      url: 'fake.url/attachment2',
      eyeId: eyeObjs.eye2.id,
      recordId: recordObjs['cam2-202202010800'].id,
      projectId: projectObjs.project1.id
    },
    {
      name: 'attachment3',
      type: 'mp4',
      size: 5120,
      key: 'attachment3',
      url: 'fake.url/attachment3',
      eyeId: eyeObjs.eye3.id,
      recordId: recordObjs['cam3-202203010800'].id,
      projectId: projectObjs.project2.id
    }
  ]

  const docs = await prisma.$transaction(
    eyeRecordAttachments.map((attachment) => prisma.eyeRecordAttachment.create({ data: attachment }))
  )

  ctx.eyeRecordAttachments = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.id
    })
  }
}
