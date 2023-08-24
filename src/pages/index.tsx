import { api } from "@/utils/api";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const { data, isLoading, isError } = api.greeting.useQuery()

  if (isLoading) return 'isLoading'
  if (isError) return 'isError'
  return (
    <>
      {data}
    </>
  );
}

