const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const eyeObjs = ctx.eyes.obj

  const eyeRecordResults = []

  const records = ctx.eyeRecords.docs

  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    let action

    if (record.clientId.includes('in-')) {
      action = 'in'
    }

    if (record.clientId.includes('out-')) {
      action = 'out'
    }

    const data = {
      eyeId: eyeObjs.eye1.id,
      action,
      recordId: record.id,
      type: 'person',
      count: parseInt(Math.random() * 30),
      projectId: record.projectId,
      date: record.date
    }
    eyeRecordResults.push(data)
  }

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
