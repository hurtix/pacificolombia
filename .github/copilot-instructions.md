- [x] Verify that the copilot-instructions.md file in the .github directory is created.

- [x] Clarify Project Requirements

- [x] Scaffold the Project

- [x] Customize the Project

- [x] Install Required Extensions

- [x] Compile the Project

- [x] Create and Run Task

- [x] Launch the Project

- [x] Ensure Documentation is Complete

## Project: Destino Pacífico

This is an Astro project with Tailwind CSS for promoting tourism in the Colombian Pacific. The site consumes dynamic content from a local WordPress installation with ACF (Advanced Custom Fields) custom fields.

### Technologies Used
- **Astro** - Ultra-fast web framework for static sites
- **Tailwind CSS** - Highly customizable utility-first CSS framework  
- **WordPress Integration** - Consumes data from WordPress REST API
- **TypeScript** - Type safety and better developer experience

### Key Features
- Responsive design for all devices
- Dynamic content from WordPress with fallback content
- ACF field support for custom content management
- Performance optimized static site generation
- SEO friendly with proper meta tags

### Development Setup
1. Ensure WordPress local installation is running
2. Update `src/lib/wordpress.ts` with your Local by Flywheel URL
3. Run `npm run dev` to start development server
4. Access site at http://localhost:4321

### WordPress Configuration
- Install and activate Advanced Custom Fields plugin
- Configure ACF fields for hero sections and content
- Ensure REST API is enabled (default in WordPress)

### Project Structure
- `src/layouts/` - Page layouts
- `src/components/` - Reusable Astro components  
- `src/lib/` - WordPress API utilities
- `src/pages/` - Site pages and routes
- `src/styles/` - Global styles with Tailwind

### Tasks Available
- **Start Dev Server** - Launches Astro development server with hot reload