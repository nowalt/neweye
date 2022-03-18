const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const eyeObjs = ctx.eyes.obj
  const projectObjs = ctx.projects.obj
  const eyeRecords = [
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010800',
      data: {
        faceId: 'fake-face-id-01',
        boundingBox: { width: 0.35, height: 0.75, left: 0.37, top: 0.16 },
        imageId: 'fake-image-id-01',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 0)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010801',
      data: {
        faceId: 'fake-face-id-02',
        boundingBox: { width: 0.31, height: 0.71, left: 0.45, top: 0.22 },
        imageId: 'fake-image-id-02',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 1)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010802',
      data: {
        faceId: 'fake-face-id-03',
        boundingBox: { width: 0.22, height: 0.55, left: 0.31, top: 0.25 },
        imageId: 'fake-image-id-03',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 2)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010803',
      data: {
        faceId: 'fake-face-id-04',
        boundingBox: { width: 0.31, height: 0.76, left: 0.34, top: 0.54 },
        imageId: 'fake-image-id-04',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 3)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010804',
      data: {
        faceId: 'fake-face-id-05',
        boundingBox: { width: 0.12, height: 0.53, left: 0.87, top: 0.34 },
        imageId: 'fake-image-id-05',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 4)
    },

    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010800',
      data: {
        faceId: 'fake-face-id-06',
        boundingBox: { width: 0.31, height: 0.23, left: 0.54, top: 0.89 },
        imageId: 'fake-image-id-06',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 0)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010801',
      data: {
        faceId: 'fake-face-id-07',
        boundingBox: { width: 0.13, height: 0.53, left: 0.23, top: 0.11 },
        imageId: 'fake-image-id-07',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 1)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010802',
      data: {
        faceId: 'fake-face-id-08',
        boundingBox: { width: 0.62, height: 0.67, left: 0.15, top: 0.77 },
        imageId: 'fake-image-id-08',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 2)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010803',
      data: {
        faceId: 'fake-face-id-09',
        boundingBox: { width: 0.63, height: 0.13, left: 0.77, top: 0.24 },
        imageId: 'fake-image-id-09',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 3)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010804',
      data: {
        faceId: 'fake-face-id-10',
        boundingBox: { width: 0.57, height: 0.15, left: 0.93, top: 0.15 },
        imageId: 'fake-image-id-10',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 4)
    },

    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010800',
      data: {
        faceId: 'fake-face-id-11',
        boundingBox: { width: 0.14, height: 0.32, left: 0.35, top: 0.76 },
        imageId: 'fake-image-id-11',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 0)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010801',
      data: {
        faceId: 'fake-face-id-12',
        boundingBox: { width: 0.13, height: 0.53, left: 0.23, top: 0.11 },
        imageId: 'fake-image-id-12',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 1)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010802',
      data: {
        faceId: 'fake-face-id-13',
        boundingBox: { width: 0.62, height: 0.67, left: 0.15, top: 0.77 },
        imageId: 'fake-image-id-13',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 2)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010803',
      data: {
        faceId: 'fake-face-id-14',
        boundingBox: { width: 0.63, height: 0.13, left: 0.77, top: 0.24 },
        imageId: 'fake-image-id-14',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 3)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010804',
      data: {
        faceId: 'fake-face-id-15',
        boundingBox: { width: 0.57, height: 0.15, left: 0.93, top: 0.15 },
        imageId: 'fake-image-id-15',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 4)
    },

    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010800',
      data: {
        faceId: 'fake-face-id-16',
        boundingBox: { width: 0.14, height: 0.32, left: 0.35, top: 0.76 },
        imageId: 'fake-image-id-16',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 0)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010801',
      data: {
        faceId: 'fake-face-id-17',
        boundingBox: { width: 0.11, height: 0.51, left: 0.13, top: 0.41 },
        imageId: 'fake-image-id-17',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 1)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010802',
      data: {
        faceId: 'fake-face-id-18',
        boundingBox: { width: 0.11, height: 0.13, left: 0.41, top: 0.55 },
        imageId: 'fake-image-id-18',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 2)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010803',
      data: {
        faceId: 'fake-face-id-19',
        boundingBox: { width: 0.13, height: 0.41, left: 0.13, top: 0.44 },
        imageId: 'fake-image-id-19',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 3)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010804',
      data: {
        faceId: 'fake-face-id-20',
        boundingBox: { width: 0.14, height: 0.35, left: 0.22, top: 0.31 },
        imageId: 'fake-image-id-20',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 4)
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
