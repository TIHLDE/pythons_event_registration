/* eslint-disable no-var */

interface ViewTransition {
  finished: Promise<void>;
  ready: Promise<void>;
  updateCallbackDone: Promise<void>;
  skipTransition(): void;
}

declare global {
  interface Document {
    startViewTransition(cb: () => Promise<void> | void): ViewTransition;
  }
}

declare module 'react' {
  interface CSSProperties {
    'view-transition-name'?: string;
  }
}

export interface PageProps<Params extends Record<string, string> = Record<string, never>> {
  params: Params;
  searchParams: { [key: string]: string | string[] | undefined };
}

export {};
