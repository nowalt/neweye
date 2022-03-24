const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const eyeObjs = ctx.eyes.obj
  const projectObjs = ctx.projects.obj
  const eyeRecords = []

  const timeInterval = 60
  const time = new Date()
  time.setMinutes(time.getMinutes() - timeInterval)
  for (let i = 0; i < timeInterval; i++) {
    time.setMinutes(time.getMinutes() + 1)
    const time2 = new Date(time)

    const data = {
      eyeId: eyeObjs.eye1.id,
      clientId: `in-cam1-data-${i + 1}`,
      data: {
        faceId: `fake-cam1-face-id-${i + 1}`,
        boundingBox: { width: 0.14, height: 0.35, left: 0.22, top: 0.31 },
        imageId: `fake-cam1-image-id-${i + 1}`,
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: time2
    }
    eyeRecords.push(data)

    const data2 = {
      eyeId: eyeObjs.eye1.id,
      clientId: `out-cam1-data-${i + 1}`,
      data: {
        faceId: `fake-cam1-face-id-${i + 1}`,
        boundingBox: { width: 0.14, height: 0.35, left: 0.22, top: 0.31 },
        imageId: `fake-cam1-image-id-${i + 1}`,
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: time2
    }
    eyeRecords.push(data2)
  }

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
