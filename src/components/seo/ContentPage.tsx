import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/routing";
import type { ReactNode } from "react";

export type ContentBreadcrumb = {
  label: string;
  href?: string;
};

export type ContentSection = {
  title: string;
  paragraphs: string[];
  list?: string[];
  /** Optional paragraphs rendered after the list */
  paragraphsAfter?: string[];
};

export type ContentFaqItem = {
  question: string;
  answer: string;
};

export type ContentRelatedLink = {
  title: string;
  href: string;
  description?: string;
};

type ContentPageProps = {
  breadcrumb: ContentBreadcrumb[];
  title: string;
  intro: string;
  /** Optional line under the intro (e.g. last updated) */
  meta?: string;
  sections: ContentSection[];
  faq?: {
    title: string;
    items: ContentFaqItem[];
  };
  ctaLabel: string;
  related?: {
    title: string;
    links: ContentRelatedLink[];
  };
  children?: ReactNode;
};

export function ContentPage({
  breadcrumb,
  title,
  intro,
  meta,
  sections,
  faq,
  ctaLabel,
  related,
  children,
}: ContentPageProps) {
  return (
    <main className="border-t border-border bg-background">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;
              return (
                <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
                  {index > 0 && (
                    <span aria-hidden="true" className="text-muted-foreground/60">
                      /
                    </span>
                  )}
                  {item.href && !isLast ? (
                    <Link
                      href={item.href}
                      className="transition-colors hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={isLast ? "font-medium text-foreground" : undefined}
                      aria-current={isLast ? "page" : undefined}
                    >
                      {item.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <header className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
            {intro}
          </p>
          {meta && <p className="text-sm text-muted-foreground">{meta}</p>}
        </header>

        <div className="mt-10 space-y-10 text-muted-foreground">
          {sections.map((section) => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
              {section.list && section.list.length > 0 && (
                <ul className="list-disc space-y-2 pl-5">
                  {section.list.map((item) => (
                    <li key={item.slice(0, 48)} className="leading-relaxed">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.paragraphsAfter?.map((paragraph) => (
                <p key={paragraph.slice(0, 48)} className="text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          {faq && faq.items.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground sm:text-2xl">
                {faq.title}
              </h2>
              <div className="space-y-3">
                {faq.items.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-lg border border-border bg-card p-4 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-center justify-between gap-2 font-medium text-foreground">
                      <span>{item.question}</span>
                      <span className="transition-transform duration-300 group-open:-rotate-180">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="h-5 w-5"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                          />
                        </svg>
                      </span>
                    </summary>
                    <p className="mt-3 leading-relaxed">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}

          {children}

          {related && related.links.length > 0 && (
            <section className="space-y-4 border-t border-border pt-8">
              <h2 className="text-xl font-semibold text-foreground">{related.title}</h2>
              <ul className="grid gap-3 sm:grid-cols-2">
                {related.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      <span className="font-medium text-foreground">{link.title}</span>
                      {link.description && (
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {link.description}
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="mt-12 rounded-lg border border-border bg-muted/40 p-6 text-center">
          <Button asChild size="lg">
            <Link href="/">{ctaLabel}</Link>
          </Button>
        </div>
      </article>
    </main>
  );
}
