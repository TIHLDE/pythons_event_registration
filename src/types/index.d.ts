/* eslint-disable no-var */

declare global {
  var example: string;
  function sum(a: number, b: number): number;
}

export interface PageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export {};
