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
  const projectNum = parseInt(req.query.projectNum as string);
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;
  const action = req.query.action as string;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (!projectNum) {
    return res.status(200).json({ data: [] });
  }

  const project = await prisma.project.findFirst({
    where: {
      num: projectNum,
      team: { slug: teamSlug },
    },
  });

  if (!project) {
    return res.status(500).json({ error: "找不到資料" });
  }

  const startTime: any = new Date(startDate);
  const endTime: any = new Date(endDate);
  const timeDiff = endTime - startTime;

  let groupInterval = 60; // sec
  if (timeDiff >= 180 * day) {
    // 180 day 以上，間隔30 day
    groupInterval = (30 * day) / 1000;
  } else if (timeDiff >= 30 * day) {
    // 30 day 以上，間隔7 day
    groupInterval = (7 * day) / 1000;
  } else if (timeDiff >= 7 * day) {
    // 7day 以上，間隔1day
    groupInterval = (1 * day) / 1000;
  } else if (timeDiff >= 3 * day) {
    // 3day 以上，間隔6hr
    groupInterval = (6 * hour) / 1000;
  } else if (timeDiff >= 24 * hour) {
    // 24hr 以上，間隔3hr
    groupInterval = (3 * hour) / 1000;
  } else if (timeDiff >= 12 * hour) {
    // 12hr 以上，間隔1hr
    groupInterval = (1 * hour) / 1000;
  } else if (timeDiff >= 5 * hour) {
    // 5hr 以上，間隔30min
    groupInterval = (30 * minute) / 1000;
  } else if (timeDiff >= 2 * hour) {
    // 2hr 以上，間隔10min
    groupInterval = (10 * minute) / 1000;
  } else if (timeDiff >= 30 * minute) {
    // 30min 以上，間隔5min
    groupInterval = (5 * minute) / 1000;
  }

  // 多取一個時間區間
  const endTime2 = new Date(endTime.getTime() + groupInterval * 1000);

  const data = await prisma.$queryRaw`
    SELECT
      count(*) as dataCount,
      sum(count) as sum,
      FROM_UNIXTIME( FLOOR(UNIX_TIMESTAMP(date) / ${groupInterval.toString()}) * ${groupInterval.toString()} ) as timeKey
    FROM 
      EyeRecordResult 
    WHERE projectId = ${project.id}  
    AND action = ${action}
    AND date >= ${startTime}
    AND date < ${endTime2}
    GROUP BY 
      timeKey
  `;

  if (data) {
    return res.status(200).json({ data });
  }

  return res.status(500).json({ error: "找不到資料" });
});
