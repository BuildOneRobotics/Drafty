# Drafty Templates

## Overview
Drafty now includes a comprehensive template system that helps you quickly create notes, notebooks, and files with pre-formatted content.

## Features

### Template Selection Modal
When creating a new note, notebook, or file, you'll see a beautiful template selector with:
- **Visual cards** with icons and descriptions
- **Multiple template options** for different use cases
- **One-click selection** to apply templates
- **Responsive design** that works on all devices

## Available Templates

### Note Templates

#### 📄 Blank Note
- Empty note for complete customization
- Perfect for free-form writing

#### 📝 Meeting Notes
- Pre-formatted for meeting documentation
- Includes sections for:
  - Date and attendees
  - Agenda items
  - Discussion points
  - Action items
  - Next steps

#### ✅ To-Do List
- Organized task management
- Sections for:
  - Priority tasks
  - Today's tasks
  - This week's tasks
  - Completed items

#### 📔 Daily Journal
- Daily reflection template
- Includes:
  - Mood tracking
  - Today's highlights
  - Challenges faced
  - Gratitude section
  - Tomorrow's goals

#### 🎯 Project Plan
- Comprehensive project planning
- Sections for:
  - Project objectives
  - Milestones
  - Resources needed
  - Risk assessment

#### 💡 Brainstorming
- Capture creative ideas
- Organized sections for:
  - Topic and date
  - All ideas
  - Best ideas
  - Next actions

### Notebook Templates

#### 📓 Blank Notebook
- Empty notebook for any purpose
- Fully customizable

#### 🎓 Course Notes
- Perfect for students
- Includes:
  - Lecture date and topic
  - Key concepts
  - Important points
  - Questions section

#### 🔬 Research Notebook
- Scientific research documentation
- Sections for:
  - Research question
  - Hypothesis
  - Methodology
  - Findings
  - Sources

#### 👨‍🍳 Recipe Book
- Culinary collection
- Formatted for:
  - Servings and timing
  - Ingredients list
  - Step-by-step instructions
  - Notes section

#### ✈️ Travel Journal
- Document your adventures
- Includes:
  - Destination and date
  - Places visited
  - Highlights
  - Food recommendations
  - Travel tips

### File Templates

#### 📄 Blank File
- Empty file for any purpose

#### 📝 Document
- Standard document template

#### 📊 Spreadsheet
- Data and calculations template

#### 📽️ Presentation
- Slides and visuals template

## How to Use Templates

### Creating a Note with Template
1. Click **"+ New Note"** button
2. **Template selector appears** with all available options
3. **Click on a template** to select it
4. **Enter note title** (pre-filled with template name)
5. **Click "Create"** to create note with template content
6. **Start editing** - template content is already loaded

### Creating a Notebook with Template
1. Click **"+ New Notebook"** button
2. **Choose from notebook templates**
3. **Name your notebook** (defaults to template name)
4. **Click "Create"**
5. **First page contains template content**
6. **Add more pages** as needed

### Creating a File with Template
1. Click **"+ New File"** button
2. **Select file template**
3. **Name your file**
4. **Click "Create"**
5. **File is created** with template type

## Template Content

### HTML Formatting
Templates use HTML formatting for rich content:
- **Headings** (`<h2>`, `<h3>`)
- **Bold text** (`<strong>`)
- **Lists** (`<ul>`, `<ol>`, `<li>`)
- **Paragraphs** (`<p>`)

### Dynamic Content
Some templates include dynamic content:
- **Current date** automatically inserted
- **Placeholder text** for easy customization
- **Structured sections** for organization

## Customization

### Editing Template Content
After creating from a template:
1. **All content is editable** using the rich text editor
2. **Add or remove sections** as needed
3. **Format text** with toolbar options
4. **Auto-saves** as you type

### Creating Your Own Templates
To add custom templates, edit `lib/templates.ts`:

```typescript
{
  id: 'custom',
  name: 'Custom Template',
  description: 'Your custom template',
  icon: '🎨',
  content: `<h2>Your Content</h2>
<p>Template content here...</p>`
}
```

## Benefits

### Time Saving
- **No need to recreate** common structures
- **Pre-formatted content** ready to use
- **Consistent formatting** across documents

### Organization
- **Structured sections** keep content organized
- **Clear headings** for easy navigation
- **Logical flow** built into templates

### Productivity
- **Quick start** for new documents
- **Focus on content** not formatting
- **Professional appearance** from the start

## Technical Details

### Template Structure
```typescript
interface Template {
  id: string          // Unique identifier
  name: string        // Display name
  description: string // Short description
  icon: string        // Emoji icon
  content: string     // HTML content
}
```

### Storage
- Templates defined in `lib/templates.ts`
- Content stored as HTML strings
- Applied when creating new items

### Components
- **TemplateSelector**: Modal for choosing templates
- **Template arrays**: noteTemplates, notebookTemplates, fileTemplates
- **Integration**: Built into NotesManager, NotebookManager, FileManager

## Mobile Experience

### Responsive Design
- **Full-screen modal** on mobile
- **Touch-friendly cards** for easy selection
- **Scrollable grid** for all templates
- **Large tap targets** for accessibility

### Performance
- **Instant loading** of template selector
- **Smooth animations** for modal
- **No lag** when applying templates

## Future Enhancements

### Potential Features
1. **User-created templates** saved to account
2. **Template categories** for better organization
3. **Template preview** before selection
4. **Template sharing** with other users
5. **Template marketplace** for community templates
6. **Import/export** templates
7. **Template variables** for dynamic content
8. **Template versioning** for updates

## Examples

### Meeting Notes Template
```html
<h2>Meeting Notes</h2>
<p><strong>Date:</strong> 12/7/2025</p>
<p><strong>Attendees:</strong> </p>
<p><strong>Agenda:</strong></p>
<ul>
  <li></li>
</ul>
```

### To-Do List Template
```html
<h2>To-Do List</h2>
<p><strong>Priority Tasks:</strong></p>
<ul>
  <li>☐ </li>
</ul>
```

### Recipe Template
```html
<h2>Recipe</h2>
<p><strong>Servings:</strong> </p>
<p><strong>Ingredients:</strong></p>
<ul>
  <li></li>
</ul>
```

## Tips

### Best Practices
1. **Choose the right template** for your needs
2. **Customize immediately** after creation
3. **Remove unused sections** to keep it clean
4. **Add your own sections** as needed
5. **Use consistent formatting** across similar documents

### Keyboard Shortcuts
- **Enter** to create after naming
- **Escape** to cancel template selection
- **Tab** to navigate between fields

## Support

### Common Issues

**Template not appearing?**
- Refresh the page
- Check browser console for errors
- Verify templates.ts is loaded

**Content not formatted?**
- Rich text editor should render HTML
- Check if contentEditable is working
- Try different browser

**Can't edit template content?**
- Click in the editor area
- Ensure editor is not read-only
- Check for JavaScript errors

## Summary

The template system makes creating new content in Drafty faster and more organized. With 6 note templates, 5 notebook templates, and 4 file templates, you have a variety of options for different use cases. The beautiful modal interface makes selection easy, and the pre-formatted content helps you get started quickly.
