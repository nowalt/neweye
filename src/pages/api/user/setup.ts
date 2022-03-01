import { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";

import prisma from "../../../server/db/prisma";
import handler from "../../../server/api-route";

export interface Request extends NextApiRequest {
  // Passport adds these to the request object
  logout: () => void;
  user?: Express.User;
  protocol?: string;
}

export default handler().use(async (req: Request, res: NextApiResponse) => {
  // 由 body 得到 name 和 username
  const { name, username } = req.body;

  // input 檢查
  const formattedName = (name as string).trim();
  let formattedUsername = (username as string).trim().toLowerCase();
  formattedUsername = slugify(formattedUsername, "_");

  if (!formattedName) {
    return res.status(500).json({ error: "Input name required" });
  }

  if (!formattedUsername) {
    return res.status(500).json({ error: "Input username required" });
  }

  if (formattedName.length < 3) {
    return res
      .status(500)
      .json({ error: `用戶名稱至少三個字元: ${formattedName}` });
  }

  if (formattedUsername.length < 3) {
    return res
      .status(500)
      .json({ error: `帳戶名至少三個字元: ${formattedUsername}` });
  }

  // 檢查 req.user
  if (!req.user || !req.user.id) {
    return res.status(500).json({ error: "請先登入" });
  }

  // 找到登入用戶
  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
  });

  if (!user) {
    return res.status(500).json({ error: "沒有找到登入用戶" });
  }

  if (user.username) {
    // 本身已存在 username
    // 代表接下來的操作是 username 更新

    // 先找找新 username 能不能用
    // 在 team 裡找
    const found = await prisma.team.findUnique({
      where: {
        slug: formattedUsername,
      },
    });

    if (found && found.userId !== user.id) {
      return res.status(500).json({ error: "帳戶名已存在" });
    }

    // 可以用了, 更新 username
    // 一定有個 personal team slug 是 user.username
    await prisma.team.update({
      where: {
        slug: user.username,
      },
      data: {
        slug: formattedUsername,
        name: formattedName,
        user: {
          update: {
            username: formattedUsername,
            name: formattedName,
          },
        },
      },
    });

    return res.status(200).json({ success: true });
  } else {
    // 本身不存在 username
    // 代表接下來的操作是新增 username 和 personal team setup

    // 先找找新 username 能不能用
    // 在 team 裡找
    const found = await prisma.team.findUnique({
      where: {
        slug: formattedUsername,
      },
    });

    if (found) {
      return res.status(500).json({ error: "帳戶名已存在" });
    }

    // 可以新增 personal team
    await prisma.team.create({
      data: {
        slug: formattedUsername,
        userId: user.id,
        name: formattedName,
        members: {
          create: {
            userId: user.id,
            isAdmin: true,
          },
        },
      },
    });

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        username: formattedUsername,
        name: formattedName,
      },
    });

    return res.status(200).json({ success: true });
  }
});
