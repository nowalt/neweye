/* eslint-disable @next/next/no-img-element */

import React, { ImgHTMLAttributes, useState } from "react";

import { getImgixUrl } from "../../lib/imgix";

interface Props extends ImgHTMLAttributes<unknown> {
  fallback?: string;
}

export default function Avatar({ fallback, src, ...props }: Props) {
  const [isDefault, setIsDefault] = useState<boolean>(
    src === "" ? true : false
  );
  const onError = () => setIsDefault(true);

  if (isDefault) {
    return (
      <span className={props.className}>
        <span className="block rounded-full overflow-hidden bg-gray-100">
          <svg
            className="h-full w-full text-gray-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      </span>
    );
  }

  return (
    <img
      src={src ? getImgixUrl(src, "?w=100") : fallback}
      onError={onError}
      alt="avatar"
      {...props}
    />
  );
}
