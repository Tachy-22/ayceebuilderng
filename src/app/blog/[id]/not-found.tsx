import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto py-20 px-4">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Blog Post Not Found</h1>
        <p className="text-muted-foreground mb-8">
          Sorry, the blog post you are looking for does not exist or has been
          removed.
        </p>
        <Link href="/blog">
          <Button>Return to Blog</Button>
        </Link>
      </div>
    </div>
  );
}
