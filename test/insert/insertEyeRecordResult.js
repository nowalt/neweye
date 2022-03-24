const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const eyeObjs = ctx.eyes.obj

  const eyeRecordResults = []

  const records = ctx.eyeRecords.docs

  for (let i = 0; i < records.length; i++) {
    const record = records[i]

    const data = {
      eyeId: record.eyeId,
      action: 'in',
      recordId: record.id,
      type: 'person',
      count: parseInt(Math.random() * 30),
      projectId: record.projectId,
      date: record.date
    }
    eyeRecordResults.push(data)

    const data2 = {
      eyeId: record.eyeId,
      action: 'out',
      recordId: record.id,
      type: 'person',
      count: parseInt(Math.random() * 30),
      projectId: record.projectId,
      date: record.date
    }
    eyeRecordResults.push(data2)
  }

  await prisma.eyeRecordResult.createMany({
    data: eyeRecordResults
  })
  const docs = await prisma.eyeRecordResult.findMany({})

  ctx.eyeRecordResults = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.id
    })
  }
}
