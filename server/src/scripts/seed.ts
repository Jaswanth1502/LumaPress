import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';
import { connectDB } from '../config/db.js';
import { slugify } from '../utils/helpers.js';

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[Seed] Clearing existing collections...');

    await Promise.all([
      User.deleteMany({}),
      Post.deleteMany({}),
      Comment.deleteMany({}),
    ]);

    console.log('[Seed] Creating demo users...');
    const user1 = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'Author123!',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: 'Senior Technical Writer and Software Architect exploring full-stack engineering & AI patterns.',
      role: 'admin',
    });

    const user2 = await User.create({
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'Author123!',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      bio: 'UX Strategist and Product Designer passionate about typography, glassmorphism, and minimal design systems.',
      role: 'user',
    });

    console.log('[Seed] Creating sample blog posts...');

    const post1 = await Post.create({
      title: 'Building Modern Full-Stack Applications with React and Node.js',
      slug: slugify('Building Modern Full-Stack Applications with React and Node.js'),
      excerpt: 'Discover the architecture, design principles, and best practices for creating scalable full-stack applications in 2026.',
      content: `
# Building Modern Full-Stack Applications

Building full-stack web applications requires careful architectural planning, secure authentication strategies, and high-performance frontend data fetching.

## Key Architectural Decisions

1. **Monorepo Structure**: Keeping client and server in unified tooling streamlines typescript sharing and deployment.
2. **HTTP-Only Cookies**: Storing JWT tokens in secure cookies guards against XSS token exfiltration.
3. **Optimistic UI Updates**: Leveraging TanStack Query allows instant user feedback during comment and post mutations.

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

### Sample Code Block

\`\`\`typescript
interface PostPayload {
  title: string;
  content: string;
  status: 'draft' | 'published';
}
\`\`\`

With these foundations, full-stack applications scale smoothly across desktop and mobile devices.
      `.trim(),
      coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=80',
      tags: ['Engineering', 'React', 'Nodejs', 'Architecture'],
      status: 'published',
      author: user1._id,
    });

    const post2 = await Post.create({
      title: 'The Art of Editorial UI: Color Grading, Typography & Glassmorphism',
      slug: slugify('The Art of Editorial UI: Color Grading, Typography & Glassmorphism'),
      excerpt: 'How thoughtful typography pairing, warm background tints, and soft backdrop filters elevate digital reading experiences.',
      content: `
# The Art of Editorial UI

Digital publishing is evolving beyond rigid rectangular grids into organic, editorial layouts that honor classic typography while leveraging modern CSS capabilities.

## Soft Glassmorphism and Warm Tints

Instead of harsh white backgrounds or generic dark modes, warm off-white tones paired with subtle \`backdrop-filter: blur()\` elements create visual depth without distracting the reader.

### Key Principles

- **Contrast Hierarchy**: Primary headings in rich dark charcoal, body copy in warm gray.
- **Serif Accents**: Editorial headlines using serif font pairings convey craft and substance.
- **Generous Whitespace**: Giving content room to breathe improves reading comprehension.

Enjoy reading on LumaPress!
      `.trim(),
      coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
      tags: ['Design', 'UX', 'CSS', 'Typography'],
      status: 'published',
      author: user2._id,
    });

    const post3 = await Post.create({
      title: 'Draft: Future Directions in Distributed Database Systems',
      slug: slugify('Draft: Future Directions in Distributed Database Systems'),
      excerpt: 'Unpublished draft notes on distributed consensus, NoSQL indexing, and multi-region data replication.',
      content: `
# Distributed Databases Overview (Work in Progress)

These are internal author draft notes exploring MongoDB multi-document transactions and replication lag.

* [ ] Benchmark read preferences
* [ ] Verify index selectivity on composite tags
* [ ] Write section on shard key selection
      `.trim(),
      coverImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
      tags: ['Database', 'Distributed', 'Draft'],
      status: 'draft',
      author: user1._id,
    });

    console.log('[Seed] Creating demo comments...');

    await Comment.create([
      {
        content: 'Exceptional write-up, John! The breakdown on HTTP-Only cookie security is spot on.',
        post: post1._id,
        author: user2._id,
      },
      {
        content: 'Thanks Jane! Appreciate your feedback on the architecture design.',
        post: post1._id,
        author: user1._id,
      },
      {
        content: 'Love the warm off-white palette and font choices on this platform!',
        post: post2._id,
        author: user1._id,
      },
    ]);

    console.log('[Seed] Database seeded successfully!');
    console.log('\n--- Demo User Credentials ---');
    console.log('User 1: john@example.com / Author123! (Admin/Author)');
    console.log('User 2: jane@example.com / Author123! (Author)\n');

    if (process.argv[1]?.endsWith('seed.ts')) {
      await mongoose.disconnect();
      process.exit(0);
    }
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

if (process.argv[1]?.endsWith('seed.ts')) {
  seedDatabase();
}
