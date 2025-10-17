# Copilot Instructions for Copilot Prompter Project

## 🏗️ Project Architecture

This is an Angular application (v20.0.0, zoneless) with a Spring Boot backend, designed to help developers create and manage AI coding instructions. The application follows strict UI consistency and performance optimization patterns.

### Project Structure
```
copilot-prompter/
├── src/                            # Frontend source code
│   ├── app/
│   │   ├── components/            # Feature components
│   │   │   ├── code-editor/
│   │   │   ├── template-builder/
│   │   │   ├── prompt-list/
│   │   │   └── ...
│   │   ├── services/             # Application services
│   │   ├── models/               # TypeScript interfaces
│   │   └── app-routing.module.ts
│   ├── assets/                    # Static assets
│   └── styles/                    # Global styles
├── backend/                       # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/copilotprompter/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── README.md
├── data/                         # Application data
├── dist/                        # Build output
└── node_modules/                # Dependencies
```

### UI/UX Standards
- All components must use Angular Material for consistent look and feel
- Follow existing component styling patterns in `src/styles.scss`
- Use shared color palette and typography defined in theme files
- Maintain responsive design patterns across all views
- Follow accessibility guidelines (WCAG 2.1)

### Angular 20 Zoneless Optimizations
- Use built-in signals for reactive state management
- Implement proper change detection strategies (OnPush by default)
- Utilize standalone components for better tree-shaking
- Take advantage of Angular 20's performance features:
  - Control flow syntax (`@if`, `@for`)
  - Deferred loading with `@defer`
  - View transitions API
  - Server-side rendering optimizations

### Key Components

- **Frontend (`/src/app/`):**
  - `/components/` - Angular components organized by feature
  - `/services/` - Data and state management services
  - `/models/` - TypeScript interfaces and data models
  - Core UX components: code-editor, template-builder, prompt-list
  - Route-based feature modules with lazy loading

- **Backend (`/backend/`):**
  - Spring Boot REST API
  - Data persistence and template management
  - Configuration profiles: dev, prod, test
  - API documentation via Swagger

## 🔄 Development Workflow

### Frontend Development
```bash
# Start development server
ng serve

# Run tests
ng test         # Unit tests with Jest
ng e2e          # E2E tests with Cypress
```

### Backend Development
```bash
# Start Spring Boot server
cd backend
mvn spring-boot:run
```

## 🎯 Project-Specific Patterns

1. **Component Structure**
   - Template components (`template-*.component.ts`) follow builder pattern
   - All components must be standalone and use OnPush change detection
   - Shared logic extracted to base classes or composable functions
   - Follow Material Design patterns and components
   - Use SCSS mixins from `src/styles/mixins/` for consistent styling

2. **Data Flow & State Management**
   - Services use signals for reactive state management
   - Components leverage computed signals and effects
   - Use async pipe with observables when needed
   - State managed via services (no global state management)
   - Implement proper input/output bindings

3. **Styling and Theming**
   - Follow BEM methodology for component styles
   - Use Angular Material theming system
   - Import shared mixins and variables
   - Example:
     ```scss
     @use '@angular/material' as mat;
     @import 'src/styles/variables';
     @import 'src/styles/mixins/components';
     
     .my-component {
       @include component-base();
       // Component specific styles
     }
     ```

4. **Testing Conventions**
   - Unit tests required for services and complex components
   - E2E tests focus on critical user workflows
   - Use testing utilities from `/src/test-helpers/`

## 🔌 Integration Points

### Frontend-Backend Communication
- REST API endpoints defined in `backend/src/main/java/com/copilotprompter/controllers/`
- Services in `/src/app/services/` handle all API calls
- Authentication via Spring Security

### External Dependencies
- Angular Material for UI components
- Monaco Editor for code editing
- Spring Boot for backend services

## 📝 Key Files and Directories

### Frontend
- `src/app/app-routing.module.ts` - Application routes
- `src/app/components/template-builder/` - Core template creation logic
- `src/styles/` - Global styles and theming
  - `_variables.scss` - Shared variables
  - `_mixins/` - SCSS mixins
  - `_themes/` - Material theme configurations
- `src/app/models/` - Shared interfaces and types
- `angular.json` - Angular workspace configuration
- `tsconfig.json` - TypeScript configuration

### Backend
- `backend/src/main/resources/`
  - `application.properties` - Default configuration
  - `application-dev.properties` - Development settings
  - `application-prod.properties` - Production settings
- `backend/src/main/java/com/copilotprompter/`
  - `controllers/` - REST API endpoints
  - `services/` - Business logic
  - `models/` - Domain models
- `backend/pom.xml` - Maven project configuration

### Development Tools
- `.vscode/` - VS Code workspace settings
- `package.json` - NPM dependencies and scripts
- `tsconfig.*.json` - TypeScript configs for different contexts

## 🚀 Common Tasks

### Adding New Components
1. Generate standalone component:
   ```bash
   cd /Users/shaleenkumar/Development/Codebase/UI/Angular/ng20/copilot-prompter/V3
   ng generate component components/new-feature --standalone
   ```
2. Add Material imports and apply theming:
   ```typescript
   // new-feature.component.ts
   import { CommonModule } from '@angular/common';
   import { MatButtonModule } from '@angular/material/button';
   // ... other Material imports

   @Component({
     standalone: true,
     imports: [CommonModule, MatButtonModule],
     ...
   })
   ```
3. Update routing in `src/app/app-routing.module.ts`
4. Create unit tests in `.spec.ts` file

### Modifying Templates
1. Locate template in `src/app/components/template-gallery/`
2. Follow BEM naming in SCSS:
   ```scss
   .template-item {
     &__header { }
     &__content { }
     &--active { }
   }
   ```
3. Update template metadata in `src/app/services/template.service.ts`
4. Run tests: `ng test`

### Backend Changes
1. Add endpoints in `backend/src/main/java/com/copilotprompter/controllers/`
2. Update Swagger docs in controller annotations
3. Add integration tests in `backend/src/test/`
4. Run backend tests:
   ```bash
   cd backend
   mvn test
   ```

## ⚠️ Common Pitfalls

1. Always inject services in constructor, not using properties
2. Use async pipe instead of manual subscription management
3. Keep template logic minimal - extract to components/services
4. Remember to update API documentation when modifying endpoints

Need help? Check `README.md` or consult the development team.