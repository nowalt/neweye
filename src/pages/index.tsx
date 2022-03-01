import type { NextPage } from "next";
import Router from "next/router";
import { useEffect } from "react";

import { useUser } from "../client/lib/hooks";

const Home: NextPage = () => {
  // 需要用到 user.teams
  const user = useUser();

  useEffect(() => {
    if (user && user.teams && user.teams.length) {
      Router.push(`/${user.teams[0].team.slug}`);
    }
  }, [user]);

  return null;
};

export default Home;
