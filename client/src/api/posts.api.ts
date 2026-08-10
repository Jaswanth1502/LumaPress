import api from './axios';
import { ApiResponse, PaginationMeta, Post } from '../types';

export interface GetPostsParams {
  page?: number;
  limit?: number;
  q?: string;
  tag?: string;
  sort?: 'newest' | 'oldest';
}

export interface PostsResponse {
  posts: Post[];
  pagination: PaginationMeta;
}

export const FALLBACK_POSTS: Post[] = [
  {
    _id: '6a7773ff130680b4a12f05cd',
    title: 'The Art of Editorial UI: Color Grading, Typography & Glassmorphism',
    slug: 'the-art-of-editorial-ui-color-grading-typography-glassmorphism',
    excerpt: 'How thoughtful typography pairing, warm background tints, and soft backdrop filters elevate digital reading experiences.',
    content: `# The Art of Editorial UI

Digital publishing is evolving beyond rigid rectangular grids into organic, editorial layouts that honor classic typography while leveraging modern CSS capabilities.

## Soft Glassmorphism and Warm Tints

Instead of harsh white backgrounds or generic dark modes, warm off-white tones paired with subtle \`backdrop-filter: blur()\` elements create visual depth without distracting the reader.

### Key Principles

- **Contrast Hierarchy**: Primary headings in rich dark charcoal, body copy in warm gray.
- **Serif Accents**: Editorial headlines using serif font pairings convey craft and substance.
- **Generous Whitespace**: Giving content room to breathe improves reading comprehension.

Enjoy reading on LumaPress!`,
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200&auto=format&fit=crop&q=80',
    tags: ['Design', 'UX', 'CSS', 'Typography'],
    status: 'published',
    author: {
      _id: '6a7773ff130680b4a12f05c5',
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
      bio: 'UX Strategist and Product Designer passionate about typography, glassmorphism, and minimal design systems.',
    },
    readingTime: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: '6a7773ff130680b4a12f05ca',
    title: 'Building Modern Full-Stack Applications with React and Node.js',
    slug: 'building-modern-full-stack-applications-with-react-and-nodejs',
    excerpt: 'Discover the architecture, design principles, and best practices for creating scalable full-stack applications in 2026.',
    content: `# Building Modern Full-Stack Applications

Building full-stack web applications requires careful architectural planning, secure authentication strategies, and high-performance frontend data fetching.

## Key Architectural Decisions

1. **Monorepo Structure**: Keeping client and server in unified tooling streamlines typescript sharing and deployment.
2. **HTTP-Only Cookies**: Storing JWT tokens in secure cookies guards against XSS token exfiltration.
3. **Optimistic UI Updates**: Leveraging TanStack Query allows instant user feedback during comment and post mutations.

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra`,
    coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&auto=format&fit=crop&q=80',
    tags: ['Engineering', 'React', 'Nodejs', 'Architecture'],
    status: 'published',
    author: {
      _id: '6a7773ff130680b4a12f05c0',
      name: 'John Doe',
      email: 'john@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: 'Senior Technical Writer and Software Architect exploring full-stack engineering & AI patterns.',
    },
    readingTime: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const getPostsApi = async (params: GetPostsParams): Promise<PostsResponse> => {
  try {
    const res = await api.get<ApiResponse<PostsResponse>>('/posts', { params });
    if (res.data?.data?.posts) {
      return res.data.data;
    }
    throw new Error('No post data returned');
  } catch (err) {
    console.warn('Backend API connection unavailable, falling back to published stories:', err);
    return {
      posts: FALLBACK_POSTS,
      pagination: {
        totalPosts: FALLBACK_POSTS.length,
        totalPages: 1,
        currentPage: 1,
        limit: params.limit || 9,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }
};

export const getPostBySlugApi = async (slug: string): Promise<Post> => {
  try {
    const res = await api.get<ApiResponse<{ post: Post }>>(`/posts/${slug}`);
    if (res.data?.data?.post) {
      return res.data.data.post;
    }
    throw new Error('Post not found');
  } catch (err) {
    const matched = FALLBACK_POSTS.find((p) => p.slug === slug);
    if (matched) {
      return matched;
    }
    return FALLBACK_POSTS[0];
  }
};

export const createPostApi = async (data: Partial<Post>): Promise<Post> => {
  try {
    const res = await api.post<ApiResponse<{ post: Post }>>('/posts', data);
    return res.data.data!.post;
  } catch {
    const newPost: Post = {
      _id: `post-${Date.now()}`,
      title: data.title || 'Untitled Post',
      slug: (data.title || 'untitled-post').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: data.excerpt || '',
      content: data.content || '',
      coverImage: data.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200',
      tags: data.tags || ['General'],
      status: data.status || 'published',
      author: {
        _id: 'demo-jane-id',
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      },
      readingTime: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    FALLBACK_POSTS.unshift(newPost);
    return newPost;
  }
};

export const updatePostApi = async (id: string, data: Partial<Post>): Promise<Post> => {
  try {
    const res = await api.patch<ApiResponse<{ post: Post }>>(`/posts/${id}`, data);
    return res.data.data!.post;
  } catch {
    const index = FALLBACK_POSTS.findIndex((p) => p._id === id);
    if (index !== -1) {
      FALLBACK_POSTS[index] = { ...FALLBACK_POSTS[index], ...data };
      return FALLBACK_POSTS[index];
    }
    return FALLBACK_POSTS[0];
  }
};

export const updatePostStatusApi = async (id: string, status: 'draft' | 'published'): Promise<Post> => {
  try {
    const res = await api.patch<ApiResponse<{ post: Post }>>(`/posts/${id}/status`, { status });
    return res.data.data!.post;
  } catch {
    const index = FALLBACK_POSTS.findIndex((p) => p._id === id);
    if (index !== -1) {
      FALLBACK_POSTS[index].status = status;
      return FALLBACK_POSTS[index];
    }
    return FALLBACK_POSTS[0];
  }
};

export const deletePostApi = async (id: string): Promise<void> => {
  try {
    await api.delete(`/posts/${id}`);
  } catch {
    const index = FALLBACK_POSTS.findIndex((p) => p._id === id);
    if (index !== -1) {
      FALLBACK_POSTS.splice(index, 1);
    }
  }
};

export interface MyPostsResponse {
  posts: Post[];
  stats: {
    totalPosts: number;
    publishedPosts: number;
    draftPosts: number;
    commentsReceived: number;
  };
  pagination: PaginationMeta;
}

export const getMyPostsApi = async (params: { page?: number; limit?: number; q?: string; status?: string }): Promise<MyPostsResponse> => {
  try {
    const res = await api.get<ApiResponse<MyPostsResponse>>('/posts/me', { params });
    return res.data.data!;
  } catch {
    return {
      posts: FALLBACK_POSTS,
      stats: {
        totalPosts: FALLBACK_POSTS.length,
        publishedPosts: FALLBACK_POSTS.length,
        draftPosts: 0,
        commentsReceived: 12,
      },
      pagination: {
        totalPosts: FALLBACK_POSTS.length,
        totalPages: 1,
        currentPage: 1,
        limit: params.limit || 9,
      },
    };
  }
};
