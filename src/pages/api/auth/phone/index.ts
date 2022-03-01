import { NextApiRequest, NextApiResponse } from "next";
import { Twilio } from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const client = new Twilio(accountSid, authToken);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { body } = req;

    // 由 body 拿到電話號碼
    const { to } = body;

    // 傳送 verify 驗證碼
    await client.verify
      .services("VA2bb94bfec18e5328e3791848315219bd")
      .verifications.create({
        to,
        channel: "sms",
        locale: "zh-HK",
      })
      .then((verification) => {
        const result = {
          sid: verification.sid,
          status: verification.status,
          valid: verification.valid,
          dateCreated: verification.dateCreated,
          dateUpdated: verification.dateUpdated,
          to: verification.to,
          channel: verification.channel,
        };

        // 成功，返回結果
        res.json({ result });
      });
  } catch (error: any) {
    // 有任何錯誤, 返回錯誤訊息
    console.log(error);
    return res.status(500).json({
      error: error.message || "Error sending login sms",
    });
  }
}
