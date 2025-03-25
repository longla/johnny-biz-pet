import { PostCardCompoent } from "@/components/post-card";
import { Post } from "@/core/types";
import { getSortedPostsData } from "@/lib/post";
import BlogLayout from "./_layout";

export default function Blog({ posts }: { posts: any }) {
  return (
    <BlogLayout>
      <BlogPosts posts={posts} />
    </BlogLayout>
  );
}

const BlogPosts = ({ posts }: { posts: Post[] }) => {
  return (
    <div className="blogContainer">
      {posts.map((post) => (
        <div key={post.id} className="mt-5">
          <PostCardCompoent post={post}></PostCardCompoent>
        </div>
      ))}
    </div>
  );
};

export async function getStaticProps() {
  const posts = getSortedPostsData();
  return {
    props: {
      posts,
    },
  };
}
