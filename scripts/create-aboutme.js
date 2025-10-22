const fs = require("fs");
const path = require("path");

// Get title from command line arguments
const title = process.argv[2];

if (!title) {
  console.error("❌ Error: About Me title is required");
  console.log('Usage: npm run new-aboutme "Your Card Title"');
  process.exit(1);
}

// Generate slug from title
const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

// About Me template
const template = `---
title: "${title}"
slug: "${slug}"
description: "Add a short one-line description here"
image: ""
---

Write your markdown content here. This will be displayed when the card is expanded.

You can use:
- **Bold text**
- *Italic text*
- Bullet lists
- Numbered lists
- Headers (##, ###)
- Links and more

The content can be as short or as long as you need. The card will automatically show a collapse/expand button.
`;

// File path
const filePath = path.join(process.cwd(), "content", "aboutme", `${slug}.md`);

// Check if file already exists
if (fs.existsSync(filePath)) {
  console.error(`❌ Error: About Me card with slug "${slug}" already exists`);
  console.log(`File: ${filePath}`);
  process.exit(1);
}

// Write the file
try {
  fs.writeFileSync(filePath, template, "utf-8");
  console.log("✅ About Me card created successfully!");
  console.log(`📄 File: ${filePath}`);
  console.log(`📝 Slug: ${slug}`);
  console.log("\nNext steps:");
  console.log("1. Open the file and add your markdown content below the frontmatter");
  console.log("2. Update the description with a one-line summary");
  console.log('3. Optionally add an image URL (image: "https://...")');
  console.log("4. Card will appear in /about page as a draggable, expandable card");
} catch (error) {
  console.error("❌ Error creating about me card:", error.message);
  process.exit(1);
}
