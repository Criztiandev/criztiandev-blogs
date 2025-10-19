const fs = require('fs');
const path = require('path');

// Get title from command line arguments
const title = process.argv[2];

if (!title) {
  console.error('❌ Error: Blog title is required');
  console.log('Usage: npm run new-blog "Your Blog Title"');
  process.exit(1);
}

// Generate slug from title
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

// Get current date in YYYY-MM-DD format
const date = new Date().toISOString().split('T')[0];

// Blog template
const template = `---
title: "${title}"
slug: "${slug}"
date: "${date}"
description: ""
image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&auto=format&fit=crop"
tags: []
author: "Criztiandev"
---

# ${title}

Write your content here...
`;

// File path
const filePath = path.join(process.cwd(), 'content', 'blogs', `${slug}.md`);

// Check if file already exists
if (fs.existsSync(filePath)) {
  console.error(`❌ Error: Blog with slug "${slug}" already exists`);
  console.log(`File: ${filePath}`);
  process.exit(1);
}

// Write the file
try {
  fs.writeFileSync(filePath, template, 'utf-8');
  console.log('✅ Blog post created successfully!');
  console.log(`📄 File: ${filePath}`);
  console.log(`📝 Slug: ${slug}`);
  console.log('\nNext steps:');
  console.log('1. Open the file and add your content');
  console.log('2. Update the description and tags in the frontmatter');
  console.log('3. Optionally update the image URL');
} catch (error) {
  console.error('❌ Error creating blog post:', error.message);
  process.exit(1);
}
