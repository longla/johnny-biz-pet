import { BlogMetaData } from "@/components/meta-data";
import Link from "next/link";

type BlogLayoutProps = {
  children: React.ReactNode;
};

const BlogLayout: React.FC<BlogLayoutProps> = ({ children }) => (
  <>
    <BlogMetaData />
    <div className="mainContainer h-[60px]  flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold hover:no-underline">
        <span className="text-primary-500">QR</span>
        <span className="text-gray-950">ganiz</span>
      </Link>
    </div>
    <main>{children}</main>

    <section className="blogContainer">
      <div className="flex flex-col items-center justify-center py-6">
        <div className="flex gap-3 my-4">
          <Link href="/terms-of-use">Term of Use</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/blog">Blog</Link>
        </div>
        <div>
          ©2025 <span className="text-primary-500">JOY</span> Digital Solutions,
          LLC. All rights reserved.
        </div>
      </div>
    </section>
  </>
);

export default BlogLayout;
