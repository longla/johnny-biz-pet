import { render, screen } from '@testing-library/react';
import { PostCardCompoent } from '../post-card';
import { Post } from '@/core/types';

describe('PostCardCompoent', () => {
  const mockPost: Post = {
    title: 'Test Post',
    slug: 'test-post',
    description: 'This is a test post.',
    author: 'Test Author',
    date: '2025-10-07',
    hasCoverImage: false,
  };

  it('renders the post title, description, author, and date', () => {
    render(<PostCardCompoent post={mockPost} />);

    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('This is a test post.')).toBeInTheDocument();
    expect(screen.getByText('Test Author')).toBeInTheDocument();
    expect(screen.getByText('2025-10-07')).toBeInTheDocument();
  });

  it('renders the post link', () => {
    render(<PostCardCompoent post={mockPost} />);

    const link = screen.getByRole('link', { name: 'Test Post' });
    expect(link).toHaveAttribute('href', '/blog/test-post');
  });

  it('renders the default cover image when hasCoverImage is false', () => {
    render(<PostCardCompoent post={mockPost} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining('/about-image.jpeg'));
  });

  it('renders the post cover image when hasCoverImage is true', () => {
    const postWithCover: Post = {
      ...mockPost,
      hasCoverImage: true,
    };
    render(<PostCardCompoent post={postWithCover} />);

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining('/posts/test-post/cover.jpg'));
  });
});
