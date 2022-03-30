const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const eyeRecordResults = []

  const records = ctx.eyeRecords.docs

  console.log('length', records.length)

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

  console.log('eyeRecordResults', eyeRecordResults.length)

  const insertLength = 5000
  for (let j = 0; j < eyeRecordResults.length; j += insertLength) {
    const result = await prisma.eyeRecordResult.createMany({
      data: eyeRecordResults.slice(j, insertLength + j)
    })

    console.log('result', j, result)
  }

  const docs = []
  const readLength = 5000
  for (let k = 0; k < eyeRecordResults.length; k += readLength) {
    const read = await prisma.eyeRecordResult.findMany({
      select: {
        id: true,
        eyeId: true,
        recordId: true,
        date: true,
        type: true,
        count: true,
        action: true,
        projectId: true
      },
      skip: k,
      take: readLength
    })

    console.log('read', read.length)

    docs.push(...read)
  }

  ctx.eyeRecordResults = {
    docs,
    obj: _.keyBy(docs, (o) => {
      return o.id
    })
  }
}
