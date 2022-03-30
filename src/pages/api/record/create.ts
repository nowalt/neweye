import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../server/db/prisma";
import handler from "../../../server/api-route";

export interface Request extends NextApiRequest {
  // Passport adds these to the request object
  logout: () => void;
  user?: Express.User;
  protocol?: string;
}

interface Result {
  type?: string;
  count?: number;
  action?: string;
}

export default handler().use(async (req: Request, res: NextApiResponse) => {
  const { eyeId, clientId, data = {}, results = [] } = req.body;

  // 檢查 req.user
  if (!req.user || !req.user.id) {
    return res.status(500).json({ error: "請先登入" });
  }

  // 找到登入用戶
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    return res.status(500).json({ error: "沒有找到登入用戶" });
  }

  if (!eyeId) {
    return res.status(500).json({ error: "eye id required" });
  }

  // 找尋是否已存在 eye
  const eye = await prisma.eye.findUnique({
    where: {
      id: eyeId,
    },
  });
  if (!eye) {
    return res.status(500).json({ error: "team 不存在" });
  }

  // create
  const record = await prisma.eyeRecord.create({
    data: {
      clientId,
      data,
      eye: { connect: { id: eye.id } },
      project: { connect: { id: eye.projectId } },
      results: {
        createMany: {
          data: results.map((doc: Result) => {
            return {
              eyeId: eye.id,
              projectId: eye.projectId,
              type: doc.type,
              cout: doc.count,
              action: doc.action,
            };
          }),
        },
      },
    },
  });

  return res.status(200).json({ record });
});
