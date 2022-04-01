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
  const { id, settings } = req.body;

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

  // 檢查eye存在
  const eye = await prisma.eye.findUnique({
    where: { id },
  });
  if (!eye) {
    return res.status(500).json({ error: "沒有找到eye" });
  }

  // // 檢查 name
  // const formattedName = name.trim();

  // if (!formattedName) {
  //   return res.status(500).json({ error: "eye name required" });
  // }

  const result = await prisma.eye.update({
    where: { id },
    data: {
      settings,
    },
  });

  return res.status(200).json({ result });
});
