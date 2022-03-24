const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const eyeObjs = ctx.eyes.obj
  const projectObjs = ctx.projects.obj
  const eyeRecords = []

  const timeInterval = 60 * 4 // min
  const timeGap = 15 // sec
  const time = new Date()
  time.setMinutes(time.getMinutes() - timeInterval)

  for (let i = 0; i < timeInterval * (60 / timeGap); i++) {
    // time.setMinutes(time.getMinutes()+1)
    time.setSeconds(time.getSeconds() + timeGap)

    const time2 = new Date(time)

    const data = {
      eyeId: eyeObjs.eye1.id,
      clientId: `cam1-data-${i + 1}`,
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
  }

  await prisma.eyeRecord.createMany({
    data: eyeRecords
  })
  const docs = await prisma.eyeRecord.findMany({})

  ctx.eyeRecords = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.clientId
    })
  }
}
