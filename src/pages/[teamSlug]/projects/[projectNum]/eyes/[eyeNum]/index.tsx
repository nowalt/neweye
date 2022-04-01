import type { NextPage } from "next";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import { useState, useRef, useEffect } from "react";
import _ from "lodash";
import moment from "moment";
import InfiniteScroll from "react-infinite-scroller";

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
  const isFetchMore = useRef(false);
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

  useEffect(() => {
    isFetchMore.current = false;
  }, [size]);

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

  const hasNextPage = pageSize * size === records.length;

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
                  if (d) setStart(d);
                }}
              />
              <DatePicker
                id="date-picker"
                className={`h-4 w-14 rounded-r-md border-l-0 text-center py-3 px-1 text-sm cursor-pointer text-blue-800 border-gray-800 font-medium`}
                dateFormat="HH:mm"
                selected={start}
                onChange={(d: Date) => {
                  if (d) setStart(d);
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
                  if (d) setEnd(d);
                }}
              />
              <DatePicker
                id="date-picker"
                className={`h-4 w-14 rounded-r-md border-l-0 text-center py-3 px-1 text-sm cursor-pointer text-blue-800 border-gray-800 font-medium`}
                dateFormat="HH:mm"
                selected={end}
                onChange={(d: Date) => {
                  if (d) setEnd(d);
                }}
                showTimeSelect
                showTimeSelectOnly
              />
            </div>
          </div>

          <div className="mt-4 bg-white border">
            <div className="px-4 sm:px-6 lg:px-8 mt-2">
              <div className="sm:flex sm:items-center">
                <div className="sm:flex-auto">
                  <h1 className="text-xl font-semibold text-gray-900">
                    {eye.name}
                  </h1>
                </div>
              </div>
              <div className="my-3 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <InfiniteScroll
                        loadMore={async () => {
                          if (isFetchMore.current) return;
                          isFetchMore.current = true;
                          setSize(size + 1);
                        }}
                        hasMore={hasNextPage}
                        pageStart={0}
                        threshold={750}
                        initialLoad={false}
                        loader={
                          <div key={0} className="flex justify-center">
                            <p>loading...</p>
                          </div>
                        }
                      >
                        <table className="min-w-full divide-y divide-gray-300">
                          <thead className="bg-gray-50">
                            <tr>
                              <th
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                              >
                                Time
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Client Id
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                In
                              </th>
                              <th
                                scope="col"
                                className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                              >
                                Out
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {!!records.length &&
                              records.map((record: any, index: number) => {
                                const results = record.results;

                                const resultIn = _.find(
                                  results,
                                  (doc: any) => doc.action === "in"
                                );

                                const resultOut = _.find(
                                  results,
                                  (doc: any) => doc.action === "out"
                                );

                                return (
                                  <tr
                                    key={record.id + index}
                                    className={
                                      index % 2 > 0
                                        ? "bg-stone-50"
                                        : "bg-grey-50"
                                    }
                                  >
                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                                      {record.date
                                        ? moment(record.date).format(
                                            "HH:mm:ss, MMM DD, yyyy"
                                          )
                                        : ""}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                      {record.clientId}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                      {resultIn?.count}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                      {resultOut?.count}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      </InfiniteScroll>
                    </div>
                    {!records.length && (
                      <div className="flex justify-center my-3">
                        <span>無資料</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTaskPage;
