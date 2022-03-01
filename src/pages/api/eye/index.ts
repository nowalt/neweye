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
  const projectId = req.query.projectId as string;
  const num = parseInt(req.query.num as string);

  const eye = await prisma.eye.findFirst({
    where: {
      projectId,
      num,
    },
    include: {
      project: {
        include: {
          team: true,
        },
      },
    },
  });

  if (eye) {
    return res.status(200).json({ eye });
  }

  return res.status(500).json({ error: "找不到 eye" });
});
