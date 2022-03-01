import passport from "passport";
import { NextApiResponse } from "next";
import handler from "../../../../server/api-route";

export default handler()
  .use(passport.authenticate("custom"))
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  .use((req: any, res: NextApiResponse) => {
    // 登入成功只會返回 success: true
    res.json({
      success: true,
    });
  });
