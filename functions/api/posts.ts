import { KVNamespace } from '@cloudflare/workers-types';

interface Env {
  hyougahbd: KVNamespace;
}

interface PostsData {
  data: any[];
  total: number;
}

const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

export const onRequest = async (context: { env: Env; request: Request }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Check KV binding
  if (!context.env?.hyougahbd) {
    console.error('hyougahbd binding is not configured');
    return new Response(JSON.stringify({
      error: 'Server configuration error',
      details: 'KV binding is not configured'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders
      }
    });
  }

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (context.request.method === 'GET') {
    try {
      console.log('Attempting to fetch posts from KV');
      const kvPosts = await context.env.hyougahbd.get('all_posts', { type: 'json' }) as PostsData;
      console.log('KV response:', kvPosts);

      if (!kvPosts) {
        console.log('No existing posts found, returning empty array');
        return new Response(JSON.stringify({ data: [], total: 0 }), {
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      return new Response(JSON.stringify(kvPosts), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      console.error('GET request error:', error);
      return new Response(JSON.stringify({
        error: 'Failed to fetch posts',
        details: getErrorMessage(error)
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }

  if (context.request.method === 'POST') {
    try {
      const newPost = await context.request.json();
      console.log('Received new post:', newPost);

      // Debug KV binding
      console.log('KV binding status:', {
        exists: !!context.env?.hyougahbd,
        type: typeof context.env?.hyougahbd
      });

      const existingPostsRaw = await context.env.hyougahbd.get('all_posts');
      console.log('Raw KV response:', existingPostsRaw);

      let existingPosts: PostsData;
      try {
        existingPosts = existingPostsRaw ? JSON.parse(existingPostsRaw) : { data: [], total: 0 };
      } catch (parseError) {
        console.error('Error parsing existing posts:', parseError);
        existingPosts = { data: [], total: 0 };
      }

      console.log('Current posts state:', existingPosts);

      existingPosts.data.unshift(newPost);
      existingPosts.total = existingPosts.data.length;

      console.log('Attempting to write updated posts:', existingPosts);

      try {
        await context.env.hyougahbd.put('all_posts', JSON.stringify(existingPosts));
        console.log('KV write successful');
      } catch (kvError) {
        console.error('KV write error:', kvError);
        throw new Error(`KV write failed: ${getErrorMessage(kvError)}`);
      }

      return new Response(JSON.stringify({
        message: 'Post created successfully',
        postCount: existingPosts.total
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      console.error('POST request error:', error);
      return new Response(JSON.stringify({
        error: 'Failed to create post',
        details: getErrorMessage(error)
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }

  return new Response('Method not allowed', {
    status: 405,
    headers: corsHeaders
  });
};
