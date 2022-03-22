import { useState } from "react";
import { useRouter } from "next/router";
import _ from "lodash";
import moment from "moment";

import {
  useProject,
  useProjectReocrdResultCount,
} from "../../../../client/lib/hooks";
import RecordLineChart from "../../../../client/components/RecordLineChart";

const Chart = () => {
  const router = useRouter();

  const slug = router.query.teamSlug as string;
  const projectNum = router.query.projectNum as string;

  const [timeInterval, setTimeInterval] = useState(10);
  const [buttonSelected, setButtonSelected] = useState(1);

  const currentTime = new Date();
  const [endDate, setEndDate] = useState(currentTime);

  const initStartTime = new Date();
  initStartTime.setMinutes(initStartTime.getMinutes() - 10);
  const [startDate, setStartDate] = useState(initStartTime);

  const { project, error: projectError } = useProject({
    num: projectNum,
    teamSlug: slug,
  });

  const { data: countInData, error: countInError } =
    useProjectReocrdResultCount({
      teamSlug: slug,
      projectNum,
      timeInterval: timeInterval.toString(),
      action: "in",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

  const { data: countOutData, error: countOutError } =
    useProjectReocrdResultCount({
      teamSlug: slug,
      projectNum,
      timeInterval: timeInterval.toString(),
      action: "out",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

  if (projectError) {
    return <div>Error: {projectError.info || projectError.message}</div>;
  }

  if (countInError) {
    return <div>Error: {countInError.info || countInError.message}</div>;
  }

  if (countOutError) {
    return <div>Error: {countOutError.info || countOutError.message}</div>;
  }

  const inData = countInData?.data || [];
  const outData = countOutData?.data || [];

  return (
    <div>
      <div className="flex items-center justify-center mt-5">
        <button
          type="button"
          className={`${
            buttonSelected === 1
              ? "bg-green-600 hover:bg-green-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          } mx-3 only:flex justify-center py-1 px-2 border border-transparent rounded-md shadow-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50`}
          onClick={() => {
            setTimeInterval(10);
            setButtonSelected(1);

            const startTime = new Date();
            startTime.setMinutes(startTime.getMinutes() - 10);
            setStartDate(startTime);
          }}
        >
          <span>過去10分鐘</span>
        </button>
        <button
          type="button"
          className={`${
            buttonSelected === 2
              ? "bg-green-600 hover:bg-green-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          } mx-3 only:flex justify-center py-1 px-2 border border-transparent rounded-md shadow-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50`}
          onClick={() => {
            setTimeInterval(30);
            setButtonSelected(2);

            const startTime = new Date();
            startTime.setMinutes(startTime.getMinutes() - 30);
            setStartDate(startTime);
          }}
        >
          <span>過去30分鐘</span>
        </button>
        <button
          type="button"
          className={`${
            buttonSelected === 3
              ? "bg-green-600 hover:bg-green-700"
              : "bg-indigo-600 hover:bg-indigo-700"
          } mx-3 only:flex justify-center py-1 px-2 border border-transparent rounded-md shadow-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50`}
          onClick={() => {
            setTimeInterval(60);
            setButtonSelected(3);

            const startTime = new Date();
            startTime.setMinutes(startTime.getMinutes() - 60);
            setStartDate(startTime);
          }}
        >
          <span>過去1小時</span>
        </button>
      </div>

      <div className="mt-5">
        <RecordLineChart
          title={`${project?.name || "loading..."}, 入場人數`}
          xAxisData={inData.map((doc: any) =>
            moment(doc.timeKey).format("HH:mm")
          )}
          yAxisData={inData.map((doc: any) => doc.sum)}
        />

        <RecordLineChart
          title={`${project?.name || "loading..."}, 離場人數`}
          xAxisData={outData.map((doc: any) =>
            moment(doc.timeKey).format("HH:mm")
          )}
          yAxisData={outData.map((doc: any) => doc.sum)}
        />
      </div>
    </div>
  );
};
export default Chart;
