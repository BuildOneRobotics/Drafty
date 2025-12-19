// Template definitions for notes, notebooks, and files

export interface Template {
  id: string
  name: string
  description: string
  icon: string  // Icon component name as string
  content: string
  preview?: string
  category?: string
}

export const noteTemplates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Note',
    description: 'Start with an empty note',
    icon: 'BlankNoteIcon',
    content: '',
    preview: '<p>Empty canvas for your thoughts</p>',
    category: 'general'
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'Structured template for meeting documentation',
    icon: 'MeetingIcon',
    content: `<h2>Meeting Notes</h2>
<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>Attendees:</strong> </p>
<p><strong>Agenda:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Discussion Points:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Action Items:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Next Steps:</strong></p>
<ul>
  <li></li>
</ul>`,
    preview: `<div style="font-size: 0.75rem;"><strong>Date:</strong> Today<br/><strong>Attendees:</strong> Team<br/><strong>Action Items:</strong><ul style="margin: 4px 0;"><li>Track decisions</li></ul></div>`,
    category: 'work'
  },
  {
    id: 'todo',
    name: 'To-Do List',
    description: 'Organize and prioritize your tasks',
    icon: 'TodoIcon',
    content: `<h2>To-Do List</h2>
<p><strong>Priority Tasks:</strong></p>
<ul>
  <li>☐ </li>
</ul>
<p><strong>Today:</strong></p>
<ul>
  <li>☐ </li>
</ul>
<p><strong>This Week:</strong></p>
<ul>
  <li>☐ </li>
</ul>
<p><strong>Completed:</strong></p>
<ul>
  <li>✓ </li>
</ul>`,
    preview: `<div style="font-size: 0.75rem;"><strong>Priority</strong><ul style="margin: 4px 0;"><li>☐ Important task</li></ul><strong>Today</strong><ul style="margin: 4px 0;"><li>☐ Quick task</li></ul></div>`,
    category: 'productivity'
  },
  {
    id: 'journal',
    name: 'Daily Journal',
    description: 'Daily reflection and gratitude practice',
    icon: 'JournalIcon',
    content: `<h2>Daily Journal - ${new Date().toLocaleDateString()}</h2>
<p><strong>Mood:</strong> </p>
<p><strong>Today's Highlights:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Challenges:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Grateful For:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Tomorrow's Goals:</strong></p>
<ul>
  <li></li>
</ul>`,
    preview: `<div style="font-size: 0.75rem;"><strong>Mood:</strong> 😊<br/><strong>Highlights:</strong><ul style="margin: 4px 0;"><li>Reflect daily</li></ul><strong>Grateful:</strong><ul style="margin: 4px 0;"><li>Count blessings</li></ul></div>`,
    category: 'personal'
  },
  {
    id: 'project',
    name: 'Project Plan',
    description: 'Comprehensive project planning and tracking',
    icon: 'ProjectIcon',
    content: `<h2>Project Plan</h2>
<p><strong>Project Name:</strong> </p>
<p><strong>Start Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>Deadline:</strong> </p>
<p><strong>Objectives:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Milestones:</strong></p>
<ol>
  <li></li>
</ol>
<p><strong>Resources Needed:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Risks:</strong></p>
<ul>
  <li></li>
</ul>`,
    preview: `<div style="font-size: 0.75rem;"><strong>Objectives</strong><ul style="margin: 4px 0;"><li>Define goals</li></ul><strong>Milestones</strong><ol style="margin: 4px 0;"><li>Track progress</li></ol></div>`,
    category: 'work'
  },
  {
    id: 'brainstorm',
    name: 'Brainstorming',
    description: 'Capture creative ideas and insights',
    icon: 'BrainstormIcon',
    content: `<h2>Brainstorming Session</h2>
<p><strong>Topic:</strong> </p>
<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>Ideas:</strong></p>
<ul>
  <li></li>
  <li></li>
  <li></li>
</ul>
<p><strong>Best Ideas:</strong></p>
<ol>
  <li></li>
</ol>
<p><strong>Next Actions:</strong></p>
<ul>
  <li></li>
</ul>`,
    preview: `<div style="font-size: 0.75rem;"><strong>Topic:</strong> Innovation<br/><strong>Ideas:</strong><ul style="margin: 4px 0;"><li>Capture everything</li><li>No judgment</li></ul></div>`,
    category: 'creative'
  },
  {
    id: 'code',
    name: 'Code Notes',
    description: 'Document code snippets and technical notes',
    icon: 'CodeIcon',
    content: `<h2>Code Notes</h2>
<p><strong>Language:</strong> </p>
<p><strong>Purpose:</strong> </p>
<p><strong>Code:</strong></p>
<pre><code>// Your code here</code></pre>
<p><strong>Explanation:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Usage:</strong></p>
<ul>
  <li></li>
</ul>`,
    preview: `<div style="font-size: 0.75rem;"><strong>Language:</strong> JavaScript<br/><pre style="margin: 4px 0; padding: 4px; background: #f5f5f5; border-radius: 4px;"><code>// Code here</code></pre></div>`,
    category: 'technical'
  },
  {
    id: 'study',
    name: 'Study Notes',
    description: 'Structured learning and revision notes',
    icon: 'StudyIcon',
    content: `<h2>Study Notes</h2>
<p><strong>Subject:</strong> </p>
<p><strong>Chapter/Topic:</strong> </p>
<p><strong>Key Concepts:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Definitions:</strong></p>
<ul>
  <li><strong>Term:</strong> Definition</li>
</ul>
<p><strong>Examples:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Questions to Review:</strong></p>
<ul>
  <li></li>
</ul>`,
    preview: `<div style="font-size: 0.75rem;"><strong>Subject:</strong> Mathematics<br/><strong>Key Concepts:</strong><ul style="margin: 4px 0;"><li>Main ideas</li></ul><strong>Review:</strong><ul style="margin: 4px 0;"><li>Practice problems</li></ul></div>`,
    category: 'education'
  }
]

