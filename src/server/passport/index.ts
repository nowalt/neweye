import passport from "passport";
import phone from "./phone";
import prisma from "../db/prisma";

passport.use(phone);

// This types passport.(de)serializeUser!
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User {
      id: string;
      to?: string;
    }
  }
}

passport.serializeUser(async (u: Express.User, done) => {
  // 檢查有沒有電話號碼
  if (!u.to) {
    return done(new Error("phone number not found"), null);
  }

  // 從資料庫裡用電話號碼找 user
  try {
    const found = await prisma.user.findFirst({
      where: {
        phoneNumber: u.to,
      },
    });

    // 找到 user
    if (found) {
      return done(null, { ...found });
    }

    // 找不到就馬上創建
    // 此時不會建立 personal team，因為還未知他叫什麼名
    const user = await prisma.user.create({
      data: {
        phoneNumber: u.to,
      },
    });

    // 返回剛創建的 user
    done(null, { ...user });
  } catch (error) {
    // 若資料庫過程中有任何錯誤，返回錯誤
    done(error, null);
  }
});

passport.deserializeUser(async (user: Express.User, done) => {
  // 把 cookie session 裡的東西變成 req.user
  done(null, user);
});

export default passport;
