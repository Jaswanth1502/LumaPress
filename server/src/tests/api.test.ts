import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../app.js';
import { User } from '../models/User.js';
import { Post } from '../models/Post.js';
import { Comment } from '../models/Comment.js';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany({});
  await Post.deleteMany({});
  await Comment.deleteMany({});
});

describe('LumaPress API Test Suite', () => {
  describe('Authentication Endpoints', () => {
    it('1. Should register a user successfully and set auth cookie', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test Author',
          email: 'test@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('test@example.com');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    it('2. Should reject duplicate email registration case-insensitively', async () => {
      await User.create({
        name: 'Existing User',
        email: 'test@example.com',
        password: 'Password123!',
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'TEST@example.com',
          password: 'DifferentPassword456!',
          confirmPassword: 'DifferentPassword456!',
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it('3. Should reject registration when password is already taken by another user', async () => {
      await User.create({
        name: 'First User',
        email: 'user1@example.com',
        password: 'UniquePassword123!',
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Second User',
          email: 'user2@example.com',
          password: 'UniquePassword123!',
          confirmPassword: 'UniquePassword123!',
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('already in use by another registered user');
    });

    it('4. Should login user successfully and clear token on logout', async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User One',
          email: 'user1@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
        });

      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user1@example.com',
          password: 'Password123!',
        });

      expect(loginRes.status).toBe(200);
      expect(loginRes.headers['set-cookie']).toBeDefined();

      const cookie = loginRes.headers['set-cookie'];

      const meRes = await request(app).get('/api/auth/me').set('Cookie', cookie);
      expect(meRes.status).toBe(200);
      expect(meRes.body.data.user.email).toBe('user1@example.com');

      const logoutRes = await request(app).post('/api/auth/logout');
      expect(logoutRes.status).toBe(200);
    });

    it('5. Should reject invalid login credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'WrongPassword123!',
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('6. Should reject protected route access for unauthenticated request', async () => {
      const res = await request(app).get('/api/auth/me');
      expect(res.status).toBe(401);
    });
  });

  describe('Post Management & Ownership Authorization', () => {
    let user1Cookie: any;
    let user2Cookie: any;

    beforeEach(async () => {
      const res1 = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User One',
          email: 'postuser1@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
        });
      user1Cookie = res1.headers['set-cookie'];

      const res2 = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'User Two',
          email: 'postuser2@example.com',
          password: 'Password456!',
          confirmPassword: 'Password456!',
        });
      user2Cookie = res2.headers['set-cookie'];
    });

    it('7 & 8. Should create a draft and publish a post', async () => {
      const draftRes = await request(app)
        .post('/api/posts')
        .set('Cookie', user1Cookie)
        .send({
          title: 'My First Draft Post',
          excerpt: 'Draft excerpt summary text.',
          content: 'Detailed draft body content.',
          status: 'draft',
        });

      expect(draftRes.status).toBe(201);
      expect(draftRes.body.data.post.status).toBe('draft');

      const publishRes = await request(app)
        .post('/api/posts')
        .set('Cookie', user1Cookie)
        .send({
          title: 'My Published Post',
          excerpt: 'Published excerpt summary text.',
          content: 'Detailed published body content.',
          status: 'published',
        });

      expect(publishRes.status).toBe(201);
      expect(publishRes.body.data.post.status).toBe('published');
    });

    it('9. Should reject post creation with empty title/excerpt/content', async () => {
      const res = await request(app)
        .post('/api/posts')
        .set('Cookie', user1Cookie)
        .send({
          title: '   ',
          excerpt: '   ',
          content: '   ',
        });

      expect(res.status).toBe(400);
    });

    it('10 & 11. Should allow author to edit post and prevent User B from editing User A post', async () => {
      const createRes = await request(app)
        .post('/api/posts')
        .set('Cookie', user1Cookie)
        .send({
          title: 'Original Title',
          excerpt: 'Original Excerpt',
          content: 'Original Content',
          status: 'published',
        });

      const postId = createRes.body.data.post._id;

      // User 2 attempts edit -> 403
      const unauthorizedRes = await request(app)
        .patch(`/api/posts/${postId}`)
        .set('Cookie', user2Cookie)
        .send({ title: 'Hacked Title' });

      expect(unauthorizedRes.status).toBe(403);

      // User 1 edits own post -> 200
      const ownerRes = await request(app)
        .patch(`/api/posts/${postId}`)
        .set('Cookie', user1Cookie)
        .send({ title: 'Updated Title' });

      expect(ownerRes.status).toBe(200);
      expect(ownerRes.body.data.post.title).toBe('Updated Title');
    });

    it('12 & 13. Should allow author to delete post and prevent User B from deleting User A post', async () => {
      const createRes = await request(app)
        .post('/api/posts')
        .set('Cookie', user1Cookie)
        .send({
          title: 'Post To Delete',
          excerpt: 'Excerpt To Delete',
          content: 'Content To Delete',
          status: 'published',
        });

      const postId = createRes.body.data.post._id;

      // User 2 attempts delete -> 403
      const unauthDelete = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Cookie', user2Cookie);

      expect(unauthDelete.status).toBe(403);

      // User 1 deletes own post -> 200
      const ownerDelete = await request(app)
        .delete(`/api/posts/${postId}`)
        .set('Cookie', user1Cookie);

      expect(ownerDelete.status).toBe(200);
    });

    it('14 & 15. Should browse published posts while keeping drafts private from non-authors', async () => {
      await request(app)
        .post('/api/posts')
        .set('Cookie', user1Cookie)
        .send({
          title: 'Public Post 1',
          excerpt: 'Excerpt 1',
          content: 'Content 1',
          status: 'published',
          tags: ['React'],
        });

      const draftRes = await request(app)
        .post('/api/posts')
        .set('Cookie', user1Cookie)
        .send({
          title: 'Secret Draft',
          excerpt: 'Draft excerpt',
          content: 'Draft content',
          status: 'draft',
        });

      const draftSlug = draftRes.body.data.post.slug;

      // Unauthenticated browse
      const listRes = await request(app).get('/api/posts');
      expect(listRes.status).toBe(200);
      expect(listRes.body.data.posts.length).toBe(1);
      expect(listRes.body.data.posts[0].title).toBe('Public Post 1');

      // User 2 tries to view User 1 draft -> 403
      const viewDraftUnauth = await request(app)
        .get(`/api/posts/${draftSlug}`)
        .set('Cookie', user2Cookie);

      expect(viewDraftUnauth.status).toBe(403);

      // User 1 views own draft -> 200
      const viewDraftOwner = await request(app)
        .get(`/api/posts/${draftSlug}`)
        .set('Cookie', user1Cookie);

      expect(viewDraftOwner.status).toBe(200);
      expect(viewDraftOwner.body.data.post.title).toBe('Secret Draft');
    });

    it('21. Should filter, search, sort and paginate posts correctly', async () => {
      await request(app)
        .post('/api/posts')
        .set('Cookie', user1Cookie)
        .send({
          title: 'TypeScript Design Systems',
          excerpt: 'Building UI component libraries in TS',
          content: 'Design systems with React and Tailwind CSS',
          tags: ['Design', 'TypeScript'],
          status: 'published',
        });

      await request(app)
        .post('/api/posts')
        .set('Cookie', user1Cookie)
        .send({
          title: 'MongoDB Query Performance',
          excerpt: 'Optimizing Mongoose queries',
          content: 'Database indexing strategies',
          tags: ['Database', 'Nodejs'],
          status: 'published',
        });

      // Search query
      const searchRes = await request(app).get('/api/posts?q=TypeScript');
      expect(searchRes.status).toBe(200);
      expect(searchRes.body.data.posts.length).toBe(1);

      // Tag filter
      const tagRes = await request(app).get('/api/posts?tag=Database');
      expect(tagRes.status).toBe(200);
      expect(tagRes.body.data.posts.length).toBe(1);
    });
  });

  describe('Comment System & Ownership Authorization', () => {
    let user1Cookie: any;
    let user2Cookie: any;
    let postId: string;

    beforeEach(async () => {
      const res1 = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Comment Author 1',
          email: 'commentuser1@example.com',
          password: 'Password123!',
          confirmPassword: 'Password123!',
        });
      user1Cookie = res1.headers['set-cookie'];

      const res2 = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Comment Author 2',
          email: 'commentuser2@example.com',
          password: 'Password456!',
          confirmPassword: 'Password456!',
        });
      user2Cookie = res2.headers['set-cookie'];

      const postRes = await request(app)
        .post('/api/posts')
        .set('Cookie', user1Cookie)
        .send({
          title: 'Post For Comment Testing',
          excerpt: 'Testing comments',
          content: 'Comment testing body',
          status: 'published',
        });
      postId = postRes.body.data.post._id;
    });

    it('17 & 18. Should add comment and reject empty comments', async () => {
      const emptyRes = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Cookie', user2Cookie)
        .send({ content: '   ' });

      expect(emptyRes.status).toBe(400);

      const addRes = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Cookie', user2Cookie)
        .send({ content: 'Insightful post!' });

      expect(addRes.status).toBe(201);
      expect(addRes.body.data.comment.content).toBe('Insightful post!');
    });

    it('19 & 20. Should allow comment owner to delete comment and block other users', async () => {
      const addRes = await request(app)
        .post(`/api/posts/${postId}/comments`)
        .set('Cookie', user1Cookie)
        .send({ content: 'My own comment' });

      const commentId = addRes.body.data.comment._id;

      // User 2 tries to delete User 1 comment -> 403
      const unauthDelete = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Cookie', user2Cookie);

      expect(unauthDelete.status).toBe(403);

      // User 1 deletes own comment -> 200
      const ownerDelete = await request(app)
        .delete(`/api/comments/${commentId}`)
        .set('Cookie', user1Cookie);

      expect(ownerDelete.status).toBe(200);
    });
  });
});
