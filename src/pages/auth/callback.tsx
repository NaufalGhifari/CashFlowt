import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supaBaseClient';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Parse the URL and update the Supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/dashboard');
      }
    });
  }, []);

  return <p>Loading...</p>;
}
