// Path: functions/api/posts.ts

import { KVNamespace } from '@cloudflare/workers-types';

interface Env {
  POSTS_KV: KVNamespace;
}

interface PostsData {
  data: any[];
  total: number;
}

export async function onRequest(context: { env: Env; request: Request }) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle OPTIONS request
  if (context.request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Handle GET request
  if (context.request.method === 'GET') {
    try {
      const kvPosts = await context.env.POSTS_KV.get('all_posts', { type: 'json' }) as PostsData || { data: [], total: 0 };
      return new Response(JSON.stringify(kvPosts), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }

  // Handle POST request
  if (context.request.method === 'POST') {
    try {
      const newPost = await context.request.json();
      const existingPosts = await context.env.POSTS_KV.get('all_posts', { type: 'json' }) as PostsData || { data: [], total: 0 };
      
      existingPosts.data.unshift(newPost);
      existingPosts.total = existingPosts.data.length;

      await context.env.POSTS_KV.put('all_posts', JSON.stringify(existingPosts));

      return new Response(JSON.stringify({ message: 'Post created successfully' }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Failed to create post' }), {
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
}
