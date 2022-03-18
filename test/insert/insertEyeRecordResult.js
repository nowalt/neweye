const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const eyeObjs = ctx.eyes.obj
  const recordObjs = ctx.eyeRecords.obj
  const projectObjs = ctx.projects.obj

  const eyeRecordResults = [
    {
      eyeId: eyeObjs.eye1.id,
      recordId: recordObjs['cam1-202202010800'].id,
      type: 'people',
      count: 10,
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 0)
    },
    {
      eyeId: eyeObjs.eye1.id,
      recordId: recordObjs['cam1-202202010801'].id,
      type: 'people',
      count: 13,
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 1)
    },
    {
      eyeId: eyeObjs.eye1.id,
      recordId: recordObjs['cam1-202202010802'].id,
      type: 'people',
      count: 9,
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 2)
    },
    {
      eyeId: eyeObjs.eye1.id,
      recordId: recordObjs['cam1-202202010803'].id,
      type: 'people',
      count: 22,
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 3)
    },
    {
      eyeId: eyeObjs.eye1.id,
      recordId: recordObjs['cam1-202202010804'].id,
      type: 'people',
      count: 19,
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 4)
    },

    {
      eyeId: eyeObjs.eye2.id,
      recordId: recordObjs['cam2-202202010800'].id,
      type: 'people',
      count: 5,
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 0)
    },
    {
      eyeId: eyeObjs.eye2.id,
      recordId: recordObjs['cam2-202202010801'].id,
      type: 'people',
      count: 11,
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 1)
    },
    {
      eyeId: eyeObjs.eye2.id,
      recordId: recordObjs['cam2-202202010802'].id,
      type: 'people',
      count: 11,
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 2)
    },
    {
      eyeId: eyeObjs.eye2.id,
      recordId: recordObjs['cam2-202202010803'].id,
      type: 'people',
      count: 18,
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 3)
    },
    {
      eyeId: eyeObjs.eye1.id,
      recordId: recordObjs['cam2-202202010804'].id,
      type: 'people',
      count: 21,
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 4)
    },

    {
      eyeId: eyeObjs.eye3.id,
      recordId: recordObjs['cam3-202203010800'].id,
      type: 'dog',
      count: 15,
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 0)
    },
    {
      eyeId: eyeObjs.eye3.id,
      recordId: recordObjs['cam3-202203010801'].id,
      type: 'dog',
      count: 2,
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 1)
    },
    {
      eyeId: eyeObjs.eye3.id,
      recordId: recordObjs['cam3-202203010802'].id,
      type: 'dog',
      count: 5,
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 2)
    },
    {
      eyeId: eyeObjs.eye3.id,
      recordId: recordObjs['cam3-202203010803'].id,
      type: 'dog',
      count: 1,
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 3)
    },
    {
      eyeId: eyeObjs.eye3.id,
      recordId: recordObjs['cam3-202203010804'].id,
      type: 'dog',
      count: 3,
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 4)
    },

    {
      eyeId: eyeObjs.eye4.id,
      recordId: recordObjs['cam4-202203010800'].id,
      type: 'car',
      count: 11,
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 0)
    },
    {
      eyeId: eyeObjs.eye4.id,
      recordId: recordObjs['cam4-202203010801'].id,
      type: 'car',
      count: 23,
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 1)
    },
    {
      eyeId: eyeObjs.eye4.id,
      recordId: recordObjs['cam4-202203010802'].id,
      type: 'car',
      count: 31,
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 2)
    },
    {
      eyeId: eyeObjs.eye4.id,
      recordId: recordObjs['cam4-202203010803'].id,
      type: 'car',
      count: 12,
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 3)
    },
    {
      eyeId: eyeObjs.eye4.id,
      recordId: recordObjs['cam4-202203010804'].id,
      type: 'car',
      count: 22,
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 4)
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
