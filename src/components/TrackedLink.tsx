"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

export default function TrackedLink({
  href,
  external = false,
  eventName,
  eventParams,
  className,
  children,
  onClick,
}: {
  href: string;
  external?: boolean;
  eventName: string;
  eventParams?: Record<string, unknown>;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  function handleClick() {
    trackEvent(eventName, eventParams);
    onClick?.();
  }

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        onClick={handleClick}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
