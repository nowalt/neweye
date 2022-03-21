const _ = require('lodash')

module.exports = async (prisma, ctx) => {
  const eyeObjs = ctx.eyes.obj
  const projectObjs = ctx.projects.obj
  const eyeRecords = [
    // eye1
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010800',
      data: {
        faceId: 'fake-cam1-face-id-01',
        boundingBox: { width: 0.35, height: 0.75, left: 0.37, top: 0.16 },
        imageId: 'fake-cam1-image-id-01',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 0)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010801',
      data: {
        faceId: 'fake-cam1-face-id-02',
        boundingBox: { width: 0.31, height: 0.71, left: 0.45, top: 0.22 },
        imageId: 'fake-cam1-image-id-02',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 1)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010802',
      data: {
        faceId: 'fake-cam1-face-id-03',
        boundingBox: { width: 0.22, height: 0.55, left: 0.31, top: 0.25 },
        imageId: 'fake-cam1-image-id-03',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 2)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010803',
      data: {
        faceId: 'fake-cam1-face-id-04',
        boundingBox: { width: 0.31, height: 0.76, left: 0.34, top: 0.54 },
        imageId: 'fake-cam1-image-id-04',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 3)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010804',
      data: {
        faceId: 'fake-cam1-face-id-05',
        boundingBox: { width: 0.12, height: 0.53, left: 0.87, top: 0.34 },
        imageId: 'fake-cam1-image-id-05',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 4)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010805',
      data: {
        faceId: 'fake-cam1-face-id-06',
        boundingBox: { width: 0.35, height: 0.75, left: 0.37, top: 0.16 },
        imageId: 'fake-cam1-image-id-06',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 5)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010806',
      data: {
        faceId: 'fake-cam1-face-id-07',
        boundingBox: { width: 0.31, height: 0.71, left: 0.45, top: 0.22 },
        imageId: 'fake-cam1-image-id-07',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 6)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010807',
      data: {
        faceId: 'fake-cam1-face-id-08',
        boundingBox: { width: 0.22, height: 0.55, left: 0.31, top: 0.25 },
        imageId: 'fake-cam1-image-id-08',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 7)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010808',
      data: {
        faceId: 'fake-cam1-face-id-09',
        boundingBox: { width: 0.31, height: 0.76, left: 0.34, top: 0.54 },
        imageId: 'fake-cam1-image-id-09',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 8)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010809',
      data: {
        faceId: 'fake-cam1-face-id-10',
        boundingBox: { width: 0.12, height: 0.53, left: 0.87, top: 0.34 },
        imageId: 'fake-cam1-image-id-10',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 9)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010810',
      data: {
        faceId: 'fake-cam1-face-id-11',
        boundingBox: { width: 0.35, height: 0.75, left: 0.37, top: 0.16 },
        imageId: 'fake-cam1-image-id-11',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 10)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010811',
      data: {
        faceId: 'fake-cam1-face-id-12',
        boundingBox: { width: 0.31, height: 0.71, left: 0.45, top: 0.22 },
        imageId: 'fake-cam1-image-id-12',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 11)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010812',
      data: {
        faceId: 'fake-cam1-face-id-13',
        boundingBox: { width: 0.22, height: 0.55, left: 0.31, top: 0.25 },
        imageId: 'fake-cam1-image-id-13',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 12)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010813',
      data: {
        faceId: 'fake-cam1-face-id-14',
        boundingBox: { width: 0.31, height: 0.76, left: 0.34, top: 0.54 },
        imageId: 'fake-cam1-image-id-14',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 13)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010814',
      data: {
        faceId: 'fake-cam1-face-id-15',
        boundingBox: { width: 0.12, height: 0.53, left: 0.87, top: 0.34 },
        imageId: 'fake-cam1-image-id-15',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 14)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010815',
      data: {
        faceId: 'fake-cam1-face-id-16',
        boundingBox: { width: 0.35, height: 0.75, left: 0.37, top: 0.16 },
        imageId: 'fake-cam1-image-id-16',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 15)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010816',
      data: {
        faceId: 'fake-cam1-face-id-17',
        boundingBox: { width: 0.31, height: 0.71, left: 0.45, top: 0.22 },
        imageId: 'fake-cam1-image-id-17',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 16)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010817',
      data: {
        faceId: 'fake-cam1-face-id-18',
        boundingBox: { width: 0.22, height: 0.55, left: 0.31, top: 0.25 },
        imageId: 'fake-cam1-image-id-18',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 17)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010818',
      data: {
        faceId: 'fake-cam1-face-id-19',
        boundingBox: { width: 0.31, height: 0.76, left: 0.34, top: 0.54 },
        imageId: 'fake-cam1-image-id-19',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 18)
    },
    {
      eyeId: eyeObjs.eye1.id,
      clientId: 'cam1-202202010819',
      data: {
        faceId: 'fake-cam1-face-id-20',
        boundingBox: { width: 0.12, height: 0.53, left: 0.87, top: 0.34 },
        imageId: 'fake-cam1-image-id-20',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 19)
    },

    // eye2
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010800',
      data: {
        faceId: 'fake-cam2-face-id-01',
        boundingBox: { width: 0.31, height: 0.23, left: 0.54, top: 0.89 },
        imageId: 'fake-cam2-image-id-01',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 0)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010801',
      data: {
        faceId: 'fake-cam2-face-id-02',
        boundingBox: { width: 0.13, height: 0.53, left: 0.23, top: 0.11 },
        imageId: 'fake-cam2-image-id-02',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 1)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010802',
      data: {
        faceId: 'fake-cam2-face-id-03',
        boundingBox: { width: 0.62, height: 0.67, left: 0.15, top: 0.77 },
        imageId: 'fake-cam2-image-id-03',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 2)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010803',
      data: {
        faceId: 'fake-cam2-face-id-04',
        boundingBox: { width: 0.63, height: 0.13, left: 0.77, top: 0.24 },
        imageId: 'fake-cam2-image-id-04',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 3)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010804',
      data: {
        faceId: 'fake-cam2-face-id-05',
        boundingBox: { width: 0.57, height: 0.15, left: 0.93, top: 0.15 },
        imageId: 'fake-cam2-image-id-05',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 4)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010805',
      data: {
        faceId: 'fake-cam2-face-id-06',
        boundingBox: { width: 0.31, height: 0.23, left: 0.54, top: 0.89 },
        imageId: 'fake-cam2-image-id-06',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 5)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010806',
      data: {
        faceId: 'fake-cam2-face-id-07',
        boundingBox: { width: 0.13, height: 0.53, left: 0.23, top: 0.11 },
        imageId: 'fake-cam2-image-id-07',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 6)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010807',
      data: {
        faceId: 'fake-cam2-face-id-08',
        boundingBox: { width: 0.62, height: 0.67, left: 0.15, top: 0.77 },
        imageId: 'fake-cam2-image-id-08',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 7)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010808',
      data: {
        faceId: 'fake-cam2-face-id-09',
        boundingBox: { width: 0.63, height: 0.13, left: 0.77, top: 0.24 },
        imageId: 'fake-cam2-image-id-09',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 8)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010809',
      data: {
        faceId: 'fake-cam2-face-id-10',
        boundingBox: { width: 0.57, height: 0.15, left: 0.93, top: 0.15 },
        imageId: 'fake-cam2-image-id-10',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 9)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010810',
      data: {
        faceId: 'fake-cam2-face-id-11',
        boundingBox: { width: 0.31, height: 0.23, left: 0.54, top: 0.89 },
        imageId: 'fake-cam2-image-id-11',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 10)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010811',
      data: {
        faceId: 'fake-cam2-face-id-12',
        boundingBox: { width: 0.13, height: 0.53, left: 0.23, top: 0.11 },
        imageId: 'fake-cam2-image-id-12',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 11)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010812',
      data: {
        faceId: 'fake-cam2-face-id-13',
        boundingBox: { width: 0.62, height: 0.67, left: 0.15, top: 0.77 },
        imageId: 'fake-cam2-image-id-13',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 12)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010813',
      data: {
        faceId: 'fake-cam2-face-id-14',
        boundingBox: { width: 0.63, height: 0.13, left: 0.77, top: 0.24 },
        imageId: 'fake-cam2-image-id-14',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 13)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010814',
      data: {
        faceId: 'fake-cam2-face-id-15',
        boundingBox: { width: 0.57, height: 0.15, left: 0.93, top: 0.15 },
        imageId: 'fake-cam2-image-id-15',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 14)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010815',
      data: {
        faceId: 'fake-cam2-face-id-16',
        boundingBox: { width: 0.31, height: 0.23, left: 0.54, top: 0.89 },
        imageId: 'fake-cam2-image-id-16',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 15)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010816',
      data: {
        faceId: 'fake-cam2-face-id-17',
        boundingBox: { width: 0.13, height: 0.53, left: 0.23, top: 0.11 },
        imageId: 'fake-cam2-image-id-17',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 16)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010817',
      data: {
        faceId: 'fake-cam2-face-id-18',
        boundingBox: { width: 0.62, height: 0.67, left: 0.15, top: 0.77 },
        imageId: 'fake-cam2-image-id-18',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 17)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010818',
      data: {
        faceId: 'fake-cam2-face-id-19',
        boundingBox: { width: 0.63, height: 0.13, left: 0.77, top: 0.24 },
        imageId: 'fake-cam2-image-id-19',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 18)
    },
    {
      eyeId: eyeObjs.eye2.id,
      clientId: 'cam2-202202010819',
      data: {
        faceId: 'fake-cam2-face-id-20',
        boundingBox: { width: 0.57, height: 0.15, left: 0.93, top: 0.15 },
        imageId: 'fake-cam2-image-id-20',
        confidence: 100
      },
      projectId: projectObjs.project1.id,
      date: new Date(2022, 1, 1, 8, 19)
    },

    // eye3
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010800',
      data: {
        faceId: 'fake-cam3-face-id-01',
        boundingBox: { width: 0.14, height: 0.32, left: 0.35, top: 0.76 },
        imageId: 'fake-cam3-image-id-01',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 0)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010801',
      data: {
        faceId: 'fake-cam3-face-id-02',
        boundingBox: { width: 0.13, height: 0.53, left: 0.23, top: 0.11 },
        imageId: 'fake-cam3-image-id-02',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 1)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010802',
      data: {
        faceId: 'fake-cam3-face-id-03',
        boundingBox: { width: 0.62, height: 0.67, left: 0.15, top: 0.77 },
        imageId: 'fake-cam3-image-id-03',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 2)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010803',
      data: {
        faceId: 'fake-cam3-face-id-04',
        boundingBox: { width: 0.63, height: 0.13, left: 0.77, top: 0.24 },
        imageId: 'fake-cam3-image-id-04',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 3)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010804',
      data: {
        faceId: 'fake-cam3-face-id-05',
        boundingBox: { width: 0.57, height: 0.15, left: 0.93, top: 0.15 },
        imageId: 'fake-cam3-image-id-05',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 4)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010805',
      data: {
        faceId: 'fake-cam3-face-id-06',
        boundingBox: { width: 0.14, height: 0.32, left: 0.35, top: 0.76 },
        imageId: 'fake-cam3-image-id-06',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 5)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010806',
      data: {
        faceId: 'fake-cam3-face-id-07',
        boundingBox: { width: 0.13, height: 0.53, left: 0.23, top: 0.11 },
        imageId: 'fake-cam3-image-id-07',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 6)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010807',
      data: {
        faceId: 'fake-cam3-face-id-08',
        boundingBox: { width: 0.62, height: 0.67, left: 0.15, top: 0.77 },
        imageId: 'fake-cam3-image-id-08',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 7)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010808',
      data: {
        faceId: 'fake-cam3-face-id-09',
        boundingBox: { width: 0.63, height: 0.13, left: 0.77, top: 0.24 },
        imageId: 'fake-cam3-image-id-09',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 8)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010809',
      data: {
        faceId: 'fake-cam3-face-id-10',
        boundingBox: { width: 0.57, height: 0.15, left: 0.93, top: 0.15 },
        imageId: 'fake-cam3-image-id-10',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 9)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010810',
      data: {
        faceId: 'fake-cam3-face-id-11',
        boundingBox: { width: 0.14, height: 0.32, left: 0.35, top: 0.76 },
        imageId: 'fake-cam3-image-id-11',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 10)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010811',
      data: {
        faceId: 'fake-cam3-face-id-12',
        boundingBox: { width: 0.13, height: 0.53, left: 0.23, top: 0.11 },
        imageId: 'fake-cam3-image-id-12',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 11)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010812',
      data: {
        faceId: 'fake-cam3-face-id-13',
        boundingBox: { width: 0.62, height: 0.67, left: 0.15, top: 0.77 },
        imageId: 'fake-cam3-image-id-13',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 12)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010813',
      data: {
        faceId: 'fake-cam3-face-id-14',
        boundingBox: { width: 0.63, height: 0.13, left: 0.77, top: 0.24 },
        imageId: 'fake-cam3-image-id-14',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 13)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010814',
      data: {
        faceId: 'fake-cam3-face-id-15',
        boundingBox: { width: 0.57, height: 0.15, left: 0.93, top: 0.15 },
        imageId: 'fake-cam3-image-id-15',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 14)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010815',
      data: {
        faceId: 'fake-cam3-face-id-16',
        boundingBox: { width: 0.14, height: 0.32, left: 0.35, top: 0.76 },
        imageId: 'fake-cam3-image-id-16',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 15)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010816',
      data: {
        faceId: 'fake-cam3-face-id-17',
        boundingBox: { width: 0.13, height: 0.53, left: 0.23, top: 0.11 },
        imageId: 'fake-cam3-image-id-17',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 16)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010817',
      data: {
        faceId: 'fake-cam3-face-id-18',
        boundingBox: { width: 0.62, height: 0.67, left: 0.15, top: 0.77 },
        imageId: 'fake-cam3-image-id-18',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 17)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010818',
      data: {
        faceId: 'fake-cam3-face-id-19',
        boundingBox: { width: 0.63, height: 0.13, left: 0.77, top: 0.24 },
        imageId: 'fake-cam3-image-id-19',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 18)
    },
    {
      eyeId: eyeObjs.eye3.id,
      clientId: 'cam3-202203010819',
      data: {
        faceId: 'fake-cam3-face-id-20',
        boundingBox: { width: 0.57, height: 0.15, left: 0.93, top: 0.15 },
        imageId: 'fake-cam3-image-id-20',
        confidence: 100
      },
      projectId: projectObjs.project2.id,
      date: new Date(2022, 2, 1, 8, 19)
    },

    // eye4
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010800',
      data: {
        faceId: 'fake-cam4-face-id-01',
        boundingBox: { width: 0.14, height: 0.32, left: 0.35, top: 0.76 },
        imageId: 'fake-cam4-image-id-01',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 0)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010801',
      data: {
        faceId: 'fake-cam4-face-id-02',
        boundingBox: { width: 0.11, height: 0.51, left: 0.13, top: 0.41 },
        imageId: 'fake-cam4-image-id-02',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 1)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010802',
      data: {
        faceId: 'fake-cam4-face-id-03',
        boundingBox: { width: 0.11, height: 0.13, left: 0.41, top: 0.55 },
        imageId: 'fake-cam4-image-id-03',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 2)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010803',
      data: {
        faceId: 'fake-cam4-face-id-04',
        boundingBox: { width: 0.13, height: 0.41, left: 0.13, top: 0.44 },
        imageId: 'fake-cam4-image-id-04',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 3)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010804',
      data: {
        faceId: 'fake-cam4-face-id-05',
        boundingBox: { width: 0.14, height: 0.35, left: 0.22, top: 0.31 },
        imageId: 'fake-cam4-image-id-05',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 4)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010805',
      data: {
        faceId: 'fake-cam4-face-id-06',
        boundingBox: { width: 0.14, height: 0.32, left: 0.35, top: 0.76 },
        imageId: 'fake-cam4-image-id-06',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 5)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010806',
      data: {
        faceId: 'fake-cam4-face-id-07',
        boundingBox: { width: 0.11, height: 0.51, left: 0.13, top: 0.41 },
        imageId: 'fake-cam4-image-id-07',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 6)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010807',
      data: {
        faceId: 'fake-cam4-face-id-08',
        boundingBox: { width: 0.11, height: 0.13, left: 0.41, top: 0.55 },
        imageId: 'fake-cam4-image-id-08',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 7)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010808',
      data: {
        faceId: 'fake-cam4-face-id-09',
        boundingBox: { width: 0.13, height: 0.41, left: 0.13, top: 0.44 },
        imageId: 'fake-cam4-image-id-09',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 8)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010809',
      data: {
        faceId: 'fake-cam4-face-id-10',
        boundingBox: { width: 0.14, height: 0.35, left: 0.22, top: 0.31 },
        imageId: 'fake-cam4-image-id-10',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 9)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010810',
      data: {
        faceId: 'fake-cam4-face-id-11',
        boundingBox: { width: 0.14, height: 0.32, left: 0.35, top: 0.76 },
        imageId: 'fake-cam4-image-id-11',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 10)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010811',
      data: {
        faceId: 'fake-cam4-face-id-12',
        boundingBox: { width: 0.11, height: 0.51, left: 0.13, top: 0.41 },
        imageId: 'fake-cam4-image-id-12',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 11)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010812',
      data: {
        faceId: 'fake-cam4-face-id-13',
        boundingBox: { width: 0.11, height: 0.13, left: 0.41, top: 0.55 },
        imageId: 'fake-cam4-image-id-13',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 12)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010813',
      data: {
        faceId: 'fake-cam4-face-id-14',
        boundingBox: { width: 0.13, height: 0.41, left: 0.13, top: 0.44 },
        imageId: 'fake-cam4-image-id-14',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 13)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010814',
      data: {
        faceId: 'fake-cam4-face-id-15',
        boundingBox: { width: 0.14, height: 0.35, left: 0.22, top: 0.31 },
        imageId: 'fake-cam4-image-id-15',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 14)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010815',
      data: {
        faceId: 'fake-cam4-face-id-16',
        boundingBox: { width: 0.14, height: 0.32, left: 0.35, top: 0.76 },
        imageId: 'fake-cam4-image-id-16',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 15)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010816',
      data: {
        faceId: 'fake-cam4-face-id-17',
        boundingBox: { width: 0.11, height: 0.51, left: 0.13, top: 0.41 },
        imageId: 'fake-cam4-image-id-17',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 16)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010817',
      data: {
        faceId: 'fake-cam4-face-id-18',
        boundingBox: { width: 0.11, height: 0.13, left: 0.41, top: 0.55 },
        imageId: 'fake-cam4-image-id-18',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 17)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010818',
      data: {
        faceId: 'fake-cam4-face-id-19',
        boundingBox: { width: 0.13, height: 0.41, left: 0.13, top: 0.44 },
        imageId: 'fake-cam4-image-id-19',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 18)
    },
    {
      eyeId: eyeObjs.eye4.id,
      clientId: 'cam4-202203010819',
      data: {
        faceId: 'fake-cam4-face-id-20',
        boundingBox: { width: 0.14, height: 0.35, left: 0.22, top: 0.31 },
        imageId: 'fake-cam4-image-id-20',
        confidence: 100
      },
      projectId: projectObjs.project3.id,
      date: new Date(2022, 2, 1, 8, 19)
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
