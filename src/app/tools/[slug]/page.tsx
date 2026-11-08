import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SEO_GS1_TOOLS } from "@/data/seo-tools";
import { GS1StudioApp } from "@/components/GS1StudioApp";

export function generateStaticParams() {
  return SEO_GS1_TOOLS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = SEO_GS1_TOOLS.find((t) => t.slug === slug);
  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.description,
    alternates: {
      canonical: `/tools/${tool.slug}`,
    },
    openGraph: {
      title: tool.title,
      description: tool.description,
      url: `/tools/${tool.slug}`,
      type: "website",
    },
  };
}

export default async function ProgrammaticGS1ToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = SEO_GS1_TOOLS.find((t) => t.slug === slug);

  if (!tool) {
    notFound();
  }

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: tool.faqQuestionEn,
        acceptedAnswer: {
          "@type": "Answer",
          text: tool.faqAnswerEn,
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }}
      />
      <GS1StudioApp initialTool={tool} />
    </>
  );
}
