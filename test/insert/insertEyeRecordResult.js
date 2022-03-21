const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const eyeObjs = ctx.eyes.obj
  const recordObjs = ctx.eyeRecords.obj
  const projectObjs = ctx.projects.obj

  const eyeRecordResults = [
    // eye1
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010800'].id,
    //   type: 'people',
    //   count: 10,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 0)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010801'].id,
    //   type: 'people',
    //   count: 13,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 1)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010802'].id,
    //   type: 'people',
    //   count: 9,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 2)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010803'].id,
    //   type: 'people',
    //   count: 22,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 3)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010804'].id,
    //   type: 'people',
    //   count: 19,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 4)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010805'].id,
    //   type: 'people',
    //   count: 15,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 5)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010806'].id,
    //   type: 'people',
    //   count: 22,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 6)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010807'].id,
    //   type: 'people',
    //   count: 13,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 7)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010808'].id,
    //   type: 'people',
    //   count: 9,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 8)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010809'].id,
    //   type: 'people',
    //   count: 17,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 9)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010810'].id,
    //   type: 'people',
    //   count: 11,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 10)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010811'].id,
    //   type: 'people',
    //   count: 21,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 11)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010812'].id,
    //   type: 'people',
    //   count: 15,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 12)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010813'].id,
    //   type: 'people',
    //   count: 9,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 13)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010814'].id,
    //   type: 'people',
    //   count: 20,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 14)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010815'].id,
    //   type: 'people',
    //   count: 15,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 15)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010816'].id,
    //   type: 'people',
    //   count: 13,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 16)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010817'].id,
    //   type: 'people',
    //   count: 17,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 17)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010818'].id,
    //   type: 'people',
    //   count: 19,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 18)
    // },
    // {
    //   eyeId: eyeObjs.eye1.id,
    //   recordId: recordObjs['cam1-202202010819'].id,
    //   type: 'people',
    //   count: 23,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 19)
    // },

    // // eye2
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010800'].id,
    //   type: 'people',
    //   count: 5,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 0)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010801'].id,
    //   type: 'people',
    //   count: 11,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 1)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010802'].id,
    //   type: 'people',
    //   count: 11,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 2)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010803'].id,
    //   type: 'people',
    //   count: 18,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 3)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010804'].id,
    //   type: 'people',
    //   count: 21,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 4)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010805'].id,
    //   type: 'people',
    //   count: 15,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 5)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010806'].id,
    //   type: 'people',
    //   count: 21,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 6)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010807'].id,
    //   type: 'people',
    //   count: 12,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 7)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010808'].id,
    //   type: 'people',
    //   count: 11,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 8)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010809'].id,
    //   type: 'people',
    //   count: 9,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 9)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010810'].id,
    //   type: 'people',
    //   count: 15,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 10)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010811'].id,
    //   type: 'people',
    //   count: 21,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 11)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010812'].id,
    //   type: 'people',
    //   count: 13,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 12)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010813'].id,
    //   type: 'people',
    //   count: 15,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 13)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010814'].id,
    //   type: 'people',
    //   count: 3,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 14)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010815'].id,
    //   type: 'people',
    //   count: 25,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 15)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010816'].id,
    //   type: 'people',
    //   count: 13,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 16)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010817'].id,
    //   type: 'people',
    //   count: 17,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 17)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010818'].id,
    //   type: 'people',
    //   count: 23,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 18)
    // },
    // {
    //   eyeId: eyeObjs.eye2.id,
    //   recordId: recordObjs['cam2-202202010819'].id,
    //   type: 'people',
    //   count: 21,
    //   projectId: projectObjs.project1.id,
    //   date: new Date(2022, 1, 1, 8, 19)
    // },

    // // eye3
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010800'].id,
    //   type: 'dog',
    //   count: 15,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 0)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010801'].id,
    //   type: 'dog',
    //   count: 2,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 1)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010802'].id,
    //   type: 'dog',
    //   count: 5,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 2)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010803'].id,
    //   type: 'dog',
    //   count: 1,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 3)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010804'].id,
    //   type: 'dog',
    //   count: 3,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 4)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010805'].id,
    //   type: 'dog',
    //   count: 11,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 5)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010806'].id,
    //   type: 'dog',
    //   count: 9,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 6)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010807'].id,
    //   type: 'dog',
    //   count: 3,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 7)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010808'].id,
    //   type: 'dog',
    //   count: 8,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 8)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010809'].id,
    //   type: 'dog',
    //   count: 6,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 9)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010810'].id,
    //   type: 'dog',
    //   count: 13,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 10)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010811'].id,
    //   type: 'dog',
    //   count: 5,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 11)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010812'].id,
    //   type: 'dog',
    //   count: 3,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 12)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010813'].id,
    //   type: 'dog',
    //   count: 9,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 13)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010814'].id,
    //   type: 'dog',
    //   count: 11,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 14)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010815'].id,
    //   type: 'dog',
    //   count: 6,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 15)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010816'].id,
    //   type: 'dog',
    //   count: 3,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 16)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010817'].id,
    //   type: 'dog',
    //   count: 7,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 17)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010818'].id,
    //   type: 'dog',
    //   count: 6,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 18)
    // },
    // {
    //   eyeId: eyeObjs.eye3.id,
    //   recordId: recordObjs['cam3-202203010819'].id,
    //   type: 'dog',
    //   count: 1,
    //   projectId: projectObjs.project2.id,
    //   date: new Date(2022, 2, 1, 8, 19)
    // },

    // // eye4
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010800'].id,
    //   type: 'car',
    //   count: 11,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 0)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010801'].id,
    //   type: 'car',
    //   count: 23,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 1)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010802'].id,
    //   type: 'car',
    //   count: 31,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 2)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010803'].id,
    //   type: 'car',
    //   count: 12,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 3)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010804'].id,
    //   type: 'car',
    //   count: 22,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 4)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010805'].id,
    //   type: 'car',
    //   count: 27,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 5)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010806'].id,
    //   type: 'car',
    //   count: 15,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 6)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010807'].id,
    //   type: 'car',
    //   count: 19,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 7)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010808'].id,
    //   type: 'car',
    //   count: 22,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 8)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010809'].id,
    //   type: 'car',
    //   count: 18,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 9)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010810'].id,
    //   type: 'car',
    //   count: 3,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 10)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010811'].id,
    //   type: 'car',
    //   count: 21,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 11)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010812'].id,
    //   type: 'car',
    //   count: 16,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 12)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010813'].id,
    //   type: 'car',
    //   count: 22,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 13)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010814'].id,
    //   type: 'car',
    //   count: 25,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 14)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010815'].id,
    //   type: 'car',
    //   count: 21,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 15)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010816'].id,
    //   type: 'car',
    //   count: 13,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 16)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010817'].id,
    //   type: 'car',
    //   count: 17,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 17)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010818'].id,
    //   type: 'car',
    //   count: 17,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 18)
    // },
    // {
    //   eyeId: eyeObjs.eye4.id,
    //   recordId: recordObjs['cam4-202203010819'].id,
    //   type: 'car',
    //   count: 29,
    //   projectId: projectObjs.project3.id,
    //   date: new Date(2022, 2, 1, 8, 19)
    // }
  ]

  for (let i = 0; i < 20; i++) {
    const data = {
      eyeId: eyeObjs.eye1.id,
      recordId: recordObjs[`cam1-data-${i + 1}`].id,
      type: 'person',
      count: parseInt(Math.random() * 30),
      projectId: projectObjs.project1.id,
      date: recordObjs[`cam1-data-${i + 1}`].date
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
