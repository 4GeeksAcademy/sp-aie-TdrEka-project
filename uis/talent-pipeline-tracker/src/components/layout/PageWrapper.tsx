import Head from "next/head";
import type { ReactNode } from "react";

import { Header } from "@/src/components/layout/Header";

interface PageWrapperProps {
  children: ReactNode;
  title: string;
  showBack?: boolean;
}

export function PageWrapper({ children, title, showBack = false }: PageWrapperProps) {
  return (
    <>
      <Head>
        <title>{`TrackFlow · ${title}`}</title>
      </Head>
      <div className="min-h-screen bg-slate-50">
        <Header showBack={showBack} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6">{children}</main>
      </div>
    </>
  );
}
