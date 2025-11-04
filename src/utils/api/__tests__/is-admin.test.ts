import { isAdmin } from '../is-admin';
import { createServerClient } from '@supabase/ssr';
import { NextApiRequest, NextApiResponse } from 'next';

jest.mock('@supabase/ssr');

const createMockSupabaseClient = (user: any, userData: any, error: any) => ({
  auth: {
    getUser: jest.fn().mockResolvedValue({ data: { user } }),
  },
  from: jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({ data: userData, error }),
      }),
    }),
  }),
});

describe('isAdmin', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      cookies: {},
    };
    res = {};
    (createServerClient as jest.Mock).mockClear();
  });

  it('should return false if there is no user', async () => {
    const mockSupabase = createMockSupabaseClient(null, null, null);
    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

    const result = await isAdmin(req as NextApiRequest, res as NextApiResponse);
    expect(result).toBe(false);
  });

  it('should return false if there is a database error', async () => {
    const user = { id: '123' };
    const dbError = new Error('Database error');
    const mockSupabase = createMockSupabaseClient(user, null, dbError);
    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

    const result = await isAdmin(req as NextApiRequest, res as NextApiResponse);
    expect(result).toBe(false);
  });

  it('should return false if user data is not found', async () => {
    const user = { id: '123' };
    const mockSupabase = createMockSupabaseClient(user, null, null);
    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

    const result = await isAdmin(req as NextApiRequest, res as NextApiResponse);
    expect(result).toBe(false);
  });

  it('should return false if user role is not ADMIN', async () => {
    const user = { id: '123' };
    const userData = { role: 'USER' };
    const mockSupabase = createMockSupabaseClient(user, userData, null);
    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

    const result = await isAdmin(req as NextApiRequest, res as NextApiResponse);
    expect(result).toBe(false);
  });

  it('should return true if user role is ADMIN', async () => {
    const user = { id: '123' };
    const userData = { role: 'ADMIN' };
    const mockSupabase = createMockSupabaseClient(user, userData, null);
    (createServerClient as jest.Mock).mockReturnValue(mockSupabase);

    const result = await isAdmin(req as NextApiRequest, res as NextApiResponse);
    expect(result).toBe(true);
  });
});