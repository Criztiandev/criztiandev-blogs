const fs = require("fs");
const path = require("path");

// Get title from command line arguments
const title = process.argv[2];

if (!title) {
  console.error("❌ Error: Project title is required");
  console.log('Usage: npm run new-project "Your Project Title"');
  process.exit(1);
}

// Generate slug from title
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

// Get current date in YYYY-MM-DD format
const date = new Date().toISOString().split("T")[0];

// Project template with MDX example
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

## Overview

Write your project overview here...

## Features

<TwoGrid>
<div>

### Feature 1
Description of feature 1

</div>
<div>

### Feature 2
Description of feature 2

</div>
</TwoGrid>

## Tech Stack

- Technology 1
- Technology 2
- Technology 3

## Conclusion

Wrap up your project description...
`;

// File path
const filePath = path.join(process.cwd(), "content", "projects", `${slug}.md`);

// Check if file already exists
if (fs.existsSync(filePath)) {
  console.error(`❌ Error: Project with slug "${slug}" already exists`);
  console.log(`File: ${filePath}`);
  process.exit(1);
}

// Write the file
try {
  fs.writeFileSync(filePath, template, "utf-8");
  console.log("✅ Project created successfully!");
  console.log(`📄 File: ${filePath}`);
  console.log(`📝 Slug: ${slug}`);
  console.log("\nNext steps:");
  console.log("1. Open the file and add your content");
  console.log("2. Update the description and tags in the frontmatter");
  console.log("3. Optionally update the image URL");
  console.log("4. Use <TwoGrid> component for side-by-side content");
} catch (error) {
  console.error("❌ Error creating project:", error.message);
  process.exit(1);
}
