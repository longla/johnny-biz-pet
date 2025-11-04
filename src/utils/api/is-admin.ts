import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextApiRequest, type NextApiResponse } from 'next'

export async function isAdmin(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies[name]
        },
        set(name: string, value: string, options: CookieOptions) {
            // The `set` method is not needed for API routes.
        },
        remove(name: string, options: CookieOptions) {
            // The `remove` method is not needed for API routes.
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const { data: userData, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (error || !userData) {
    return false
  }

  return userData.role === 'ADMIN'
}
