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
  const teamSlug = req.query.teamSlug as string;
  const num = parseInt(req.query.num as string);

  const project = await prisma.project.findFirst({
    where: {
      team: {
        slug: teamSlug,
      },
      num,
    },
    include: {
      team: true,
      eyes: {
        orderBy: [{ num: "asc" }],
      },
    },
  });

  if (project) {
    return res.status(200).json({ project });
  }

  return res.status(500).json({ error: "找不到 project" });
});
