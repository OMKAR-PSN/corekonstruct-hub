import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, User } from "lucide-react";

const posts = [
  {
    id: 1,
    title: "CoreKonstruct Launches: Bringing Construction into the Digital Age",
    excerpt: "We're excited to announce the launch of CoreKonstruct — a platform built from the ground up for the construction industry.",
    author: "CK Team",
    date: "2026-03-10",
  },
  {
    id: 2,
    title: "5 Ways GPS Tracking Improves Site Accountability",
    excerpt: "Learn how GPS-verified attendance reduces ghost workers and improves project transparency.",
    author: "CK Team",
    date: "2026-03-08",
  },
  {
    id: 3,
    title: "Material Tracking Best Practices for Supervisors",
    excerpt: "A quick guide on how supervisors can efficiently log and track material usage on construction sites.",
    author: "CK Team",
    date: "2026-03-05",
  },
];

const Blog = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container pt-28 pb-16 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold">Notice Board</h1>
        <p className="mt-3 text-muted-foreground">Company updates, industry news, and best practices.</p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <article key={post.id}>
            <Card className="border-border/50 bg-card/50 hover:border-primary/30 transition-colors">
              <CardContent className="p-6">
                <h2 className="text-xl font-display font-semibold mb-2">{post.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{post.date}</span>
                </div>
              </CardContent>
            </Card>
          </article>
        ))}
      </div>
    </div>
  </div>
);

export default Blog;
