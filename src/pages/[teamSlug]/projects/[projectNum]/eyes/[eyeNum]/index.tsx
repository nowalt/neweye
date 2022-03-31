import type { NextPage } from "next";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import { useState } from "react";
import _ from "lodash";
import moment from "moment";
import uuid from "uuid";

import {
  useUser,
  useProject,
  useEye,
  useEyeRecords,
} from "../../../../../../client/lib/hooks";
import Header from "../../../../../../client/components/Header";
import EyeRunner from "../../../../../../client/components/EyeRunner";

const ProjectTaskPage: NextPage = () => {
  const router = useRouter();
  const slug = router.query.teamSlug as string;
  const projectNum = router.query.projectNum as string;
  const eyeNum = router.query.eyeNum as string;

  const pageSize = 20;

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

  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);

  // 防止未登入的人
  useUser();

  const { project, error: projectError } = useProject({
    num: projectNum,
    teamSlug: slug,
  });

  const { eye, error: eyeError } = useEye({
    num: eyeNum,
    projectId: project?.id,
  });

  const {
    records,
    error: recordsError,
    size,
    setSize,
  } = useEyeRecords({
    eyeId: eye?.id,
    take: pageSize,
    filter: {
      startAt: start.toISOString(),
      endAt: end.toISOString(),
    },
  });

  if (projectError) {
    return <div>Error: {projectError.info || projectError.message}</div>;
  }

  if (eyeError) {
    return <div>Error: {eyeError.info || eyeError.message}</div>;
  }

  if (recordsError) {
    return <div>Error: {recordsError.info || recordsError.message}</div>;
  }

  if (!project || !eye) {
    return null;
  }

  return (
    <div className="bg-white min-h-screen min-h-screen-ios">
      <Header />
      {/* <EyeRunner /> */}
      <div className="max-w-7xl mx-auto pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto lg:max-w-none">
          <div className="flex items-center justify-between">
            <h2 className="flex-1 min-w-0 text-lg font-medium text-gray-900">
              記錄資料
            </h2>

            <div className="flex">
              <DatePicker
                id="date-picker"
                className={`h-4 w-24 rounded-l-md border-r-1 text-center py-3 px-1 text-sm cursor-pointer text-blue-800 border-gray-800 font-medium`}
                dateFormat="yyyy-MM-dd"
                selected={start}
                onChange={(d: Date) => {
                  setStart(d);
                }}
              />
              <DatePicker
                id="date-picker"
                className={`h-4 w-14 rounded-r-md border-l-0 text-center py-3 px-1 text-sm cursor-pointer text-blue-800 border-gray-800 font-medium`}
                dateFormat="HH:mm"
                selected={start}
                onChange={(d: Date) => {
                  setStart(d);
                }}
                showTimeSelect
                showTimeSelectOnly
              />
              <p className="mx-2">-</p>
              <DatePicker
                id="date-picker"
                className={`h-4 w-24 rounded-l-md border-r-1 text-center py-3 px-1 text-sm cursor-pointer text-blue-800 border-gray-800 font-medium`}
                dateFormat="yyyy-MM-dd"
                selected={end}
                onChange={(d: Date) => {
                  setEnd(d);
                }}
              />
              <DatePicker
                id="date-picker"
                className={`h-4 w-14 rounded-r-md border-l-0 text-center py-3 px-1 text-sm cursor-pointer text-blue-800 border-gray-800 font-medium`}
                dateFormat="HH:mm"
                selected={end}
                onChange={(d: Date) => {
                  setEnd(d);
                }}
                showTimeSelect
                showTimeSelectOnly
              />
            </div>
          </div>

          <div className="mt-4 bg-white border">
            <ul role="list" className="divide-y divide-gray-200">
              {!!records.length &&
                records.map((record: any, index: number) => {
                  const results = record.results;
                  const groupResult = _.groupBy(results, "type");
                  const groupKeys = _.keys(groupResult);
                  return (
                    <li key={record.id + index}>
                      <div className="block hover:bg-gray-50 w-full">
                        <div className="px-4 py-4 flex items-center sm:px-6">
                          <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                            <div className="truncate">
                              <div className="flex text-sm">
                                <span className="font-bold text-gray-600 truncate">
                                  {record.date
                                    ? moment(record.date).format(
                                        "HH:mm:ss, MMM DD, yyyy"
                                      )
                                    : ""}
                                </span>
                              </div>
                              {groupKeys.map((key) => {
                                return (
                                  <div
                                    key={key}
                                    className="flex text-sm ml-3 mt-2"
                                  >
                                    <span className="mx-2 font-semibold text-gray-600 truncate">
                                      {key}
                                    </span>
                                    {groupResult[key].map((result) => (
                                      <p
                                        key={result.id}
                                        className="mx-2 font-medium text-gray-600 truncate"
                                      >
                                        {`${result.action}:${result.count}`}
                                      </p>
                                    ))}
                                  </div>
                                );
                              })}
                            </div>
                            <div className="hidden flex-shrink-0 sm:ml-5 sm:block"></div>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}

              {!records.length && (
                <li>
                  <div className="block w-full">
                    <div className="px-4 py-4 flex items-center sm:px-6">
                      <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                        <p className="text-center text-sm font-medium text-gray-600 truncate">
                          無記錄
                        </p>
                      </div>
                    </div>
                  </div>
                </li>
              )}
            </ul>
          </div>
          <div className="flex justify-center mt-3">
            <button
              type="button"
              className="order-0 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                setSize(size + 1);
              }}
            >
              更多記錄
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTaskPage;
