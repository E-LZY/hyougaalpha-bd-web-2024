import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'post.json');
    
    // Read existing data
    const fileContent = await fs.readFile(filePath, 'utf8');
    const jsonData = JSON.parse(fileContent);
    
    // Add new wish to the beginning of the data array
    const newWish = req.body;
    jsonData.data = [newWish, ...jsonData.data];
    jsonData.total += 1;
    
    // Write updated data back to file
    await fs.writeFile(filePath, JSON.stringify(jsonData, null, 2));
    
    res.status(200).json({ message: 'Wish saved successfully' });
  } catch (error) {
    console.error('Error saving wish:', error);
    res.status(500).json({ message: 'Error saving wish' });
  }
}
