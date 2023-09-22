import Link from 'next/link';
import { ProductCard } from "@demo/components";
/* eslint-disable-next-line */
export interface PagesLandingPageProps {}

export function PagesLandingPage(props: PagesLandingPageProps) {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-500 min-h-screen">
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center text-white mb-8">About Us</h1>
      <p className="text-white text-lg mb-4">
        This is a basic About Us page, created with Tailwind CSS, NX, and Next.js.
      </p>
      <p className="text-white text-lg mb-4">
        I built this page to showcase how to use these amazing tools together for my Medium article.
      </p>
      <p className="text-white text-lg mb-4">
        Tailwind CSS provides a powerful set of pre-built styles that make styling websites easier and faster.
        NX is a toolset for building monorepo-style projects, enabling code sharing and efficient development workflows.
        Next.js is a popular framework for building fast and optimized web applications.
      </p>
      <p className="text-white text-lg">
        By combining these tools, we can create amazing websites with clean and maintainable code.
      </p>
      <Link legacyBehavior href="/about-us">
          <a className="bg-white text-blue-500 py-2 px-4 rounded-lg font-bold text-lg hover:bg-blue-500 hover:text-white transition duration-300 ease-in-out">
            Learn More
          </a>
        </Link>
    </div>
  </div>
  );
}

export default PagesLandingPage;
