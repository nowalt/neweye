import { useState, useEffect } from "react";
import ReactEcharts from "echarts-for-react";
import { useRouter } from "next/router";
import _ from "lodash";
import moment from "moment";

import {
  useProject,
  useEyeWithReocrdResults,
} from "../../../../../../client/lib/hooks";

const Chart = () => {
  const router = useRouter();

  const slug = router.query.teamSlug as string;
  const projectNum = router.query.projectNum as string;
  const num = router.query.projectNum as string;

  const [timeInterval, setTimeInterval]: any = useState();
  const [buttonSelected, setButtonSelected] = useState(1);

  const { project, error: projectError } = useProject({
    num: projectNum,
    teamSlug: slug,
  });

  const { eye, error: eyeError } = useEyeWithReocrdResults({
    num,
    projectId: project?.id,
    timeInterval,
  });

  useEffect(() => {
    const time = new Date();
    time.setMinutes(time.getMinutes() - 10);
    setTimeInterval(time.toISOString());
  }, []);

  if (projectError) {
    return <div>Error: {projectError.info || projectError.message}</div>;
  }

  if (eyeError) {
    return <div>Error: {eyeError.info || eyeError.message}</div>;
  }

  const recordResults = eye?.recordResults || [];

  const option = {
    title: {
      text: `${project?.name || "loading..."}, ${eye?.name || "loading..."}`,
    },
    xAxis: {
      name: "time",
      data: recordResults.map((doc: any) => moment(doc.date).format("HH:mm")),
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      name: "count",
    },
    series: [
      {
        data: recordResults.map((doc: any) => doc.count),
        type: "line",
      },
    ],
  };
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
            const time = new Date();
            time.setMinutes(time.getMinutes() - 10);
            setTimeInterval(time.toISOString());
            setButtonSelected(1);
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
            const time = new Date();
            time.setMinutes(time.getMinutes() - 30);
            setTimeInterval(time.toISOString());
            setButtonSelected(2);
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
            const time = new Date();
            time.setMinutes(time.getMinutes() - 60);
            setTimeInterval(time.toISOString());
            setButtonSelected(3);
          }}
        >
          <span>過去1小時</span>
        </button>
      </div>
      {recordResults && recordResults.length > 0 ? (
        <ReactEcharts option={option} />
      ) : (
        <div className="flex justify-center my-5">
          <span>無資料</span>
        </div>
      )}
    </div>
  );
};
export default Chart;
