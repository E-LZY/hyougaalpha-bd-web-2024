import { NextApiRequest, NextApiResponse } from 'next';
import type { KVNamespace } from '@cloudflare/workers-types';

interface PostsData {
  data: any[];
  total: number;
}

// Declare the binding for TypeScript
declare global {
  interface Window {
    POSTS_KV: KVNamespace;
  }
}

declare const POSTS_KV: KVNamespace;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Handle GET request - fetch posts
  if (req.method === 'GET') {
    try {
      // Get all posts from KV
      const kvPosts = await POSTS_KV.get('all_posts', { type: 'json' }) as PostsData || { data: [], total: 0 };
      return res.status(200).json(kvPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.status(500).json({ error: 'Failed to fetch posts' });
    }
  }

  // Handle POST request - create new post
  if (req.method === 'POST') {
    try {
      // Get existing posts
      const existingPosts = await POSTS_KV.get('all_posts', { type: 'json' }) as PostsData || { data: [], total: 0 };
      
      // Add new post to the beginning of the array
      const newPost = req.body;
      existingPosts.data.unshift(newPost);
      existingPosts.total = existingPosts.data.length;

      // Save updated posts back to KV
      await POSTS_KV.put('all_posts', JSON.stringify(existingPosts));

      return res.status(200).json({ message: 'Post created successfully' });
    } catch (error) {
      console.error('Error creating post:', error);
      return res.status(500).json({ error: 'Failed to create post' });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({ error: 'Method not allowed' });
}
