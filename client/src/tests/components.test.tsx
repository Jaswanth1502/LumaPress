import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TagBadge } from '../components/TagBadge';
import { EmptyState } from '../components/EmptyState';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { PostCard } from '../components/PostCard';
import { Post } from '../types';

describe('Frontend Component Tests', () => {
  it('Should render TagBadge correctly and handle click events', () => {
    const handleClick = vi.fn();
    render(<TagBadge tag="Engineering" onClick={handleClick} />);

    const badge = screen.getByText('#Engineering');
    expect(badge).toBeInTheDocument();
    fireEvent.click(badge);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('Should render EmptyState with title and action button', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState
        title="No Articles Available"
        description="Write the first article to get started."
        action={{ label: 'Create Post', onClick: handleAction }}
      />
    );

    expect(screen.getByText('No Articles Available')).toBeInTheDocument();
    const btn = screen.getByText('Create Post');
    fireEvent.click(btn);
    expect(handleAction).toHaveBeenCalledTimes(1);
  });

  it('Should render DeleteConfirmModal and trigger confirm/cancel handlers', () => {
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    render(
      <DeleteConfirmModal
        isOpen={true}
        title="Delete Post"
        message="Are you sure you want to delete this post?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('Delete Post')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Cancel'));
    expect(onCancel).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Delete Permanently'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('Should render PostCard with title, author, reading time and tag badges', () => {
    const mockPost: Post = {
      _id: 'post1',
      title: 'Testing React Applications with Vitest',
      slug: 'testing-react-applications-with-vitest',
      excerpt: 'Comprehensive guide to testing React components.',
      content: 'Sample post body content',
      tags: ['Testing', 'React'],
      status: 'published',
      author: {
        _id: 'user1',
        name: 'Jane Doe',
        email: 'jane@example.com',
      },
      readingTime: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    render(
      <BrowserRouter>
        <PostCard post={mockPost} />
      </BrowserRouter>
    );

    expect(screen.getByText('Testing React Applications with Vitest')).toBeInTheDocument();
    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('3 min read')).toBeInTheDocument();
    expect(screen.getByText('#Testing')).toBeInTheDocument();
  });
});
