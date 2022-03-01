const urls = ["https://neweye.imgix.net/"];
const imgixUrl = "https://neweye.imgix.net";

export const getImgixUrl = (keyOrUrl = "", options = "") => {
  let key;
  let url;
  keyOrUrl = keyOrUrl || "";
  if (keyOrUrl.indexOf("http") === 0) {
    url = keyOrUrl;
  } else {
    key = keyOrUrl;
  }

  if (key) {
    return getImgixUrlByKey(key, options);
  }

  if (url) {
    if (url.includes(urls[0])) {
      key = url.replace(urls[0], "");
      return getImgixUrlByKey(key, options, false);
    }
    return url;
  }

  return "";
};

export const getImgixUrlByKey = (
  key: string,
  options = "",
  needEncode = true
) => {
  const parts = key.split("/");
  let first = "";
  let last = "";
  if (parts.length === 1) {
    last = parts[0];
  } else {
    first = parts.slice(0, -1).join("/");
    last = parts[parts.length - 1];
  }
  if (needEncode) {
    last = encodeURIComponent(last).replace(/%20/g, "+");
  }

  return imgixUrl + "/" + (first ? first + "/" : "") + last + options;
};
