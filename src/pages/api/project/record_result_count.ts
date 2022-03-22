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
  const timeInterval = parseInt(req.query.timeInterval as string); // minute
  const action = req.query.action as string;

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

  let groupInterval = 60;
  switch (timeInterval) {
    case 10:
      groupInterval = 60;
      break;
    case 30:
      groupInterval = 5 * 60;
      break;
    case 60:
      groupInterval = 10 * 60;
      break;
  }

  const data = await prisma.$queryRaw`
    SELECT
      count(*) as dataCount,
      sum(count) as sum,
      FROM_UNIXTIME( FLOOR(UNIX_TIMESTAMP(date) / ${groupInterval.toString()}) * ${groupInterval.toString()} ) as timeKey
    FROM 
      EyeRecordResult 
    WHERE 
      projectId = ${project.id}  
    AND
      action = ${action}
    GROUP BY 
      timeKey
  `;

  console.log(data);

  if (data) {
    return res.status(200).json({ data });
  }

  return res.status(500).json({ error: "找不到資料" });
});
