import { BlogPostMetaData } from "@/components/meta-data";
import type { Post } from "@/core/types";
import { getPostData, getSortedPostsData } from "@/lib/post";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import BlogLayout from "./_layout";

export default function Post({ post }: { post: Post }) {
  const imageUrl = post.hasCoverImage
    ? `/posts/${post.slug}/cover.jpg`
    : "https://www.ruhrohretreat.com/ruhrohretreat-social.jpg";

  return (
    <>
      <BlogPostMetaData
        title={post.title}
        description={post.description}
        date={post.date}
        author="Ruh-Roh Retreat"
        slug={post.slug}
        hasCoverImage={post.hasCoverImage}
      />
      <BlogLayout>
        <div className="blogContainer">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="relative w-full h-[400px] mb-8">
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </BlogLayout>
    </>
  );
}

export async function getStaticProps({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const post = getPostData(slug);
  return {
    props: {
      post,
    },
  };
}

export async function getStaticPaths() {
  const posts = getSortedPostsData();
  const paths = posts.map((post) => {
    return {
      params: {
        slug: post.slug,
      },
    };
  });
  return {
    paths,
    fallback: false,
  };
}
