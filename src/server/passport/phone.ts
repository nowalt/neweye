import passportCustom from "passport-custom";
import { Twilio } from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID || "";
const authToken = process.env.TWILIO_AUTH_TOKEN || "";
const client = new Twilio(accountSid, authToken);

const CustomStrategy = passportCustom.Strategy;

export default new CustomStrategy((req, done) => {
  try {
    const { body } = req;

    // 先從 body 裡拿到電話號碼和 code
    const { to, code } = body;

    // 進行驗證操作
    client.verify
      .services("VA2bb94bfec18e5328e3791848315219bd")
      .verificationChecks.create({ to, code })
      .then((verification_check) => {
        // 如果驗證成功
        if (verification_check.status === "approved") {
          // 返回 result，之後會做資料庫找 user 的處理
          const result = {
            sid: verification_check.sid,
            status: verification_check.status,
            valid: verification_check.valid,
            dateCreated: verification_check.dateCreated,
            dateUpdated: verification_check.dateUpdated,
            to: verification_check.to,
            channel: verification_check.channel,
          };
          done(null, result);
        } else {
          // 若驗證不成功
          done(new Error("錯誤的驗證碼"));
        }
      })
      .catch((error) => {
        // 若驗證過程有任何錯誤，返回錯誤
        done(error);
      });
  } catch (error) {
    // 若這個 CustomStrategy 存在任何錯誤，返回錯誤
    done(error);
  }
});
