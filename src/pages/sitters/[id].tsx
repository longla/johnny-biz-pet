import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Link from "next/link";

import Footer from "@/components/footer";
import Header from "@/components/header";
import SitterDetail from "@/components/sitters/SitterDetail";
import { getSitterById, Sitter, sitters } from "@/data/sitters";

type SitterPageProps = {
  sitter: Sitter;
};

const SitterPage = ({ sitter }: SitterPageProps) => {
  return (
    <>
      <Head>
        <title>{`${sitter.name} | Ruh-Roh Retreat Sitter Profile`}</title>
        <meta name="description" content={`Meet ${sitter.name}, a Ruh-Roh Retreat sitter serving ${sitter.locations[0]?.city ?? "Southern California"}.`} />
      </Head>
      <Header />
      <main className="bg-[#F4F4F9] min-h-screen py-16">
        <div className="container mx-auto px-4 space-y-8">
          <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="uppercase tracking-widest text-sm font-semibold text-[#1A9CB0]">Sitter Profile</p>
              <h1 className="text-4xl md:text-5xl font-bold text-[#333333] mt-2">{sitter.name}</h1>
            </div>
            <Link href="/sitters" className="inline-flex items-center px-6 py-3 rounded-full bg-white text-[#1A9CB0] font-semibold shadow hover:shadow-md transition">
              ← Back to all sitters
            </Link>
          </div>
          <SitterDetail sitter={sitter} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  const paths = sitters.map((sitter) => ({ params: { id: sitter.id } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<SitterPageProps> = ({ params }) => {
  const id = params?.id;
  if (typeof id !== "string") {
    return { notFound: true };
  }

  const sitter = getSitterById(id);

  if (!sitter) {
    return { notFound: true };
  }

  return {
    props: {
      sitter,
    },
  };
};

export default SitterPage;
