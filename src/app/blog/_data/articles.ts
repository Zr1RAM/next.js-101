export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string[];
  category: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
  };
}

export const ARTICLES: Article[] = [
  {
    id: "hi",
    title: "Saying Hi to Next.js",
    excerpt: "A short introduction to Next.js App Router, React Server Components, and the evolution of modern web development.",
    category: "Getting Started",
    readTime: "3 min read",
    publishedAt: "Sep 10, 2026",
    author: {
      name: "Alex Rivera",
      role: "Frontend Architect",
    },
    content: [
      "Next.js App Router introduces a paradigm shift in building full-stack web applications. By embracing React Server Components (RSC) by default, Next.js enables developers to render UI components on the server without sending unnecessary JavaScript bundles to the client.",
      "This architecture dramatically decreases bundle sizes, accelerates Initial Page Loads, and improves Core Web Vitals across the board. In addition, nested layouts and folder-based routing create predictable structure for large enterprise applications.",
      "Whether you are building simple content blogs or high-concurrency e-commerce portals, mastering the App Router foundation is the fastest path to delivering snappy, resilient user experiences."
    ],
  },
  {
    id: "navigation",
    title: "Programmatic Navigation & Route Interception",
    excerpt: "How to use useRouter effectively alongside Next.js route interception and contextual modal workflows.",
    category: "Advanced Routing",
    readTime: "5 min read",
    publishedAt: "Sep 12, 2026",
    author: {
      name: "Sophia Chen",
      role: "Lead Systems Engineer",
    },
    content: [
      "In modern single-page applications, retaining user context is paramount. Traditional modals often disrupt navigation flow by not altering the URL, while regular full-page navigations lose the underlying context of the list or gallery.",
      "Next.js Intercepting Routes solve this challenge gracefully. By prefixing route segments with markers such as '(.)' for same-level routes or '(..)' for parent-level routes, client-side soft navigations can load an overlay or preview state without leaving the host page.",
      "Furthermore, when combined with 'router.back()', users can dismiss intercepted overlays using familiar browser back gestures or hardware keys. Direct URL access or page refreshes cleanly fall back to the standalone full-page view."
    ],
  },
  {
    id: "styling",
    title: "Styling with Tailwind CSS & Design Tokens",
    excerpt: "Making your blog look beautiful with consistent typography, micro-animations, and seamless dark mode.",
    category: "UI / UX Design",
    readTime: "4 min read",
    publishedAt: "Sep 13, 2026",
    author: {
      name: "Marcus Vance",
      role: "Design Engineer",
    },
    content: [
      "Consistent styling is the cornerstone of high-converting web applications. Tailwind CSS allows developers to apply utility-first design systems directly in markup while preserving cohesive spacing, color palettes, and typography tokens.",
      "Integrating dark mode support with Tailwind's 'dark:' variant ensures that readability remains optimal across all lighting environments. Subtle borders, glassmorphic backdrop filters, and smooth hover transitions elevate an interface from standard to premium.",
      "Pairing modern design aesthetics with accessible interactive elements ensures an engaging, polished experience that keeps readers immersed in your content."
    ],
  },
];

export function getArticleById(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.id.toLowerCase() === slug.toLowerCase());
}
