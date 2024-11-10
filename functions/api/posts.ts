import { KVNamespace } from '@cloudflare/workers-types';

interface Env {
  POSTS_KV: KVNamespace;
}

interface PostsData {
  data: any[];
  total: number;
}

export const onRequest = async (context: { env: Env; request: Request }) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (context.request.method === 'GET') {
    try {
      const kvPosts = await context.env.POSTS_KV.get('all_posts', { type: 'json' }) as PostsData;
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
      return new Response(JSON.stringify({ error: 'Failed to fetch posts', details: error.message }), {
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
      // Log the incoming request body
      const newPost = await context.request.json();
      console.log('Received new post:', newPost);

      // Fetch existing posts with logging
      const existingPostsRaw = await context.env.POSTS_KV.get('all_posts');
      console.log('Raw KV response:', existingPostsRaw);

      let existingPosts: PostsData;
      try {
        existingPosts = existingPostsRaw ? JSON.parse(existingPostsRaw) : { data: [], total: 0 };
      } catch (parseError) {
        console.error('Error parsing existing posts:', parseError);
        existingPosts = { data: [], total: 0 };
      }

      // Log the current state
      console.log('Current posts state:', existingPosts);

      // Update posts
      existingPosts.data.unshift(newPost);
      existingPosts.total = existingPosts.data.length;

      // Log the update operation
      console.log('Attempting to write updated posts:', existingPosts);

      // Perform the KV write with explicit error handling
      try {
        await context.env.POSTS_KV.put('all_posts', JSON.stringify(existingPosts));
        console.log('KV write successful');
      } catch (kvError) {
        console.error('KV write error:', kvError);
        throw new Error(`KV write failed: ${kvError.message}`);
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
        details: error.message 
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
