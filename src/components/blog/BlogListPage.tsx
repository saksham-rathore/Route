import Link from "next/link";
import type { PostMeta } from "@/lib/blog/mdx";
import { Navbar } from "@/components/landing/Navbar";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { siteConfig } from "@/lib/seo/config";
import { BlogCollectionJsonLd } from "@/lib/seo/json-ld";
import { getTagClassName } from "@/app/blog/tag-styles";

export const POSTS_PER_PAGE = 12;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type BlogListPageProps = {
  allPosts: PostMeta[];
  currentPage: number;
  totalPages: number;
  featuredPost: PostMeta | null;
  posts: PostMeta[];
};

export function BlogListPage({
  allPosts,
  currentPage,
  totalPages,
  featuredPost,
  posts,
}: BlogListPageProps) {
  const description =
    "Guides and product updates on real user network monitoring, web performance, and API reliability.";

  return (
    <div className="dashboard-theme min-h-screen overflow-x-hidden bg-[color:var(--dash-bg)] text-[color:var(--dash-text)]">
      {currentPage === 1 && (
        <BlogCollectionJsonLd
          name={`${siteConfig.name} Blog`}
          description={description}
          path="/blog"
          posts={allPosts}
        />
      )}
      <Navbar />
      <section className="mx-auto w-full max-w-7xl px-4 pb-20 pt-24 md:px-16 md:pb-24">
        <div className="border border-[color:var(--dash-divider)]">
          {/* Header */}
          <div className="px-6 py-12 md:px-10 md:py-14">
            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Blog</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[color:var(--dash-text-soft)]">
              Guides, product updates, and practical notes on privacy-friendly analytics, real user
              monitoring, web performance, and status pages.
            </p>
          </div>

          {/* Featured post (pinned on all pages) */}
          {featuredPost ? (
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block min-w-0 w-full overflow-hidden border-t border-[color:var(--dash-divider)] bg-[color:var(--dash-bg)] transition-colors hover:bg-[color:var(--dash-bg-subtle)]"
            >
              <article className="flex min-w-0 flex-col p-6 sm:min-h-[300px] sm:p-8 md:p-12">
                <time
                  dateTime={featuredPost.date}
                  className="font-mono text-sm font-semibold text-[color:var(--dash-text-muted)]"
                >
                  {formatDate(featuredPost.date)}
                </time>
                <div className="mt-6 flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--dash-text-muted)] sm:mt-8">
                  <span>Featured</span>
                  <span className="h-1 w-1 rounded-full bg-current" />
                  <span>{featuredPost.readingTime}</span>
                </div>
                <h2 className="mt-4 max-w-4xl text-balance break-words text-3xl font-semibold leading-tight tracking-tight transition-colors group-hover:text-[color:var(--dash-blue)] sm:text-4xl md:text-5xl">
                  {featuredPost.title}
                </h2>
                <p className="mt-4 min-w-0 max-w-3xl break-words text-sm font-medium leading-7 text-[color:var(--dash-text-soft)] line-clamp-4 sm:mt-6 sm:text-base sm:leading-8 sm:line-clamp-3">
                  {featuredPost.description}
                </p>
                <div className="mt-auto flex min-w-0 flex-wrap items-center gap-3 pt-8 font-mono text-sm font-semibold text-[color:var(--dash-text-muted)] sm:pt-12">
                  <span>{featuredPost.author}</span>
                  {featuredPost.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className={`px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] ${getTagClassName(tag)}`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Link>
          ) : null}

          {/* Post grid */}
          {posts.length === 0 ? (
            <p className="border-t border-[color:var(--dash-divider)] p-6 text-[color:var(--dash-text-soft)]">
              No posts yet. Check back soon.
            </p>
          ) : (
            <ul className="grid border-t border-[color:var(--dash-divider)] bg-[color:var(--dash-bg)] md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post, idx) => {
                const colCount3 = 3;
                const colCount2 = 2;
                const isLastIn3Col = (idx + 1) % colCount3 === 0;
                const isLastIn2Col = (idx + 1) % colCount2 === 0;

                return (
                  <li
                    key={post.slug}
                    className={`border-b border-[color:var(--dash-divider)] ${
                      !isLastIn3Col ? "xl:border-r" : ""
                    } ${!isLastIn2Col ? "md:max-xl:border-r" : ""}`}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group flex min-h-[280px] flex-col p-7 transition-colors hover:bg-[color:var(--dash-bg-subtle)] md:min-h-[310px] md:p-8"
                    >
                      <time
                        dateTime={post.date}
                        className="font-mono text-sm font-semibold text-[color:var(--dash-text-muted)]"
                      >
                        {formatDate(post.date)}
                      </time>
                      <h2 className="mt-6 line-clamp-2 text-xl font-semibold leading-tight tracking-tight transition-colors group-hover:text-[color:var(--dash-blue)] md:text-[22px]">
                        {post.title}
                      </h2>
                      <p className="mt-4 line-clamp-2 text-sm font-medium leading-6 text-[color:var(--dash-text-soft)]">
                        {post.description}
                      </p>
                      <div className="mt-auto flex min-w-0 items-center gap-3 pt-9 font-mono text-sm font-semibold text-[color:var(--dash-text-muted)]">
                        <span className="shrink-0">{post.author}</span>
                        {post.tags.slice(0, 1).map((tag) => (
                          <span
                            key={tag}
                            className={`min-w-0 truncate px-2.5 py-1 text-[11px] uppercase tracking-[0.12em] ${getTagClassName(tag)}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Blog pagination"
            className="mt-10 flex items-center justify-center gap-2"
          >
            {currentPage > 1 && (
              <Link
                href={currentPage === 2 ? "/blog" : `/blog/page/${currentPage - 1}`}
                className="inline-flex h-10 items-center rounded-md border border-[color:var(--dash-divider)] px-4 text-sm font-medium text-[color:var(--dash-text-soft)] transition-colors hover:border-[color:var(--dash-blue)] hover:text-[color:var(--dash-blue)]"
              >
                Previous
              </Link>
            )}

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
              const href = pageNum === 1 ? "/blog" : `/blog/page/${pageNum}`;
              const isCurrent = pageNum === currentPage;

              return (
                <Link
                  key={pageNum}
                  href={href}
                  aria-current={isCurrent ? "page" : undefined}
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium transition-colors ${
                    isCurrent
                      ? "bg-[color:var(--dash-blue)] text-white"
                      : "border border-[color:var(--dash-divider)] text-[color:var(--dash-text-soft)] hover:border-[color:var(--dash-blue)] hover:text-[color:var(--dash-blue)]"
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}

            {currentPage < totalPages && (
              <Link
                href={`/blog/page/${currentPage + 1}`}
                className="inline-flex h-10 items-center rounded-md border border-[color:var(--dash-divider)] px-4 text-sm font-medium text-[color:var(--dash-text-soft)] transition-colors hover:border-[color:var(--dash-blue)] hover:text-[color:var(--dash-blue)]"
              >
                Next
              </Link>
            )}
          </nav>
        )}
      </section>
      <SiteFooter />
    </div>
  );
}
