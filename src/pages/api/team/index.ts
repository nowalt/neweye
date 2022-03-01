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
  const inviteCode = (req.query.inviteCode as string) || undefined;
  const slug = (req.query.slug as string) || undefined;

  const team = await prisma.team.findUnique({
    where: {
      inviteCode,
      slug,
    },
    include: {
      members: {
        include: {
          user: true,
        },
        orderBy: [
          { isAdmin: "desc" },
          {
            user: {
              name: "asc",
            },
          },
        ],
      },
      projects: {
        orderBy: [{ name: "asc" }],
      },
    },
  });

  if (team) {
    return res.status(200).json({ team });
  }

  return res.status(500).json({ error: "找不到 Team" });
});
