# File Management Rules

## File Operations
- All files should have a three vertical dot menu (⋮) that provides:
  - Delete option (with confirmation)
  - Rename option (inline editing)
  - Move option (to different folders)

## UI Guidelines
- Use consistent styling with the existing design system
- Maintain the current color scheme with CSS variables
- Ensure mobile responsiveness
- Provide visual feedback for all operations

## Data Persistence
- Save all file operations to localStorage with user-specific keys
- Sync changes with the backend when available
- Handle errors gracefully with user feedback

## Accessibility
- Ensure keyboard navigation support
- Provide proper ARIA labels
- Use semantic HTML elements