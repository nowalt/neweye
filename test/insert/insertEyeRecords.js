const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const eyeObjs = ctx.eyes.obj
  const projectObjs = ctx.projects.obj
  const eyeRecords = [
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1',
      data: {
        faceId: 'fake-face-id-01',
        boundingBox: { width: 0.35, height: 0.75, left: 0.37, top: 0.16 },
        imageId: 'fake-image-id-01',
        confidence: 100
      },
      projectId: projectObjs.project1.id
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2',
      data: {
        faceId: 'fake-face-id-02',
        boundingBox: { width: 0.3, height: 0.7, left: 0.3, top: 0.15 },
        imageId: 'fake-image-id-02',
        confidence: 100
      },
      projectId: projectObjs.project2.id
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3',
      data: {
        faceId: 'fake-face-id-03',
        boundingBox: { width: 0.35, height: 0.75, left: 0.35, top: 0.2 },
        imageId: 'fake-image-id-03',
        confidence: 100
      },
      projectId: projectObjs.project3.id
    }
  ]

  const docs = await prisma.$transaction(
    eyeRecords.map((record) => prisma.eyeRecord.create({ data: record }))
  )

  ctx.eyeRecords = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.clientId
    })
  }
}
