# AI Development Instructions

This document provides essential context for AI agents working in this Angular 20 codebase.

## Project Overview

This is a prompt management application built with Angular 20, featuring:
- CRUD operations for prompts using an in-memory web API
- Material Design components
- Advanced performance monitoring
- Reactive forms
- Component-based architecture

## Key Architecture Patterns

### Data Model
- Primary data model is `Prompt` (see `src/app/models/prompt.model.ts`)
- Each prompt has: id, title, prompt text, description, tags, category, language, and author

### Services Layer
1. **PromptService** (`services/prompt.service.ts`):
   - Handles all CRUD operations for prompts
   - Uses Angular's HttpClient with in-memory web API
   - All methods return Observables with proper error handling

2. **PerformanceService** (`services/performance.service.ts`):
   - Implements advanced performance monitoring
   - Tracks metrics like First Paint, First Contentful Paint, etc.
   - Use this service for any performance-related tracking

### Components
- Components follow a feature-based organization in `src/app/components/`
- All components use OnPush change detection strategy
- Material Design components are used for UI elements

## Development Workflows

### Setting Up
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   ng serve
   ```

### Key Commands
- `ng generate component components/[name]` for new components
- `ng build` for production build
- `ng test` for unit tests via Karma

## Project Conventions

### Performance Optimizations
- Implement TrackBy functions for all ngFor loops
- Use OnPush change detection
- Lazy load all routes
- Implement proper unsubscribe patterns for observables

### Error Handling
- All service methods include error handling through RxJS catchError operator
- Use the handleError pattern from PromptService for consistency

### State Management
- Currently using service-based state management
- All state updates should be done through services
- Components should not modify state directly

## Integration Points
- In-memory Web API simulates a backend server
- Material Design components for UI
- Performance monitoring integration through PerformanceService

## File Structure
```
src/app/
├── components/     # Feature components
├── models/        # Data models
├── services/      # Business logic and data access
└── app.module.ts  # Main application module
```

Need help? Check:
- `services/performance.service.ts` for performance monitoring patterns
- `services/prompt.service.ts` for data access patterns
- `components/prompt-form` for form handling patterns