import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../server/db/prisma";
import handler from "../../../server/api-route";

export interface Request extends NextApiRequest {
  // Passport adds these to the request object
  logout: () => void;
  user?: Express.User;
  protocol?: string;
}

export default handler().use(async (req: Request, res: NextApiResponse) => {
  // 由 body 拿到 input
  const { name, teamId } = req.body;

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

  // 檢查 name
  const formattedName = name.trim();

  if (!formattedName) {
    return res.status(500).json({ error: "project name required" });
  }

  // 檢查 slug
  if (!teamId) {
    return res.status(500).json({ error: "team id required" });
  }

  // 找尋是否已存在 slug
  const team = await prisma.team.findUnique({
    where: {
      id: teamId,
    },
  });
  if (!team) {
    return res.status(500).json({ error: "team 不存在" });
  }

  // 新增
  const count = await prisma.project.count({
    where: {
      teamId,
    },
  });

  const project = await prisma.project.create({
    data: {
      num: count + 1,
      name: formattedName,
      team: {
        connect: {
          id: team.id,
        },
      },
      // type: "yolov5s_web_model",
    },
  });

  return res.status(200).json({ project });
});
