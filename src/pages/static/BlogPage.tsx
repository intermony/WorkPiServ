export default function BlogPage() {
  const posts = [
    { title: 'WorkπServ launches on Pi Mainnet', date: 'June 2026', excerpt: 'We are excited to announce the official launch of WorkπServ on Pi Network Mainnet...' },
    { title: 'How to earn Pi with your skills', date: 'May 2026', excerpt: 'A complete guide to creating your first service and earning Pi cryptocurrency...' },
    { title: 'The power of Escrow for freelancers', date: 'April 2026', excerpt: 'Learn how our Escrow system protects both clients and freelancers...' },
  ];
  return (
    <div className="section-container py-16 max-w-3xl mx-auto">
      <h1 className="font-heading font-bold text-3xl text-navy mb-8">Blog</h1>
      <div className="space-y-6">
        {posts.map((post, i) => (
          <div key={i} className="border border-border rounded-xl p-6 hover:border-brand transition-colors">
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{post.date}</span>
            <h2 className="font-heading font-bold text-xl text-navy mt-1 mb-2">{post.title}</h2>
            <p className="text-muted-foreground text-sm">{post.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