export const notebookTemplates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Notebook',
    description: 'Empty notebook to customize',
    icon: 'BookIcon',
    content: '',
    preview: '<p>Create your own structure</p>',
    category: 'general'
  },
  {
    id: 'course',
    name: 'Course Notes',
    description: 'Organize class notes and lectures',
    icon: 'CourseIcon',
    content: `<h2>Lecture Notes</h2>
<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>Topic:</strong> </p>
<p><strong>Key Concepts:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Important Points:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Questions:</strong></p>
<ul>
  <li></li>
</ul>`,
    preview: `<div style="font-size: 0.75rem;"><strong>Topic:</strong> Chapter 1<br/><strong>Key Concepts:</strong><ul style="margin: 4px 0;"><li>Main ideas</li></ul></div>`,
    category: 'education'
  },
  {
    id: 'research',
    name: 'Research Notebook',
    description: 'Document research findings and methodology',
    icon: 'ResearchIcon',
    content: `<h2>Research Notes</h2>
<p><strong>Research Question:</strong> </p>
<p><strong>Hypothesis:</strong> </p>
<p><strong>Methodology:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Findings:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Sources:</strong></p>
<ol>
  <li></li>
</ol>`,
    preview: `<div style="font-size: 0.75rem;"><strong>Question:</strong> What?<br/><strong>Hypothesis:</strong> Theory<br/><strong>Findings:</strong><ul style="margin: 4px 0;"><li>Data</li></ul></div>`,
    category: 'academic'
  },
  {
    id: 'recipe',
    name: 'Recipe Book',
    description: 'Collection of favorite recipes',
    icon: 'RecipeIcon',
    content: `<h2>Recipe</h2>
<p><strong>Servings:</strong> </p>
<p><strong>Prep Time:</strong> </p>
<p><strong>Cook Time:</strong> </p>
<p><strong>Ingredients:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Instructions:</strong></p>
<ol>
  <li></li>
</ol>
<p><strong>Notes:</strong></p>
<p></p>`,
    preview: `<div style="font-size: 0.75rem;"><strong>Servings:</strong> 4<br/><strong>Time:</strong> 30 min<br/><strong>Ingredients:</strong><ul style="margin: 4px 0;"><li>List items</li></ul></div>`,
    category: 'lifestyle'
  },
  {
    id: 'travel',
    name: 'Travel Journal',
    description: 'Document adventures and travel experiences',
    icon: 'TravelIcon',
    content: `<h2>Travel Log</h2>
<p><strong>Destination:</strong> </p>
<p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
<p><strong>Places Visited:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Highlights:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Food & Restaurants:</strong></p>
<ul>
  <li></li>
</ul>
<p><strong>Tips for Next Time:</strong></p>
<ul>
  <li></li>
</ul>`,
    preview: `<div style="font-size: 0.75rem;"><strong>Destination:</strong> Paris<br/><strong>Highlights:</strong><ul style="margin: 4px 0;"><li>Amazing sights</li></ul></div>`,
    category: 'lifestyle'
  }
]

export const fileTemplates: Template[] = [
  {
    id: 'blank',
    name: 'Blank File',
    description: 'Empty file',
    icon: 'BlankNoteIcon',
    content: '',
    preview: '<p>Start from scratch</p>',
    category: 'general'
  },
  {
    id: 'document',
    name: 'Document',
    description: 'Standard document',
    icon: 'DocumentIcon',
    content: '',
    preview: '<p>Text document</p>',
    category: 'general'
  },
  {
    id: 'spreadsheet',
    name: 'Spreadsheet',
    description: 'Data and calculations',
    icon: 'SpreadsheetIcon',
    content: '',
    preview: '<p>Tables & data</p>',
    category: 'work'
  },
  {
    id: 'presentation',
    name: 'Presentation',
    description: 'Slides and visuals',
    icon: 'PresentationIcon',
    content: '',
    preview: '<p>Slide deck</p>',
    category: 'work'
  }
]
