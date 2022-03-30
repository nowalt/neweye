import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../../server/db/prisma";
import handler from "../../../server/api-route";

export interface Request extends NextApiRequest {
  // Passport adds these to the request object
  logout: () => void;
  user?: Express.User;
  protocol?: string;
}

const minute = 60 * 1000;
const hour = 60 * minute;
const day = 24 * hour;

const getData1 = async (
  startDate: any,
  endDate: any,
  eyeId: string,
  action: string
) => {
  const startTime: any = new Date(startDate);
  const endTime: any = new Date(endDate);
  const timeDiff = endTime - startTime;

  let groupInterval = 60; // sec   // 資料group的範圍
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

  // 按照interval數值 把開始和結束時間取整數 (例如: interval=5 => 15:58 取到 15:55)
  const startTimeFloor =
    Math.floor(startTime / (groupInterval * 1000)) * (groupInterval * 1000);
  const newStartTime = new Date(startTimeFloor);
  newStartTime.setSeconds(0);
  newStartTime.setMilliseconds(0);

  const endTimeFloor =
    Math.floor(endTime / (groupInterval * 1000)) * (groupInterval * 1000);
  const newEndTime = new Date(endTimeFloor);
  newEndTime.setSeconds(0);
  newEndTime.setMilliseconds(0);

  // 結束時間 多取一個時間區間(例如: interval=5 前端傳來的結束時間 15:45, 資料範圍就取到15:50)
  const newEndTime2 = new Date(newEndTime.getTime() + groupInterval * 1000);

  const data = await prisma.$queryRaw`
    SELECT
      count(*) as dataCount,
      sum(count) as sum,
      FROM_UNIXTIME( FLOOR(UNIX_TIMESTAMP(date) / ${groupInterval.toString()}) * ${groupInterval.toString()} ) as timeKey
    FROM 
      EyeRecordResult 
    WHERE eyeId = ${eyeId}  
    AND action = ${action}
    AND date >= ${newStartTime}
    AND date < ${newEndTime2}    
    GROUP BY 
      timeKey
  `;

  return data;
};

const getData2 = async (
  startDate: any,
  endDate: any,
  eyeId: string,
  action: string
) => {
  const startTime: any = new Date(startDate);
  const endTime: any = new Date(endDate);

  const timeDiff = endTime - startTime;

  let groupInterval = 1; // day   // 資料group的範圍

  if (timeDiff <= 7 * day) {
    startTime.setDate(endTime.getDate() - 7);
    groupInterval = 1;
  } else if (timeDiff <= 30 * day) {
    groupInterval = 1;
  } else if (timeDiff <= 90 * day) {
    groupInterval = 3;
  } else {
    groupInterval = 7;
  }

  // 結束時間 多取一個時間區間(例如: interval=1 前端傳來的結束時間 2022-03-10 0:00, 資料範圍就取到 2022-03-11 0:00)
  const endTime2 = new Date(endTime);
  endTime2.setDate(endTime.getDate() + groupInterval);

  const data: any = await prisma.$queryRaw`
    SELECT
      count(*) as dataCount,
      sum(count) as sum,
      DAY(CONVERT_TZ(date,'+00:00','+8:00')) as day,
      MONTH(CONVERT_TZ(date,'+00:00','+8:00')) as month,
      YEAR(CONVERT_TZ(date,'+00:00','+8:00')) as year
    FROM 
      EyeRecordResult 
    WHERE eyeId = ${eyeId}  
    AND action = ${action}
    AND date >= ${startTime}
    AND date < ${endTime2}    
    GROUP BY 
      year, month, day
  `;

  data.forEach((doc: any) => {
    doc.timeKey = new Date(doc.year, doc.month - 1, doc.day);
  });

  return data;
};

export default handler().use(async (req: Request, res: NextApiResponse) => {
  const teamSlug = req.query.teamSlug as string;
  const projectNum = parseInt(req.query.projectNum as string);
  const eyeNum = parseInt(req.query.eyeNum as string);
  const action = req.query.action as string;
  const startDate = req.query.startDate as string;
  const endDate = req.query.endDate as string;
  const type = parseInt(req.query.type as string) || 1;

  if (!projectNum || !eyeNum) {
    return res.status(200).json({ data: [] });
  }
  const eye = await prisma.eye.findFirst({
    where: {
      num: eyeNum,
      project: {
        num: projectNum,
        team: { slug: teamSlug },
      },
    },
  });

  if (!eye) {
    return res.status(500).json({ error: "找不到資料" });
  }

  let data;
  // type1 : 過去n小時類型;  type2: 自選日期類型
  if (type === 1) {
    data = await getData1(startDate, endDate, eye.id, action);
  } else if (type === 2) {
    data = await getData2(startDate, endDate, eye.id, action);
  }

  if (data) {
    return res.status(200).json({ data });
  }

  return res.status(500).json({ error: "找不到資料" });
});
