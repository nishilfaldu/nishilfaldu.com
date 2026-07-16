import Link from "next/link";
import type { ReactNode } from "react";
import { CommandMenu } from "./command-menu";

export default function DesignLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="sticky top-0 z-10 border-b border-gray-alpha-400 bg-background-100/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-content items-center justify-between px-6">
          <Link
            href="/design"
            className="text-heading-16 text-gray-1000 hover:text-gray-900"
          >
            Design
          </Link>
          <nav className="flex items-center gap-6">
            <CommandMenu />
            <a
              href="/design.md"
              className="hidden text-label-14 text-gray-900 hover:text-gray-1000 sm:block"
            >
              design.md
            </a>
            <Link
              href="/"
              className="text-label-14 text-gray-900 hover:text-gray-1000"
            >
              Portfolio
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-content flex-1 px-6 py-16">
        {children}
      </main>
      <footer className="border-t border-gray-alpha-400">
        <div className="mx-auto max-w-content px-6 py-8">
          <p className="text-label-13 text-gray-900">
            The design system and interface guidelines for nishilfaldu.com.
          </p>
        </div>
      </footer>
    </div>
  );
}
