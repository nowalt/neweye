const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const eyeObjs = ctx.eyes.obj
  const projectObjs = ctx.projects.obj
  const eyeRecords = []

  const timeInterval = 30 * 24 * 60 // min
  const timeGap = 30 // sec
  const time = new Date()
  time.setMinutes(time.getMinutes() - timeInterval)

  for (let i = 0; i < timeInterval * (60 / timeGap); i++) {
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

    // const data2 = {
    //   eyeId: eyeObjs.eye2.id,
    //   clientId: `cam2-data-${i + 1}`,
    //   data: {
    //     faceId: `fake-cam2-face-id-${i + 1}`,
    //     boundingBox: { width: 0.14, height: 0.35, left: 0.22, top: 0.31 },
    //     imageId: `fake-cam2-image-id-${i + 1}`,
    //     confidence: 100
    //   },
    //   projectId: projectObjs.project1.id,
    //   date: time2
    // }
    // eyeRecords.push(data2)
  }

  console.log('eyeRecords', eyeRecords.length)

  const insertLength = 5000
  for (let j = 0; j < eyeRecords.length; j += insertLength) {
    const result = await prisma.eyeRecord.createMany({
      data: eyeRecords.slice(j, insertLength + j)
    })

    console.log('result', j, result)
  }

  const docs = []
  const readLength = 5000
  for (let k = 0; k < eyeRecords.length; k += readLength) {
    const read = await prisma.eyeRecord.findMany({
      select: {
        id: true,
        eyeId: true,
        clientId: true,
        date: true,
        projectId: true
      },
      skip: k,
      take: readLength
    })

    console.log('read', read.length)

    docs.push(...read)
  }

  console.log('record docs', docs.length)

  ctx.eyeRecords = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.clientId
    })
  }
}
