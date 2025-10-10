import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import LandingComponent from '../landing';

// Mock child components to isolate LandingComponent
jest.mock('../photo-gallery', () => ({
    __esModule: true,
    default: () => <div>Photo Gallery Mock</div>,
}));
jest.mock('../floating-bone', () => ({
    __esModule: true,
    default: () => <div>Floating Bone Mock</div>,
}));
jest.mock('../floating-yoga-dog', () => ({
    __esModule: true,
    default: () => <div>Floating Yoga Dog Mock</div>,
}));

// Mock framer-motion to remove animations and invalid props from DOM
jest.mock('framer-motion', () => {
    const realFramerMotion = jest.requireActual('framer-motion');
    const motion = {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    };
    return {
        ...realFramerMotion,
        motion,
        AnimatePresence: ({ children }: any) => <>{children}</>,
    };
});

// Mock next/image to be a simple <img> tag and handle props correctly
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { src, alt, objectFit, layout, quality, priority, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img src={src} alt={alt} {...rest} />;
  },
}));

// Mock fetch API with more specific responses
global.fetch = jest.fn((url) => {
    if (url === '/api/booking') {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ message: 'Success' }),
        });
    }
    if (url === '/api/hero-images') {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ images: ['/hero/hero-1.jpeg'] }),
        });
    }
    if (url === '/data/reviews.json') {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 1, name: 'Test Reviewer', image: '/test.jpg', rating: 5, text: 'A great review', date: '2025-01-01' }]),
        });
    }
    if (url === '/data/highlighted-reviews.json') {
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ id: 1, name: 'Test Reviewer', image: '/test.jpg', rating: 5, text: 'A great review', date: '2025-01-01' }]),
        });
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    });
}) as jest.Mock;

describe('LandingComponent', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
    (window as any).clarity = jest.fn();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  // Helper to render and wait for async effects
  const renderComponent = async () => {
    await act(async () => {
      render(<LandingComponent />);
      // This will advance timers and flush promises
      jest.runOnlyPendingTimers();
    });
  };

  it('renders the main heading', async () => {
    await renderComponent();
    expect(
      await screen.findByText('Ruh-Roh Retreat - Not Your Average Pet Sitter')
    ).toBeInTheDocument();
  });

  it('allows the user to fill out and submit the booking form', async () => {
    await renderComponent();

    // Use findBy to ensure the section is loaded
    await screen.findByText('Book My Services');

    fireEvent.change(screen.getByLabelText('First Name *'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText('Last Name *'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email *'), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Phone Number *'), {
      target: { value: '1234567890' },
    });
    fireEvent.change(screen.getByLabelText('Pet Name *'), {
      target: { value: 'Buddy' },
    });
    fireEvent.change(screen.getByLabelText('Start Date *'), {
      target: { value: '2025-10-20' },
    });
    fireEvent.change(screen.getByLabelText('End Date *'), {
      target: { value: '2025-10-25' },
    });

    await act(async () => {
        fireEvent.click(screen.getByText('Request Booking'));
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/booking', expect.any(Object));
    });

    expect(await screen.findByText('Booking Request Received!')).toBeInTheDocument();
  });
});