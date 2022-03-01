import { NextApiRequest, NextApiResponse } from "next";
import { User } from "@prisma/client";

import prisma from "../../../server/db/prisma";
import handler from "../../../server/api-route";

export interface Request extends NextApiRequest {
  // Passport adds these to the request object
  logout: () => void;
  user?: Express.User;
  protocol?: string;
}

export default handler().use(async (req: Request, res: NextApiResponse) => {
  let user: User | null = null;
  if (req.user && req.user.id) {
    user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      include: {
        teams: {
          include: {
            team: true,
          },
          orderBy: [
            {
              team: {
                userId: "desc",
              },
            },
            {
              team: {
                name: "asc",
              },
            },
          ],
        },
      },
    });
  }
  return res.status(200).json({ user });
});
