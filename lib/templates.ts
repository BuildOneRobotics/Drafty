// Template definitions for notes, notebooks, and files

export interface Template {
  id: string
  name: string
  description: string
  icon: string
  content: string
}

export const noteTemplates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Note',
    description: 'Start with an empty note',
    icon: '📄',
    content: ''
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    description: 'Template for meeting notes',
    icon: '📝',
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
</ul>`
  },
  {
    id: 'todo',
    name: 'To-Do List',
    description: 'Organize your tasks',
    icon: '✅',
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
</ul>`
  },
  {
    id: 'journal',
    name: 'Daily Journal',
    description: 'Daily reflection and thoughts',
    icon: '📔',
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
</ul>`
  },
  {
    id: 'project',
    name: 'Project Plan',
    description: 'Plan and track projects',
    icon: '🎯',
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
</ul>`
  },
  {
    id: 'brainstorm',
    name: 'Brainstorming',
    description: 'Capture ideas and thoughts',
    icon: '💡',
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
</ul>`
  }
]

export const notebookTemplates: Template[] = [
  {
    id: 'blank',
    name: 'Blank Notebook',
    description: 'Empty notebook to customize',
    icon: '📓',
    content: ''
  },
  {
    id: 'course',
    name: 'Course Notes',
    description: 'Organize class notes',
    icon: '🎓',
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
</ul>`
  },
  {
    id: 'research',
    name: 'Research Notebook',
    description: 'Document research findings',
    icon: '🔬',
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
</ol>`
  },
  {
    id: 'recipe',
    name: 'Recipe Book',
    description: 'Collection of recipes',
    icon: '👨‍🍳',
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
<p></p>`
  },
  {
    id: 'travel',
    name: 'Travel Journal',
    description: 'Document your travels',
    icon: '✈️',
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
</ul>`
  }
]

export const fileTemplates: Template[] = [
  {
    id: 'blank',
    name: 'Blank File',
    description: 'Empty file',
    icon: '📄',
    content: ''
  },
  {
    id: 'document',
    name: 'Document',
    description: 'Standard document',
    icon: '📝',
    content: ''
  },
  {
    id: 'spreadsheet',
    name: 'Spreadsheet',
    description: 'Data and calculations',
    icon: '📊',
    content: ''
  },
  {
    id: 'presentation',
    name: 'Presentation',
    description: 'Slides and visuals',
    icon: '📽️',
    content: ''
  }
]
