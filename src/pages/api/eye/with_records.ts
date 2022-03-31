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
  const skip = parseInt(req.query.skip as string);
  const take = parseInt(req.query.take as string);
  const startAt = req.query.startAt as string;
  const endAt = req.query.endAt as string;

  const defaultStart = new Date();
  defaultStart.setHours(0);
  defaultStart.setMinutes(0);
  defaultStart.setSeconds(0);
  defaultStart.setMilliseconds(0);

  const defaultEnd = new Date();
  defaultEnd.setHours(23);
  defaultEnd.setMinutes(59);
  defaultEnd.setSeconds(59);
  defaultEnd.setMilliseconds(999);

  const startTime = startAt ? new Date(startAt) : defaultStart;
  const endTime = endAt ? new Date(endAt) : defaultEnd;

  const eye = await prisma.eye.findFirst({
    where: {
      projectId,
      num,
    },
    include: {
      records: {
        where: {
          date: { lte: endTime, gte: startTime },
        },
        select: {
          id: true,
          date: true,
          results: true,
          clientId: true,
        },
        skip,
        take,
      },
    },
  });

  if (eye) {
    return res.status(200).json({
      eye,
      pageInfo: {
        hasNextPage: eye.records.length >= take,
      },
    });
  }

  return res.status(500).json({ error: "找不到 eye" });
});
