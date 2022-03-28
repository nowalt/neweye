import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import _ from "lodash";
import moment from "moment";
import DatePicker from "react-datepicker";

import {
  useProject,
  useProjectReocrdResultCount,
} from "../../../../client/lib/hooks";
import RecordLineChart from "../../../../client/components/RecordLineChart";

const Chart = () => {
  const router = useRouter();

  const slug = router.query.teamSlug as string;
  const projectNum = router.query.projectNum as string;

  const [buttonSelected, setButtonSelected] = useState(1);

  const currentTime = new Date();
  const [endDate, setEndDate] = useState(currentTime);

  const initStartTime = new Date();
  initStartTime.setMinutes(initStartTime.getMinutes() - 10);
  const [startDate, setStartDate] = useState(initStartTime);

  const [pickerStart, setPickerStart] = useState(initStartTime);
  const [pickerEnd, setPickerEnd] = useState(currentTime);

  const [timeFormat, setTimeFormat] = useState("HH:mm");

  const { project, error: projectError } = useProject({
    num: projectNum,
    teamSlug: slug,
  });

  const { data: countInData, error: countInError } =
    useProjectReocrdResultCount({
      teamSlug: slug,
      projectNum,
      action: "in",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

  const { data: countOutData, error: countOutError } =
    useProjectReocrdResultCount({
      teamSlug: slug,
      projectNum,
      action: "out",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

  useEffect(() => {
    if (
      endDate.getDate() !== startDate.getDate() ||
      endDate.getMonth() !== startDate.getMonth() ||
      endDate.getFullYear() !== startDate.getFullYear()
    ) {
      setTimeFormat("YYYY-MM-DD HH:mm");
    } else {
      setTimeFormat("HH:mm");
    }
  }, [startDate, endDate]);

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
        <label className="mx-3 inline-flex items-center cursor-pointer">
          <input
            type="radio"
            className="form-radio cursor-pointer"
            name="radio-10min"
            value={1}
            checked={buttonSelected === 1}
            onChange={(e) => {
              setButtonSelected(1);

              const startTime = new Date(currentTime);
              startTime.setMinutes(startTime.getMinutes() - 10);
              setStartDate(startTime);
              setEndDate(currentTime);
            }}
          />
          <span className="ml-1">過去10分鐘</span>
        </label>

        <label className="mx-3 inline-flex items-center cursor-pointer">
          <input
            type="radio"
            className="form-radio cursor-pointer"
            name="radio-10min"
            value={1}
            checked={buttonSelected === 2}
            onChange={(e) => {
              setButtonSelected(2);

              const startTime = new Date(currentTime);
              startTime.setMinutes(startTime.getMinutes() - 30);
              setStartDate(startTime);
              setEndDate(currentTime);
            }}
          />
          <span className="ml-1">過去30分鐘</span>
        </label>

        <label className="mx-3 inline-flex items-center cursor-pointer">
          <input
            type="radio"
            className="form-radio cursor-pointer"
            name="radio-10min"
            value={1}
            checked={buttonSelected === 3}
            onChange={(e) => {
              setButtonSelected(3);

              const startTime = new Date(currentTime);
              startTime.setMinutes(startTime.getMinutes() - 60);
              setStartDate(startTime);
              setEndDate(currentTime);
            }}
          />
          <span className="ml-1">過去1小時</span>
        </label>
      </div>

      <div className="flex items-center justify-center mt-5">
        <label className="mx-3 inline-flex items-center cursor-pointer">
          <input
            type="radio"
            className="form-radio cursor-pointer"
            name="radio-custom"
            value={4}
            checked={buttonSelected === 4}
            onChange={(e) => {
              setButtonSelected(4);

              setStartDate(pickerStart);
              setEndDate(pickerEnd);
            }}
          />

          <span className="ml-1">自訂時間：</span>
          <div className="flex items-center justify-center mx-3">
            <span
              className={`${
                buttonSelected === 4 ? "text-gray-800" : "text-gray-300"
              }`}
            >
              from
            </span>
            <DatePicker
              id="startAt"
              className={`h-4 w-36 rounded-sm text-center py-3 px-1 ml-1 text-sm ${
                buttonSelected === 4
                  ? "cursor-pointer text-blue-800 border-gray-800 font-medium"
                  : "text-gray-300 border-gray-500"
              }`}
              dateFormat="yyyy-MM-dd HH:mm"
              disabled={buttonSelected !== 4}
              selected={pickerStart}
              onChange={(date: Date) => {
                date.setSeconds(0);
                date.setMilliseconds(0);
                setPickerStart(date);
                setStartDate(date);
              }}
              withPortal
            />
          </div>

          <div className="flex items-center justify-center mx-3">
            <span
              className={`${
                buttonSelected === 4 ? "text-gray-800" : "text-gray-300"
              }`}
            >
              to
            </span>
            <DatePicker
              id="endtAt"
              className={`h-4 w-36 rounded-sm text-center py-3 px-1 mx-2 text-sm ${
                buttonSelected === 4
                  ? "cursor-pointer text-blue-800 border-gray-800 font-medium"
                  : "text-gray-300 border-gray-500"
              }`}
              dateFormat="yyyy-MM-dd HH:mm"
              disabled={buttonSelected !== 4}
              selected={pickerEnd}
              onChange={(date: Date) => {
                date.setSeconds(0);
                date.setMilliseconds(0);
                setPickerEnd(date);
                setEndDate(date);
              }}
              withPortal
            />
          </div>
        </label>
      </div>

      <div className="mt-5">
        <RecordLineChart
          title={`${project?.name || "loading..."}, 入場人數`}
          xAxisData={inData.map((doc: any) =>
            moment(doc.timeKey).format(timeFormat)
          )}
          yAxisData={inData.map((doc: any) => doc.sum)}
        />

        <RecordLineChart
          title={`${project?.name || "loading..."}, 離場人數`}
          xAxisData={outData.map((doc: any) =>
            moment(doc.timeKey).format(timeFormat)
          )}
          yAxisData={outData.map((doc: any) => doc.sum)}
        />
      </div>
    </div>
  );
};
export default Chart;
