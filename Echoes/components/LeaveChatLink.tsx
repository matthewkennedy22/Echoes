"use client";

import Link from "next/link";
import type { ComponentProps } from "react";

/** Fires before navigation so voice stops the instant the visitor leaves a chat. */
export function leaveChatNow() {
  window.dispatchEvent(new CustomEvent("echoes:leave-chat"));
}

export default function LeaveChatLink({
  onClick,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      {...props}
      onClick={(e) => {
        leaveChatNow();
        onClick?.(e);
      }}
    />
  );
}
