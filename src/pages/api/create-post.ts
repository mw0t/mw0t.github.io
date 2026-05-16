import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

export const POST: APIRoute = async ({ request, redirect }) => {
  const formData = await request.formData();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const tags = formData.get('tags') as string;
  const content = formData.get('content') as string;

  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  const today = new Date().toISOString().split('T')[0];
  const tagsArray = tags.split(',').map(t => `"${t.trim()}"`).join(', ');

  const markdown = `---
title: "${title}"
description: "${description}"
publishDate: "${today}"
tags: [${tagsArray}]
---

${content}`;

  const filePath = path.join(process.cwd(), 'src', 'content', 'post', `${slug}.md`);
  await fs.writeFile(filePath, markdown);

  return redirect('/blog', 302);
};