import { useEffect, useState } from "react";
import Router from "next/router";
import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

export const fetcher = async (url: string) => {
  const res = await fetch(url);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error: any = new Error("An error occurred while fetching the data.");
    // Attach extra info to the error object.
    const data = await res.json();
    error.info = data.error || data;
    error.status = res.status;
    throw error;
  }

  return res.json();
};

export function useUserImmutable({
  redirectTo,
  redirectIfFound,
}: {
  redirectTo?: string;
  redirectIfFound?: boolean;
  immutable?: boolean;
} = {}) {
  const { data, error } = useSWRImmutable("/api/user", fetcher);
  const user = data?.user;
  const finished = Boolean(data);
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!finished) return;

    const nextRedirect = window.location.pathname.startsWith("/login")
      ? "/"
      : window.location.pathname;

    if (hasUser) {
      if (!user.username || !user.name) {
        if (!window.location.pathname.startsWith("/login/form")) {
          Router.push(`/login/form?next=${nextRedirect}`);
        }
      } else {
        if (
          // If redirectTo is set, redirect if the user was not found.
          (redirectTo && !redirectIfFound && !hasUser) ||
          // If redirectIfFound is also set, redirect if the user was found
          (redirectTo && redirectIfFound && hasUser)
        ) {
          Router.push(redirectTo);
        }
      }
    } else {
      if (
        !window.location.pathname.startsWith("/login") ||
        window.location.pathname.startsWith("/login/form")
      ) {
        Router.push(`/login?next=${nextRedirect}`);
      }
    }
  }, [redirectTo, redirectIfFound, finished, hasUser, user]);

  return error ? null : user;
}

export function useUser({
  redirectTo,
  redirectIfFound,
  refreshInterval = 0,
}: {
  redirectTo?: string;
  redirectIfFound?: boolean;
  refreshInterval?: number;
} = {}) {
  const { data, error } = useSWR("/api/user", fetcher, { refreshInterval });

  const [user, setUser] = useState(data?.user);
  useEffect(() => {
    if (data?.user || data?.user === null) {
      setUser(data?.user);
    }
  }, [data]);

  const finished = Boolean(user || user === null);
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!finished) return;

    const nextRedirect = window.location.pathname.startsWith("/login")
      ? "/"
      : window.location.pathname;

    if (hasUser) {
      if (!user.username || !user.name) {
        if (!window.location.pathname.startsWith("/login/form")) {
          Router.push(`/login/form?next=${nextRedirect}`);
        }
      } else {
        if (
          // If redirectTo is set, redirect if the user was not found.
          (redirectTo && !redirectIfFound && !hasUser) ||
          // If redirectIfFound is also set, redirect if the user was found
          (redirectTo && redirectIfFound && hasUser)
        ) {
          Router.push(redirectTo);
        }
      }
    } else {
      if (
        !window.location.pathname.startsWith("/login") ||
        window.location.pathname.startsWith("/login/form")
      ) {
        Router.push(`/login?next=${nextRedirect}`);
      }
    }
  }, [redirectTo, redirectIfFound, finished, hasUser, user]);

  return error ? null : user;
}

export function useTeam({
  inviteCode = "",
  slug = "",
}: { inviteCode?: string; slug?: string } = {}) {
  const { data, error } = useSWR(
    inviteCode || slug
      ? `/api/team?slug=${slug}&inviteCode=${inviteCode}`
      : null,
    fetcher
  );

  const [team, setTeam] = useState(data?.team);
  useEffect(() => {
    if (data?.team) {
      setTeam(data?.team);
    }
  }, [data]);

  if (error) {
    return {
      team: null,
      error: error.info || error.message,
    };
  }

  return {
    team,
    error: null,
  };
}

export function useProject({
  num = "",
  teamSlug = "",
}: { num?: string; teamSlug?: string } = {}) {
  const { data, error } = useSWR(
    num && teamSlug ? `/api/project?teamSlug=${teamSlug}&num=${num}` : null,
    fetcher
  );

  const [project, setProject] = useState(data?.project);
  useEffect(() => {
    if (data?.project) {
      setProject(data?.project);
    }
  }, [data]);

  if (error) {
    return {
      project: null,
      error: error.info || error.message,
    };
  }

  return {
    project,
    error: null,
  };
}

export function useEye({
  num = "",
  projectId = "",
}: { num?: string; projectId?: string } = {}) {
  const { data, error } = useSWR(
    num && projectId ? `/api/eye?projectId=${projectId}&num=${num}` : null,
    fetcher
  );

  const [eye, setEye] = useState(data?.eye);
  useEffect(() => {
    if (data?.eye) {
      setEye(data?.eye);
    }
  }, [data]);

  if (error) {
    return {
      eye: null,
      error: error.info || error.message,
    };
  }

  return {
    eye,
    error: null,
  };
}

export function useEyeReocrdResultCount({
  teamSlug = "",
  eyeNum = "",
  projectNum = "",
  action = "",
  startDate = "",
  endDate = "",
}: {
  teamSlug?: string;
  eyeNum?: string;
  projectNum?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
} = {}) {
  const { data, error } = useSWR(
    "/api/eye/record_result_count" +
      `?teamSlug=${teamSlug}` +
      `&projectNum=${projectNum}` +
      `&eyeNum=${eyeNum}` +
      `&action=${action}` +
      `&startDate=${startDate}` +
      `&endDate=${endDate}`,
    fetcher
  );

  const [result, setResult] = useState(data);
  useEffect(() => {
    if (data) {
      setResult(data);
    }
  }, [data]);

  if (error) {
    return {
      data: null,
      error: error.info || error.message,
    };
  }

  return {
    data: result,
    error: null,
  };
}

export function useProjectReocrdResultCount({
  teamSlug = "",
  projectNum = "",
  action = "",
  startDate = "",
  endDate = "",
}: {
  teamSlug?: string;
  projectNum?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
} = {}) {
  const { data, error } = useSWR(
    "/api/project/record_result_count" +
      `?teamSlug=${teamSlug}` +
      `&projectNum=${projectNum}` +
      `&action=${action}` +
      `&startDate=${startDate}` +
      `&endDate=${endDate}`,
    fetcher
  );

  const [result, setResult] = useState(data);
  useEffect(() => {
    if (data) {
      setResult(data);
    }
  }, [data]);

  if (error) {
    return {
      data: null,
      error: error.info || error.message,
    };
  }

  return {
    data: result,
    error: null,
  };
}
