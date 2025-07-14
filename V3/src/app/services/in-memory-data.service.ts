import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Prompt } from '../models/prompt.model';
import { CopilotTemplate } from '../models/copilot-template.model';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const prompts: Prompt[] = [
      // --- Common/General Dev Prompts ---
      {
        id: '1',
        title: 'Write REST API Integration Tests',
        prompt: `// 🧪 Write comprehensive REST API integration tests for the endpoints below.
// ✅ Checklist:
//   - Cover all major scenarios (success, error, edge cases)
//   - Test authentication/authorization if required
//   - Validate request/response schemas
//   - Simulate network failures and invalid payloads
//   - Assert correct status codes and error messages
//   - Clean up test data after each run
//
// Endpoints:
// {{api_endpoints}}
//
// Example (Jest + Supertest):
describe('API Integration', () => {
  it('should ...', async () => {
    // Arrange
    // Act
    // Assert
  });
});
//
// 💡 Tip: Use beforeAll/afterAll for setup/teardown, and mock external dependencies if needed.
`,
        description:
          'Generate robust, checklist-driven integration tests for REST APIs, including error handling and edge cases.',
        tags: [
          'api',
          'integration-test',
          'backend',
          'testing',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Backend',
        language: 'Any',
        author: 'api_tester',
      },
      {
        id: '2',
        title: 'Optimize SQL Query',
        prompt: `// 🛠️ Optimize the following SQL query for performance and readability.
// ✅ Checklist:
//   - Suggest index improvements
//   - Refactor for clarity and maintainability
//   - Remove unnecessary subqueries or joins
//   - Recommend query plan analysis if needed
//   - Ensure security (avoid SQL injection, use parameters)
//
// Query:
// \`\`\`sql
// {{sql_query}}
// \`\`\`
//
// 💡 Tip: Provide before/after query examples and explain each optimization step.
`,
        description:
          'Review and optimize SQL queries for speed, clarity, and security. Provide before/after examples and rationale.',
        tags: [
          'sql',
          'database',
          'optimization',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Database',
        language: 'SQL',
        author: 'db_admin',
      },
      {
        id: '3',
        title: 'Generate Dockerfile for Web App',
        prompt: `// 🐳 Generate a multi-stage Dockerfile for the following web application.
// ✅ Checklist:
//   - Use official base images
//   - Separate build and production stages
//   - Copy only necessary files
//   - Set secure permissions and environment variables
//   - Expose required ports
//   - Add healthcheck if applicable
//
// App Description:
// {{app_description}}
//
// 💡 Tip: Comment each stage and explain best practices used.
`,
        description:
          'Create a secure, production-ready Dockerfile for web apps using multi-stage builds and best practices.',
        tags: [
          'docker',
          'devops',
          'deployment',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Any',
        author: 'devops_guru',
      },
      {
        id: '4',
        title: 'Suggest Test Cases for a Feature',
        prompt: `// 🧪 Suggest comprehensive test cases for the feature below.
// ✅ Checklist:
//   - Cover all functional requirements
//   - Include edge cases and negative scenarios
//   - Address security and performance aspects
//   - Consider user roles and permissions
//   - List both manual and automated test ideas
//
// Feature:
// {{feature_description}}
//
// 💡 Tip: Output as a checklist or table for easy tracking.
`,
        description:
          'List detailed, categorized test cases for any feature, including edge, negative, and security scenarios.',
        tags: ['test-cases', 'testing', 'qa', 'checklist', 'copilot-optimized'],
        category: 'Testing',
        language: 'Any',
        author: 'qa_expert',
      },
      {
        id: '5',
        title: 'Refactor Code for Readability',
        prompt: `// 📝 Refactor the following code to improve readability, maintainability, and performance.
// ✅ Checklist:
//   - Apply consistent formatting and naming
//   - Remove dead code and redundant logic
//   - Add clear comments for complex sections
//   - Use best practices for the language/framework
//   - Ensure all tests still pass
//
// Code:
// \`\`\`{{language}}
// {{code_snippet}}
// \`\`\`
//
// 💡 Tip: Show before/after code and explain key improvements.
`,
        description:
          'Refactor code with clear comments, best practices, and before/after examples for maximum clarity.',
        tags: [
          'refactor',
          'code-review',
          'best-practices',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'Any',
        author: 'refactor_bot',
      },
      {
        id: '6',
        title: 'Generate a Professional GitHub README.md',
        prompt: `// 📄 Generate a professional README.md for a GitHub project.
// ✅ Checklist:
//   - Propose a table of contents first
//   - Include project summary and key features
//   - Add advanced techniques (with MDN links if not basic)
//   - Show directory structure with explanations
//   - Provide clear usage/setup steps
//   - Invite stars and feedback
//   - Use valid markdown, code blocks, and relative links
//
// Input: Code files and project description
//
// 💡 Tip: Output the table of contents for approval before generating the full README.
`,
        description:
          'Create a comprehensive, visually appealing README.md for GitHub, including a proposed table of contents and all best practices.',
        tags: [
          'documentation',
          'readme',
          'github',
          'markdown',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Documentation',
        language: 'Any',
        author: 'doc_expert',
      },
      {
        id: '7',
        title: 'Ethereum Smart Contract for Secure Messaging',
        prompt: `// 🔒 Design a Solidity smart contract for secure, auditable messaging.
// ✅ Checklist:
//   - Only deployer can write messages
//   - All messages are publicly readable
//   - Track number of message updates
//   - Include access control and event logging
//   - Provide code and explain approach
//
// 💡 Tip: Use comments to explain each section of the contract.
`,
        description:
          'Create a secure, auditable Ethereum smart contract for messaging, with access control and update tracking.',
        tags: [
          'ethereum',
          'solidity',
          'blockchain',
          'smart-contract',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Backend',
        language: 'Solidity',
        author: 'blockchain_dev',
      },
      {
        id: '8',
        title: 'Linux Terminal Emulator',
        prompt: `// 💻 Simulate a Linux terminal session.
// ✅ Checklist:
//   - Respond to shell commands with expected output in a code block
//   - No explanations unless instructed
//   - Treat curly braces as comments
//
// 💡 Tip: Output only the terminal result, not explanations.
`,
        description:
          'Emulate a Linux terminal for command-line practice and demonstration. Output only the terminal result.',
        tags: [
          'linux',
          'terminal',
          'shell',
          'emulator',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Bash',
        author: 'cli_guru',
      },
      {
        id: '9',
        title: 'JavaScript Console Simulator',
        prompt: `// 🖥️ Act as a JavaScript console.
// ✅ Checklist:
//   - Reply to commands with output in a code block
//   - No explanations unless asked
//   - Use curly braces for comments
//
// 💡 Tip: Output only the console result, not explanations.
`,
        description:
          'Practice and demonstrate JavaScript console commands interactively. Output only the console result.',
        tags: [
          'javascript',
          'console',
          'emulator',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'JavaScript',
        author: 'js_console',
      },
      {
        id: '10',
        title: 'Text-Based Excel Sheet Emulator',
        prompt: `// 📊 Simulate a text-based Excel sheet (10 rows, columns A-L).
// ✅ Checklist:
//   - Show sheet as text with row numbers and column letters
//   - Update and display sheet as instructed
//   - No explanations
//
// 💡 Tip: Output only the updated sheet after each instruction.
`,
        description:
          'Emulate Excel for quick, text-based spreadsheet tasks and formula practice. Output only the updated sheet.',
        tags: [
          'excel',
          'spreadsheet',
          'emulator',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Productivity',
        language: 'Any',
        author: 'sheet_bot',
      },
      {
        id: '11',
        title: 'UX/UI Developer for Digital Products',
        prompt: `// 🎨 Act as a UX/UI developer for digital products.
// ✅ Checklist:
//   - Suggest creative ways to improve user experience
//   - Propose wireframes or design mockups
//   - Provide usability feedback and accessibility tips
//   - Recommend tools or libraries for implementation
//   - Output actionable, prioritized suggestions
//
// Input: App, website, or product details
//
// 💡 Tip: Use bullet points and diagrams where helpful.
`,
        description:
          'Offer actionable UX/UI advice for digital product design, including wireframes, usability, and accessibility tips.',
        tags: [
          'ux',
          'ui',
          'design',
          'frontend',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'Any',
        author: 'ux_ui_expert',
      },
      {
        id: '12',
        title: 'Cybersecurity Strategy Advisor',
        prompt: `// 🛡️ Act as a cybersecurity specialist.
// ✅ Checklist:
//   - Propose strategies for data protection
//   - Suggest encryption, firewalls, and monitoring
//   - Address compliance and threat modeling
//   - Output actionable recommendations
//
// Input: Data storage and sharing details
//
// 💡 Tip: Use a table or checklist for clarity.
`,
        description:
          'Develop effective cybersecurity strategies for data protection, compliance, and threat mitigation.',
        tags: [
          'cybersecurity',
          'security',
          'encryption',
          'devops',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Any',
        author: 'security_pro',
      },
      {
        id: '13',
        title: 'Web Design Consultant',
        prompt: `// 🌐 Act as a web design consultant.
// ✅ Checklist:
//   - Recommend best interface and features for business goals
//   - Suggest UX/UI improvements
//   - Propose tools, frameworks, or libraries
//   - Output a step-by-step design plan
//
// Input: Organization’s needs and goals
//
// 💡 Tip: Use diagrams or tables for clarity.
`,
        description:
          'Advise on web design for optimal user experience and business alignment, with step-by-step plans.',
        tags: [
          'web-design',
          'consulting',
          'ux',
          'ui',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'Any',
        author: 'web_consultant',
      },
      {
        id: '14',
        title: 'Excel Sheet Emulator for Developers',
        prompt: `// 📊 Act as a text-based Excel emulator (10 rows, columns A-L).
// ✅ Checklist:
//   - Display sheet as text with row numbers and column letters
//   - Update and show sheet as instructed
//   - No explanations
//
// 💡 Tip: Output only the updated sheet after each instruction.
`,
        description:
          'Simulate Excel for text-based spreadsheet and formula practice. Output only the updated sheet.',
        tags: [
          'excel',
          'spreadsheet',
          'emulator',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Productivity',
        language: 'Any',
        author: 'sheet_bot',
      },
      {
        id: '15',
        title: 'UX/UI Navigation System Advisor',
        prompt: `// 🧭 As a UX/UI developer, design an intuitive navigation system for a mobile app.
// ✅ Checklist:
//   - Suggest wireframes or navigation flow diagrams
//   - Provide usability feedback
//   - Recommend best practices for mobile navigation
//   - Output actionable, prioritized suggestions
//
// Input: App description and navigation requirements
//
// 💡 Tip: Use diagrams or tables for clarity.
`,
        description:
          'Design and improve navigation systems for mobile applications, with actionable suggestions and diagrams.',
        tags: [
          'ux',
          'ui',
          'navigation',
          'mobile',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'Any',
        author: 'ux_ui_expert',
      },
      {
        id: '16',
        title: 'Cybersecurity Policy Creator',
        prompt: `// 🛡️ Create a cybersecurity policy for protecting sensitive company data.
// ✅ Checklist:
//   - Include encryption and access control
//   - Add monitoring for suspicious activity
//   - Address compliance and incident response
//   - Output as a clear, actionable policy document
//
// Input: Company data protection requirements
//
// 💡 Tip: Use bullet points and sections for clarity.
`,
        description:
          'Draft effective, actionable cybersecurity policies for organizations, covering encryption, access control, and monitoring.',
        tags: [
          'cybersecurity',
          'policy',
          'security',
          'devops',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Any',
        author: 'security_pro',
      },
      {
        id: '17',
        title: 'Web Design for E-Commerce',
        prompt: `// 🛒 Advise on web design for an e-commerce site (e.g., jewelry store).
// ✅ Checklist:
//   - Recommend interface and features for sales and UX
//   - Address accessibility and conversion optimization
//   - Suggest tools, frameworks, or libraries
//   - Output a prioritized, actionable plan
//
// Input: E-commerce business goals and requirements
//
// 💡 Tip: Use diagrams or tables for clarity.
`,
        description:
          'Advise on e-commerce web design for optimal sales, accessibility, and user experience, with actionable plans.',
        tags: [
          'web-design',
          'ecommerce',
          'ux',
          'ui',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'Any',
        author: 'web_consultant',
      },
      {
        id: '19',
        title: 'Web Design Accessibility Consultant',
        prompt: `// ♿ Review a website for accessibility improvements.
// ✅ Checklist:
//   - Suggest color contrast, keyboard navigation, ARIA labels
//   - Address screen reader compatibility
//   - Output actionable, prioritized recommendations
//
// Input: Website details or code
//
// 💡 Tip: Use a checklist or table for clarity.
`,
        description:
          'Improve web accessibility for all users with actionable, prioritized recommendations.',
        tags: [
          'web-design',
          'accessibility',
          'ux',
          'ui',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'Any',
        author: 'accessibility_expert',
      },
      {
        id: '20',
        title: 'Linux Command Line Practice',
        prompt: `// 🖥️ Simulate a Linux command line session.
// ✅ Checklist:
//   - Respond to commands with expected output in a code block
//   - No explanations unless requested
//
// 💡 Tip: Output only the command result, not explanations.
`,
        description:
          'Practice Linux command line skills interactively. Output only the command result.',
        tags: [
          'linux',
          'cli',
          'terminal',
          'practice',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Bash',
        author: 'cli_guru',
      },
      {
        id: '21',
        title: 'JavaScript Console Practice',
        prompt: `// 🖥️ Act as a JavaScript console for practice.
// ✅ Checklist:
//   - Reply to commands with output in a code block
//   - No explanations unless asked
//   - Use curly braces for comments
//
// 💡 Tip: Output only the console result, not explanations.
`,
        description:
          'Practice JavaScript console commands interactively. Output only the console result.',
        tags: [
          'javascript',
          'console',
          'practice',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'JavaScript',
        author: 'js_console',
      },
      {
        id: '22',
        title: 'DevOps Automation Advisor',
        prompt: `// ⚙️ As a DevOps expert, suggest automation strategies for CI/CD, IaC, and monitoring.
// ✅ Checklist:
//   - Recommend tools and workflows
//   - Focus on reliability and scalability
//   - Output actionable, prioritized steps
//
// Input: Project or infrastructure description
//
// 💡 Tip: Use tables or bullet points for clarity.
`,
        description:
          'Advise on DevOps automation for modern software delivery, with actionable, prioritized steps.',
        tags: [
          'devops',
          'automation',
          'ci/cd',
          'infrastructure',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Any',
        author: 'devops_guru',
      },
      {
        id: '23',
        title: 'Cloud Architecture Consultant',
        prompt: `// ☁️ Act as a cloud architect for scalable, secure infrastructure.
// ✅ Checklist:
//   - Recommend services and network setup
//   - Address security and cost optimization
//   - Output a clear, step-by-step architecture plan
//
// Input: Project description and requirements
//
// 💡 Tip: Use diagrams or tables for clarity.
`,
        description:
          'Design cloud architectures for scalability, security, and cost optimization, with clear, actionable plans.',
        tags: [
          'cloud',
          'architecture',
          'devops',
          'infrastructure',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Any',
        author: 'cloud_architect',
      },
      {
        id: '24',
        title: 'API Security Reviewer',
        prompt: `// 🔐 Review an API for security vulnerabilities.
// ✅ Checklist:
//   - Suggest improvements for authentication and authorization
//   - Address data protection and input validation
//   - Output actionable, prioritized recommendations
//
// Input: API details or code
//
// 💡 Tip: Use a checklist or table for clarity.
`,
        description:
          'Identify and remediate API security risks with actionable, prioritized recommendations.',
        tags: ['api', 'security', 'review', 'checklist', 'copilot-optimized'],
        category: 'Backend',
        language: 'Any',
        author: 'security_pro',
      },
      {
        id: '25',
        title: 'Database Design Advisor',
        prompt: `// 🗄️ Act as a database expert to improve data models.
// ✅ Checklist:
//   - Suggest normalization and indexing improvements
//   - Recommend query optimization
//   - Output a clear, step-by-step design plan
//
// Input: Data model or schema
//
// 💡 Tip: Use diagrams or tables for clarity.
`,
        description:
          'Optimize database design for performance and maintainability, with clear, actionable plans.',
        tags: [
          'database',
          'design',
          'optimization',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Database',
        language: 'Any',
        author: 'db_admin',
      },
      {
        id: '26',
        title: 'Frontend Performance Optimizer',
        prompt: `// ⚡ Analyze a web app and suggest frontend performance optimizations.
// ✅ Checklist:
//   - Recommend code splitting and lazy loading
//   - Suggest caching and resource optimization
//   - Address rendering and responsiveness
//   - Output actionable, prioritized steps
//
// Input: Web app description or code
//
// 💡 Tip: Use tables or bullet points for clarity.
`,
        description:
          'Improve frontend performance for web applications with actionable, prioritized steps and best practices.',
        tags: [
          'frontend',
          'performance',
          'optimization',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'Any',
        author: 'frontend_perf',
      },
      {
        id: '27',
        title: 'Backend Scalability Consultant',
        prompt: `// 🏗️ Act as a backend architect for scalable systems.
// ✅ Checklist:
//   - Recommend strategies for scaling and load balancing
//   - Address failover and high availability
//   - Output a clear, step-by-step architecture plan
//
// Input: System description and requirements
//
// 💡 Tip: Use diagrams or tables for clarity.
`,
        description:
          'Design scalable backend systems for high availability, with clear, actionable plans.',
        tags: [
          'backend',
          'scalability',
          'architecture',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Backend',
        language: 'Any',
        author: 'backend_architect',
      },
      {
        id: '28',
        title: 'Continuous Integration Coach',
        prompt: `// 🔄 As a CI/CD coach, help set up continuous integration for a project.
// ✅ Checklist:
//   - Recommend tools and workflows
//   - Suggest best practices for automated testing and deployment
//   - Output actionable, prioritized steps
//
// Input: Project description and requirements
//
// 💡 Tip: Use tables or bullet points for clarity.
`,
        description:
          'Implement CI/CD pipelines for efficient software delivery, with actionable, prioritized steps.',
        tags: [
          'ci/cd',
          'devops',
          'automation',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Any',
        author: 'ci_cd_coach',
      },
      {
        id: '29',
        title: 'API Documentation Generator',
        prompt: `// 📚 Generate clear, concise API documentation.
// ✅ Checklist:
//   - Include request/response examples and error codes
//   - Use consistent formatting and terminology
//   - Output as markdown or table
//
// Input: API endpoints and details
//
// 💡 Tip: Use code blocks and tables for clarity.
`,
        description:
          'Create professional API documentation for developers, with clear examples and consistent formatting.',
        tags: [
          'api',
          'documentation',
          'backend',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Documentation',
        language: 'Any',
        author: 'doc_expert',
      },
      {
        id: '30',
        title: 'Code Review Automation Advisor',
        prompt: `// 🤖 Suggest ways to automate code reviews for quality and security.
// ✅ Checklist:
//   - Recommend tools and scripts for automation
//   - Focus on code quality, style, and security
//   - Output actionable, prioritized steps
//
// Input: Project or codebase description
//
// 💡 Tip: Use tables or bullet points for clarity.
`,
        description:
          'Automate code review processes for better quality and efficiency, with actionable, prioritized steps.',
        tags: [
          'code-review',
          'automation',
          'quality',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Testing',
        language: 'Any',
        author: 'review_bot',
      },
      {
        id: '31',
        title: 'DevOps Monitoring Strategy',
        prompt: `// 📈 As a DevOps specialist, recommend a monitoring strategy for a distributed system.
// ✅ Checklist:
//   - Identify key system and application metrics (CPU, memory, latency, error rates)
//   - Propose alerting thresholds and escalation policies
//   - Suggest visualization tools (e.g., Grafana, Kibana)
//   - Include log aggregation and distributed tracing
//   - Output a step-by-step monitoring plan
//
// Input: System architecture or description
//
// 💡 Tip: Use tables or diagrams to illustrate monitoring flows and alerting logic.
`,
        description:
          'Monitor distributed systems for reliability and performance with actionable, checklist-driven strategies and tool recommendations.',
        tags: [
          'devops',
          'monitoring',
          'metrics',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Any',
        author: 'devops_guru',
      },
      {
        id: '32',
        title: 'Frontend Accessibility Tester',
        prompt: `// ♿ Act as an accessibility tester for frontend apps.
// ✅ Checklist:
//   - Review for screen reader compatibility (ARIA, semantic HTML)
//   - Test keyboard navigation and focus order
//   - Check color contrast and visual cues
//   - Suggest improvements for all major accessibility guidelines (WCAG)
//   - Output actionable, prioritized recommendations
//
// Input: App code or description
//
// 💡 Tip: Use a checklist or table for clarity and reference accessibility standards.
`,
        description:
          'Test and improve accessibility in frontend applications with actionable, checklist-driven recommendations.',
        tags: [
          'frontend',
          'accessibility',
          'testing',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'Any',
        author: 'accessibility_tester',
      },
      {
        id: '33',
        title: 'Backend API Rate Limiting Advisor',
        prompt: `// 🚦 As a backend expert, suggest strategies for API rate limiting and throttling.
// ✅ Checklist:
//   - Recommend algorithms (token bucket, leaky bucket, fixed window, etc.)
//   - Address per-user, per-IP, and global limits
//   - Suggest implementation approaches (middleware, API gateway, etc.)
//   - Include monitoring and alerting for abuse
//   - Output code snippets or configuration examples
//
// Input: API description or requirements
//
// 💡 Tip: Explain trade-offs and show before/after examples if possible.
`,
        description:
          'Implement rate limiting for secure and reliable APIs with actionable, code-oriented strategies and best practices.',
        tags: [
          'backend',
          'api',
          'rate-limiting',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Backend',
        language: 'Any',
        author: 'backend_architect',
      },
      {
        id: '34',
        title: 'DevOps Disaster Recovery Planner',
        prompt: `// 🛠️ As a DevOps engineer, create a disaster recovery plan for a cloud-based app.
// ✅ Checklist:
//   - Define backup strategies (frequency, storage, encryption)
//   - Plan for failover and high availability
//   - Outline restoration and verification procedures
//   - Address RTO/RPO and compliance requirements
//   - Output a step-by-step recovery plan
//
// Input: Cloud app architecture or requirements
//
// 💡 Tip: Use tables or diagrams to illustrate backup/restore flows and failover logic.
`,
        description:
          'Plan for disaster recovery in cloud environments with actionable, checklist-driven steps and compliance considerations.',
        tags: [
          'devops',
          'disaster-recovery',
          'cloud',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Any',
        author: 'devops_guru',
      },
      {
        id: '35',
        title: 'Database Migration Advisor',
        prompt: `// 🔄 Act as a database migration expert.
// ✅ Checklist:
//   - Outline data mapping and transformation steps
//   - Plan for data validation and integrity checks
//   - Define rollback and recovery procedures
//   - Suggest tools or scripts for migration
//   - Output a step-by-step migration plan
//
// Input: Source and target database details
//
// 💡 Tip: Use tables for mapping and show example migration scripts if possible.
`,
        description:
          'Plan and execute safe database migrations with actionable, checklist-driven steps and code examples.',
        tags: [
          'database',
          'migration',
          'planning',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Database',
        language: 'Any',
        author: 'db_admin',
      },
      {
        id: '36',
        title: 'API Versioning Strategist',
        prompt: `// 🗂️ As an API strategist, recommend a versioning approach for a public API.
// ✅ Checklist:
//   - Compare versioning strategies (URI, header, media type, etc.)
//   - Discuss pros and cons of each approach
//   - Provide implementation examples (code/config)
//   - Address backward compatibility and deprecation
//   - Output a clear, actionable versioning plan
//
// Input: API description and requirements
//
// 💡 Tip: Use tables to compare strategies and show before/after examples.
`,
        description:
          'Choose and implement effective API versioning with actionable, checklist-driven comparisons and code examples.',
        tags: [
          'api',
          'versioning',
          'strategy',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Backend',
        language: 'Any',
        author: 'api_strategist',
      },
      {
        id: '37',
        title: 'Frontend State Management Advisor',
        prompt: `// 🗃️ Act as a frontend state management expert.
// ✅ Checklist:
//   - Recommend state management solutions (Redux, NgRx, Context API, etc.)
//   - Explain trade-offs and use cases for each
//   - Provide code snippets or architecture diagrams
//   - Address scalability and maintainability
//   - Output a step-by-step implementation plan
//
// Input: App description and requirements
//
// 💡 Tip: Use tables to compare solutions and show example code for best practices.
`,
        description:
          'Select and implement state management in frontend apps with actionable, checklist-driven comparisons and code examples.',
        tags: [
          'frontend',
          'state-management',
          'architecture',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'Any',
        author: 'frontend_architect',
      },
      {
        id: '38',
        title: 'DevOps Cost Optimization Consultant',
        prompt: `// 💸 As a DevOps consultant, analyze cloud infrastructure for cost optimization.
// ✅ Checklist:
//   - Identify major cost drivers (compute, storage, network)
//   - Recommend rightsizing and resource scheduling
//   - Suggest reserved instances, spot pricing, or autoscaling
//   - Address monitoring and alerting for cost anomalies
//   - Output actionable, prioritized cost-saving steps
//
// Input: Cloud infrastructure description or billing data
//
// 💡 Tip: Use tables or charts to illustrate savings and trade-offs.
`,
        description:
          'Reduce cloud costs while maintaining quality with actionable, checklist-driven recommendations and visualizations.',
        tags: [
          'devops',
          'cost-optimization',
          'cloud',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Any',
        author: 'devops_guru',
      },
      {
        id: '39',
        title: 'API Gateway Design Advisor',
        prompt: `// 🛡️ Act as an API gateway expert for microservices architecture.
// ✅ Checklist:
//   - Design routing, authentication, and rate limiting
//   - Suggest monitoring and logging strategies
//   - Provide configuration/code examples (e.g., Kong, NGINX, AWS API Gateway)
//   - Address scalability and security best practices
//   - Output a step-by-step gateway setup plan
//
// Input: Microservices architecture or requirements
//
// 💡 Tip: Use diagrams or tables to illustrate gateway flows and policies.
`,
        description:
          'Design and implement API gateways for microservices with actionable, checklist-driven steps and code/config examples.',
        tags: [
          'api',
          'gateway',
          'microservices',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Backend',
        language: 'Any',
        author: 'api_gateway_expert',
      },
      {
        id: '40',
        title: 'Frontend Testing Strategy Coach',
        prompt: `// 🧪 As a frontend testing coach, recommend a testing strategy for a web app.
// ✅ Checklist:
//   - Cover unit, integration, and end-to-end testing
//   - Suggest tools and frameworks (Jest, Cypress, Testing Library, etc.)
//   - Propose test organization and coverage goals
//   - Output actionable, prioritized testing steps
//
// Input: Web app description and requirements
//
// 💡 Tip: Use tables to compare tools and show example test structures.
`,
        description:
          'Develop comprehensive frontend testing strategies with actionable, checklist-driven steps and tool comparisons.',
        tags: [
          'frontend',
          'testing',
          'strategy',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Testing',
        language: 'Any',
        author: 'frontend_tester',
      },
      {
        id: '41',
        title: 'DevOps Infrastructure as Code Advisor',
        prompt: `// 🏗️ Act as an infrastructure as code (IaC) expert.
// ✅ Checklist:
//   - Recommend IaC tools (Terraform, Pulumi, AWS CDK, etc.)
//   - Suggest best practices for version control and automation
//   - Provide code/configuration examples
//   - Address testing and security of IaC
//   - Output a step-by-step IaC implementation plan
//
// Input: Infrastructure requirements or current setup
//
// 💡 Tip: Use tables to compare tools and show example IaC code.
`,
        description:
          'Implement infrastructure as code for modern DevOps with actionable, checklist-driven steps and code/config examples.',
        tags: [
          'devops',
          'infrastructure-as-code',
          'automation',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Any',
        author: 'iac_expert',
      },
      {
        id: '42',
        title: 'Cloud Security Best Practices Consultant',
        prompt: `// 🔒 As a cloud security consultant, review a cloud deployment for best practices.
// ✅ Checklist:
//   - Secure resources (network, storage, compute)
//   - Manage identities and access (IAM, RBAC, MFA)
//   - Monitor for threats and suspicious activity
//   - Suggest compliance and audit strategies
//   - Output actionable, prioritized security recommendations
//
// Input: Cloud deployment details or architecture
//
// 💡 Tip: Use tables or diagrams to illustrate security controls and monitoring flows.
`,
        description:
          'Secure cloud deployments with industry best practices, actionable checklists, and visualizations.',
        tags: [
          'cloud',
          'security',
          'best-practices',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Any',
        author: 'cloud_security',
      },
      {
        id: '43',
        title: 'Write Angular Unit Tests',
        prompt: `// 🧪 Write Jasmine unit tests for the following Angular component/service.
// ✅ Checklist:
//   - Cover all logic branches, edge cases, input/output bindings, and lifecycle methods
//   - Use spies, mocks, and dependency injection where needed
//   - Test async operations and error handling
//   - Output readable, maintainable test code
//
// Input: {{code_snippet}}
//
// 💡 Tip: Use TestBed, ComponentFixture, and HttpTestingController if applicable. Show before/after test improvements if refactoring.
`,
        description:
          'Generate robust Jasmine unit tests for Angular components or services using best practices and checklist-driven coverage.',
        tags: [
          'angular',
          'unit-test',
          'jasmine',
          'testing',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Testing',
        language: 'TypeScript',
        author: 'ng_tester',
      },
      {
        id: '44',
        title: 'Angular Reactive Forms Validation',
        prompt: `// 📝 Generate Angular Reactive Forms validation logic for this form model.
// ✅ Checklist:
//   - Add built-in validators (e.g., required, minlength)
//   - Include custom validators if needed
//   - Output readable error messages for template display
//   - Show example usage in a component
//
// Input: {{form_model}}
//
// 💡 Tip: Use Validators.compose and provide validation error messages in the template. Show before/after validation improvements if refactoring.
`,
        description:
          'Generate validation logic and error messages for Angular Reactive Forms using built-in and custom validators, with checklist-driven clarity.',
        tags: [
          'angular',
          'forms',
          'validation',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'TypeScript',
        author: 'ng_forms',
      },
      {
        id: '45',
        title: 'Angular Service with RxJS',
        prompt: `// 🔄 Create an Angular service using RxJS to manage application state.
// ✅ Checklist:
//   - Use BehaviorSubject to store state
//   - Provide observable getters and updater methods
//   - Include an example of how a component subscribes to this service
//   - Handle unsubscription and memory leaks
//
// Input: Service requirements or state description
//
// 💡 Tip: Use takeUntil or async pipe in the component to handle unsubscription. Show before/after service improvements if refactoring.
`,
        description:
          'Best practices for creating Angular services using RxJS for reactive state management, with checklist-driven code and examples.',
        tags: [
          'angular',
          'rxjs',
          'service',
          'state-management',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'TypeScript',
        author: 'rxjs_guru',
      },
      {
        id: '46',
        title: 'Angular Component Best Practices',
        prompt: `// 🔍 Review and improve this Angular component.
// ✅ Checklist:
//   - Optimize for performance (e.g., OnPush strategy)
//   - Refactor for maintainability and readability
//   - Apply Angular best practices and remove anti-patterns
//   - Output before/after code if refactoring
//
// Input: {{component_code}}
//
// 💡 Tip: Watch for unused imports, repeated logic, improper subscriptions, and large templates. Show before/after improvements if possible.
`,
        description:
          'Improve Angular components using performance optimization, code best practices, and checklist-driven refactoring.',
        tags: [
          'angular',
          'component',
          'best-practices',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'TypeScript',
        author: 'ng_architect',
      },
      {
        id: '47',
        title: 'Angular Dependency Injection Explanation',
        prompt: `// 📦 Explain Angular Dependency Injection via example.
// ✅ Checklist:
//   - Show how to inject a service into a component
//   - Cover providers, injectors, and @Injectable usage
//   - Explain @Inject and token injection
//   - Output code and clear explanations
//
// Input: Service/component context or question
//
// 💡 Tip: Use @Inject() when injecting tokens or interfaces. Show before/after DI improvements if refactoring.
`,
        description:
          'Understand Angular Dependency Injection with examples, core concepts, and checklist-driven clarity.',
        tags: [
          'angular',
          'dependency-injection',
          'architecture',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'TypeScript',
        author: 'ng_di',
      },
      {
        id: '48',
        title: 'Angular Routing with Lazy Loading',
        prompt: `// 🚀 Set up Angular routing with lazy-loaded modules.
// ✅ Checklist:
//   - Define routes with loadChildren
//   - Include module structure and routing setup
//   - Use modern \`standalone\` or \`NgModules\` as needed
//   - Output example route configuration and explanation
//
// Input: Routing requirements or app structure
//
// 💡 Tip: Use diagrams or tables to illustrate routing flows and lazy loading. Show before/after routing improvements if refactoring.
`,
        description:
          'Implement Angular routing with lazy loading to optimize performance and modularity, using checklist-driven code and explanations.',
        tags: [
          'angular',
          'routing',
          'lazy-loading',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'TypeScript',
        author: 'ng_router',
      },
      {
        id: '49',
        title: 'Angular E2E Test with Cypress',
        prompt: `// 🧪 Write an E2E test using Cypress for the feature described below.
// ✅ Checklist:
//   - Simulate user interactions (clicks, form fills, navigation)
//   - Assert expected DOM changes or route transitions
//   - Handle asynchronous waits where needed
//   - Output readable, maintainable test code
//
// Input: {{feature}}
//
// 💡 Tip: Use before/after test improvements if refactoring. Show example test structure and best practices.
`,
        description:
          'Automate end-to-end testing of Angular features using Cypress, with checklist-driven code and best practices.',
        tags: [
          'angular',
          'e2e',
          'cypress',
          'testing',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Testing',
        language: 'TypeScript',
        author: 'ng_e2e',
      },
      {
        id: '50',
        title: 'Angular Performance Optimization',
        prompt: `// 🚀 Analyze and suggest performance optimizations for the following Angular app.
// ✅ Checklist:
//   - Apply OnPush change detection where appropriate
//   - Use trackBy in ngFor loops
//   - Lazy-load routes and modules
//   - Optimize large templates and reduce unnecessary bindings
//   - Output before/after code if refactoring
//
// Input: {{app_description}}
//
// 💡 Tip: Consider memoization, pure pipes, and reducing zone.js overhead. Show before/after improvements if possible.
`,
        description:
          'Optimize Angular applications by applying best practices to improve speed and reduce unnecessary renders, with checklist-driven code and explanations.',
        tags: [
          'angular',
          'performance',
          'optimization',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'TypeScript',
        author: 'ng_perf',
      },
      {
        id: '51',
        title: 'Angular Custom Pipe Example',
        prompt: `// 🔧 Create a custom Angular pipe that transforms input data as described below.
// ✅ Checklist:
//   - Use pure or impure pipe as needed
//   - Handle edge cases like null or empty input
//   - Include usage example in a component template
//   - Output before/after code if refactoring
//
// Input: {{transformation}}
//
// 💡 Tip: Show example usage and best practices for custom pipes. Show before/after improvements if possible.
`,
        description:
          'Write reusable and clean custom pipes for transforming data in Angular templates, with checklist-driven code and examples.',
        tags: ['angular', 'pipe', 'custom', 'checklist', 'copilot-optimized'],
        category: 'Frontend',
        language: 'TypeScript',
        author: 'ng_pipe',
      },
      {
        id: '52',
        title: 'Angular Internationalization (i18n)',
        prompt: `// 🌐 Set up internationalization (i18n) in Angular.
// ✅ Checklist:
//   - Configure i18n support in angular.json and app module
//   - Use i18n attribute for translations in templates
//   - Provide translation files (e.g., messages.xlf)
//   - Show an example translating a component template
//   - Output before/after code if refactoring
//
// Input: i18n requirements or app structure
//
// 💡 Tip: Use Angular CLI extract-i18n and support multiple locales with build configurations. Show before/after improvements if possible.
`,
        description:
          'Add multi-language support in Angular apps using the built-in i18n tools and translation files, with checklist-driven code and examples.',
        tags: [
          'angular',
          'i18n',
          'internationalization',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Frontend',
        language: 'TypeScript',
        author: 'ng_i18n',
      },
      // --- Java, Microservices, and Spring Boot Prompts ---
      {
        id: '53',
        title: 'Spring Boot REST API Scaffold',
        prompt: `// 🚀 Generate a Spring Boot REST API scaffold for the following entity.
// ✅ Checklist:
//   - Create @RestController with CRUD endpoints
//   - Use @Service and @Repository layers
//   - Include DTOs and entity classes
//   - Add basic validation and exception handling
//   - Output code for all layers (controller, service, repository, entity, DTO)
//
// Entity: {{entity_description}}
//
// 💡 Tip: Use Lombok for boilerplate and JPA annotations for persistence. Show package structure and explain each class.
`,
        description:
          'Scaffold a complete Spring Boot REST API with layered architecture, DTOs, validation, and best practices.',
        tags: [
          'java',
          'spring-boot',
          'rest',
          'api',
          'scaffold',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Backend',
        language: 'Java',
        author: 'spring_guru',
      },
      {
        id: '54',
        title: 'Java Microservice with OpenAPI and Docker',
        prompt: `// 🧩 Create a Java microservice with OpenAPI documentation and Docker support.
// ✅ Checklist:
//   - Use Spring Boot or Micronaut
//   - Add OpenAPI (Swagger) annotations for all endpoints
//   - Provide a Dockerfile for containerization
//   - Include health check and actuator endpoints
//   - Output code for main app, config, and Dockerfile
//
// Service Description: {{service_description}}
//
// 💡 Tip: Use springdoc-openapi or Micronaut OpenAPI. Comment each section and explain how to run locally and in Docker.
`,
        description:
          'Build a Java microservice with OpenAPI docs, health checks, and Docker support using Spring Boot or Micronaut.',
        tags: [
          'java',
          'microservices',
          'spring-boot',
          'openapi',
          'docker',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Backend',
        language: 'Java',
        author: 'microservice_dev',
      },
      {
        id: '55',
        title: 'Spring Boot Security Best Practices',
        prompt: `// 🔒 Review and improve security for a Spring Boot application.
// ✅ Checklist:
//   - Use strong password encoding (BCrypt)
//   - Secure endpoints with @PreAuthorize or @Secured
//   - Configure CORS and CSRF protection
//   - Validate all user input
//   - Output code/config for security config and example endpoints
//
// App Description: {{app_description}}
//
// 💡 Tip: Use Spring Security best practices and explain each config. Show before/after improvements if refactoring.
`,
        description:
          'Apply security best practices to Spring Boot apps, including endpoint protection, password encoding, and input validation.',
        tags: [
          'java',
          'spring-boot',
          'security',
          'best-practices',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Backend',
        language: 'Java',
        author: 'security_pro',
      },
      {
        id: '56',
        title: 'Java Unit Test Generator (JUnit 5)',
        prompt: `// 🧪 Write JUnit 5 unit tests for the following Java class or method.
// ✅ Checklist:
//   - Cover all logic branches and edge cases
//   - Use mocks for dependencies (Mockito)
//   - Test exception handling and input validation
//   - Output readable, maintainable test code
//
// Input: {{java_code}}
//
// 💡 Tip: Use @ParameterizedTest for multiple scenarios. Show before/after test improvements if refactoring.
`,
        description:
          'Generate robust JUnit 5 tests for Java code, using Mockito for mocking and checklist-driven coverage.',
        tags: [
          'java',
          'junit',
          'testing',
          'unit-test',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Testing',
        language: 'Java',
        author: 'java_tester',
      },
      {
        id: '57',
        title: 'Spring Boot Microservice Communication Patterns',
        prompt: `// 🔗 Suggest communication patterns for Spring Boot microservices.
// ✅ Checklist:
//   - Compare REST, gRPC, and messaging (RabbitMQ, Kafka)
//   - Recommend synchronous vs. asynchronous strategies
//   - Show code/config examples for each pattern
//   - Address error handling and retries
//   - Output a summary table of pros/cons
//
// Microservice Context: {{context}}
//
// 💡 Tip: Use diagrams or tables to illustrate flows. Explain trade-offs and show before/after improvements if refactoring.
`,
        description:
          'Choose and implement communication patterns for Spring Boot microservices, with code/config examples and trade-off analysis.',
        tags: [
          'java',
          'spring-boot',
          'microservices',
          'communication',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Backend',
        language: 'Java',
        author: 'microservice_architect',
      },
      {
        id: '58',
        title: 'Java Exception Handling Best Practices',
        prompt: `// ⚠️ Review and improve exception handling in the following Java code.
// ✅ Checklist:
//   - Use custom exception classes where appropriate
//   - Avoid catching generic Exception
//   - Add meaningful error messages and logging
//   - Output before/after code and explain improvements
//
// Code: {{java_code}}
//
// 💡 Tip: Use @ControllerAdvice for global exception handling in Spring Boot. Show before/after improvements if possible.
`,
        description:
          'Refine exception handling in Java and Spring Boot code, using custom exceptions, logging, and best practices.',
        tags: [
          'java',
          'exception-handling',
          'spring-boot',
          'best-practices',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Backend',
        language: 'Java',
        author: 'java_expert',
      },
      {
        id: '59',
        title: 'Spring Boot Integration Test Generator',
        prompt: `// 🧪 Write Spring Boot integration tests for the following REST API or service.
// ✅ Checklist:
//   - Use @SpringBootTest and @AutoConfigureMockMvc
//   - Test all major endpoints and scenarios
//   - Mock external dependencies if needed
//   - Output readable, maintainable test code
//
// Input: {{api_or_service_code}}
//
// 💡 Tip: Use TestRestTemplate or MockMvc for HTTP tests. Show before/after test improvements if refactoring.
`,
        description:
          'Generate comprehensive integration tests for Spring Boot APIs/services using @SpringBootTest and MockMvc/TestRestTemplate.',
        tags: [
          'java',
          'spring-boot',
          'integration-test',
          'testing',
          'checklist',
          'copilot-optimized',
        ],
        category: 'Testing',
        language: 'Java',
        author: 'spring_tester',
      },
      {
        id: '60',
        title: 'Java Microservice Observability Setup',
        prompt: `// 📊 Set up observability (metrics, tracing, logging) for a Java microservice.
// ✅ Checklist:
//   - Integrate Micrometer or OpenTelemetry for metrics/tracing
//   - Configure centralized logging (ELK, Loki, etc.)
//   - Add health and readiness probes
//   - Output code/config for observability setup
//
// Service Description: {{service_description}}
//
// 💡 Tip: Use Prometheus/Grafana for metrics. Show before/after observability improvements if refactoring.
`,
        description:
          'Implement observability in Java microservices using Micrometer/OpenTelemetry, centralized logging, and health checks.',
        tags: [
          'java',
          'microservices',
          'observability',
          'metrics',
          'logging',
          'checklist',
          'copilot-optimized',
        ],
        category: 'DevOps',
        language: 'Java',
        author: 'observability_guru',
      },  
  {
        id: '66',
        title: 'JIRA User Story Generator',
        prompt: `// 📝 Write a JIRA user story for the following feature or requirement.
// ✅ Checklist:
//   - Use "As a [role], I want [goal] so that [reason]" format
//   - Add clear acceptance criteria (Gherkin or checklist)
//   - Include business value and priority
//   - Suggest test cases if possible
//   - Output in JIRA-ready markdown
//
// Feature/Requirement: {{feature_description}}
//
// 💡 Tip: Use bullet points for acceptance criteria and keep stories concise.
`,
        description:
          'Generate clear, actionable JIRA user stories with acceptance criteria, business value, and test cases.',
        tags: [
          'jira',
          'user-story',
          'agile',
          'business-analyst',
          'scrum',
          'copilot-optimized',
        ],
        category: 'Business',
        language: 'Any',
        author: 'ba_scrum',
      },
      {
        id: '67',
        title: 'JIRA Epic Breakdown',
        prompt: `// 🗂️ Break down the following epic or large feature into JIRA stories and tasks.
// ✅ Checklist:
//   - Identify all major user stories
//   - Suggest technical and non-technical tasks
//   - Prioritize and group logically
//   - Output as a JIRA-ready list (markdown or table)
//
// Epic/Feature: {{epic_description}}
//
// 💡 Tip: Keep stories small and independent; use INVEST criteria.
`,
        description:
          'Decompose large epics into actionable JIRA stories and tasks, ready for backlog grooming and sprint planning.',
        tags: [
          'jira',
          'epic',
          'breakdown',
          'agile',
          'business-analyst',
          'scrum',
          'copilot-optimized',
        ],
        category: 'Business',
        language: 'Any',
        author: 'ba_scrum',
      },
      {
        id: '68',
        title: 'Acceptance Criteria Generator',
        prompt: `// ✅ Generate acceptance criteria for the following user story or feature.
//   - Use Gherkin (Given/When/Then) or checklist format
//   - Cover all functional and non-functional requirements
//   - Ensure criteria are testable and unambiguous
//   - Output as a JIRA-ready list
//
// User Story/Feature: {{story_or_feature}}
//
// 💡 Tip: Acceptance criteria should be clear enough for both devs and testers.
`,
        description:
          'Create clear, testable acceptance criteria for JIRA stories or features, using Gherkin or checklist format.',
        tags: [
          'jira',
          'acceptance-criteria',
          'agile',
          'business-analyst',
          'scrum',
          'copilot-optimized',
        ],
        category: 'Business',
        language: 'Any',
        author: 'ba_scrum',
      },
      {
        id: '69',
        title: 'JIRA Task Definition Helper',
        prompt: `// 🛠️ Define clear, actionable JIRA tasks for the following feature or story.
// ✅ Checklist:
//   - Make each task atomic and testable
//   - Include definition of done
//   - Assign to appropriate role (dev, QA, BA, etc.)
//   - Output as a JIRA-ready checklist
//
// Feature/Story: {{feature_or_story}}
//
// 💡 Tip: Tasks should be small enough to complete in a day or less.
`,
        description:
          'Help business analysts and scrum masters define granular, actionable JIRA tasks with clear definition of done.',
        tags: [
          'jira',
          'task',
          'definition-of-done',
          'agile',
          'business-analyst',
          'scrum',
          'copilot-optimized',
        ],
        category: 'Business',
        language: 'Any',
        author: 'ba_scrum',
      },
      {
        id: '70',
        title: 'Sprint Goal Generator',
        prompt: `// 🎯 Suggest a sprint goal for the following set of JIRA stories or features.
// ✅ Checklist:
//   - Summarize the main business value
//   - Make the goal specific, measurable, and achievable
//   - Output as a single, clear statement
//
// Stories/Features: {{stories_or_features}}
//
// 💡 Tip: Sprint goals should guide the team and stakeholders for the iteration.
`,
        description:
          'Generate focused, actionable sprint goals for scrum teams based on JIRA stories or features.',
        tags: [
          'jira',
          'sprint-goal',
          'agile',
          'scrum',
          'business-analyst',
          'copilot-optimized',
        ],
        category: 'Business',
        language: 'Any',
        author: 'ba_scrum',
      },
      {
        id: '71',
        title: 'JQL Query Generator for JIRA',
        prompt: `// 🔍 Generate a JQL (JIRA Query Language) query for the following search criteria.
// ✅ Checklist:
//   - Interpret the user's requirements and map to JIRA fields
//   - Use correct JQL syntax (AND/OR, parentheses, operators)
//   - Suggest filters for project, issue type, status, assignee, date, etc.
//   - Output the JQL query in a code block
//   - Briefly explain the query logic
//
// Search Criteria: {{criteria}}
//
// 💡 Tip: If the criteria are ambiguous, ask clarifying questions or provide multiple query options.
`,
        description:
          'Generate precise JQL queries for JIRA based on user-defined search criteria, with explanations and best practices.',
        tags: [
          'jira',
          'jql',
          'query',
          'search',
          'business-analyst',
          'scrum',
          'copilot-optimized',
        ],
        category: 'Business',
        language: 'Any',
        author: 'ba_scrum',
      },
    ];

    const copilotTemplates: CopilotTemplate[] = [
      {
        id: '1',
        name: 'Angular Development Guidelines',
        category: 'Frontend Framework',
        language: 'TypeScript',
        framework: 'Angular',
        description: 'Comprehensive guidelines for Angular development with modern best practices',
        content: `# Angular Project Guidelines

## Project Context
This is an Angular application following modern development practices with TypeScript, Angular Material, and reactive programming patterns.

## Coding Standards
- Use TypeScript strict mode and proper type definitions
- Follow Angular style guide conventions
- Implement OnPush change detection strategy where possible
- Use reactive forms over template-driven forms
- Implement proper error handling and loading states
- Use strict null checks and noImplicitAny
- Follow consistent naming conventions (camelCase for variables, PascalCase for classes)
- Use meaningful variable and function names
- Implement proper JSDoc comments for public APIs

## Architecture Guidelines
- Follow the single responsibility principle
- Use dependency injection for services
- Implement proper separation of concerns between components, services, and models
- Use Angular Material components consistently
- Follow feature module structure for large applications
- Implement lazy loading for feature modules
- Use smart/dumb component patterns
- Follow reactive programming principles with RxJS
- Implement proper state management (NgRx for complex apps)

## Framework-Specific Rules
- Use Angular's built-in validators and create custom validators when needed
- Implement proper unsubscription patterns for observables (takeUntil, async pipe)
- Use trackBy functions in *ngFor loops for performance
- Prefer standalone components in Angular 14+
- Use Angular's testing utilities (TestBed, ComponentFixture) for unit tests
- Implement Angular guards for route protection
- Use Angular interceptors for HTTP request/response handling
- Leverage Angular CLI for code generation and consistency
- Use Angular Signals for reactive state management (Angular 16+)
- Implement proper change detection optimization strategies

## File Structure
- Services go in \`/src/app/services/\`
- Components go in \`/src/app/components/\`
- Models/interfaces go in \`/src/app/models/\`
- Guards go in \`/src/app/guards/\`
- Interceptors go in \`/src/app/interceptors/\`
- Pipes go in \`/src/app/pipes/\`
- Directives go in \`/src/app/directives/\`
- Use barrel exports (index.ts) for clean imports
- Organize by feature modules for larger applications
- Keep shared utilities in \`/src/app/shared/\`

## Security Best Practices
- Sanitize user inputs and use Angular's built-in sanitization
- Implement Content Security Policy (CSP)
- Use HTTPS and secure authentication mechanisms
- Validate all inputs on both client and server side
- Implement proper CORS configuration
- Use Angular's built-in XSS protection features

## Performance Optimization
- Implement OnPush change detection strategy
- Use lazy loading for routes and modules
- Optimize bundle size with tree shaking
- Use trackBy functions in loops
- Implement virtual scrolling for large lists
- Use Angular Service Worker for caching
- Optimize images and assets
- Implement code splitting and preloading strategies

## Testing Preferences
- Write unit tests for all components and services
- Use Jest for unit testing (preferred over Jasmine/Karma)
- Use Angular Testing Library with Jest for better component testing
- Use Cypress for e2e testing
- Configure Jest with @angular-builders/jest for Angular projects
- Aim for 80%+ code coverage
- Mock external dependencies with Jest mocking capabilities
- Test user interactions and accessibility with jest-axe
- Implement integration tests for critical workflows
- Use Jest snapshots for component structure validation
- Leverage Jest's built-in mocking and spying features`,
        tags: ['angular', 'typescript', 'frontend', 'best-practices', 'reactive-forms', 'performance', 'security'],
        popularity: 95,
        lastUpdated: new Date('2025-07-14'),
        author: 'angular_team'
      },
      {
        id: '2',
        name: 'React TypeScript Best Practices',
        category: 'Frontend Framework',
        language: 'TypeScript',
        framework: 'React',
        description: 'Modern React development with TypeScript, hooks, and performance optimization',
        content: `# React TypeScript Guidelines

## Project Context
This is a React application built with TypeScript, utilizing modern hooks, context API, and performance optimization techniques.

## Coding Standards
- Use functional components with hooks over class components
- Implement proper TypeScript interfaces for props and state
- Use meaningful component and variable names
- Follow consistent file naming conventions (PascalCase for components)
- Use ESLint and Prettier for code formatting
- Enable strict TypeScript mode
- Use const assertions where appropriate
- Implement proper type guards for runtime type checking
- Use discriminated unions for complex state types

## Architecture Guidelines
- Use composition over inheritance
- Implement proper component hierarchy
- Use React Context for global state management
- Keep components small and focused
- Use custom hooks for reusable logic
- Implement container/presentational component patterns
- Use React.Suspense for code splitting and loading states
- Implement proper error boundaries at component tree levels
- Use state machines for complex component logic (XState)

## Framework-Specific Rules
- Use useCallback and useMemo for performance optimization
- Implement proper error boundaries
- Use React.memo for component memoization
- Prefer controlled components over uncontrolled
- Use proper key props in lists
- Implement proper dependency arrays in useEffect
- Use useRef for DOM manipulation and mutable values
- Leverage useReducer for complex state logic
- Use React.startTransition for non-urgent updates
- Implement proper cleanup in useEffect hooks

## File Structure
- Components in \`/src/components/\`
- Hooks in \`/src/hooks/\`
- Types in \`/src/types/\`
- Utils in \`/src/utils/\`
- Context providers in \`/src/context/\`
- Constants in \`/src/constants/\`
- Services/API calls in \`/src/services/\`
- Use index.ts files for clean exports
- Group related components in feature folders

## State Management
- Use React Context for simple global state
- Consider Redux Toolkit for complex state management
- Use Zustand for lightweight state management
- Implement proper state normalization
- Use React Query/TanStack Query for server state
- Keep state as close to where it's needed as possible
- Implement optimistic updates for better UX

## Performance Optimization
- Use React.memo judiciously
- Implement proper key props in lists
- Use React.lazy for code splitting
- Optimize re-renders with useCallback and useMemo
- Use React DevTools Profiler for performance analysis
- Implement virtual scrolling for large lists
- Use Web Workers for heavy computations
- Optimize bundle size with tree shaking and code splitting

## Security Best Practices
- Sanitize user inputs and prevent XSS attacks
- Use Content Security Policy (CSP)
- Implement proper authentication and authorization
- Validate inputs on both client and server
- Use secure HTTP headers
- Implement CSRF protection

## Testing Preferences
- Use Jest and React Testing Library
- Write unit tests for all components
- Use mock functions for external dependencies
- Test user interactions and edge cases
- Aim for high test coverage
- Use MSW (Mock Service Worker) for API mocking
- Implement accessibility testing with jest-axe
- Use Playwright or Cypress for e2e testing`,
        tags: ['react', 'typescript', 'hooks', 'frontend', 'performance', 'state-management', 'security'],
        popularity: 92,
        lastUpdated: new Date('2025-07-14'),
        author: 'react_team'
      },
      {
        id: '3',
        name: 'Node.js API Development',
        category: 'Backend Framework',
        language: 'JavaScript',
        framework: 'Node.js',
        description: 'Best practices for building RESTful APIs with Node.js and Express',
        content: `# Node.js API Development Guidelines

## Project Context
This is a Node.js backend application built with Express.js, focusing on RESTful API design and scalable architecture.

## Coding Standards
- Use async/await over callbacks
- Implement proper error handling middleware
- Use meaningful HTTP status codes
- Follow RESTful naming conventions
- Use environment variables for configuration
- Use TypeScript for better type safety
- Follow consistent naming conventions (camelCase for variables, PascalCase for classes)
- Implement proper JSDoc comments
- Use strict mode and enable ESLint rules

## Architecture Guidelines
- Implement layered architecture (routes, controllers, services, models)
- Use dependency injection where appropriate
- Implement proper logging and monitoring
- Use middleware for cross-cutting concerns
- Follow SOLID principles
- Implement Clean Architecture or Hexagonal Architecture
- Use design patterns appropriately (Repository, Factory, Strategy)
- Separate business logic from presentation logic
- Implement proper validation and sanitization layers

## Framework-Specific Rules
- Use Express.js for routing and middleware
- Implement proper validation using Joi, Yup, or Zod
- Use Helmet for security headers
- Implement rate limiting and CORS
- Use compression middleware for performance
- Implement proper session management
- Use middleware for authentication and authorization
- Implement proper API versioning
- Use OpenAPI/Swagger for API documentation

## File Structure
- Routes in \`/src/routes/\`
- Controllers in \`/src/controllers/\`
- Services in \`/src/services/\`
- Models in \`/src/models/\`
- Middleware in \`/src/middleware/\`
- Utilities in \`/src/utils/\`
- Configuration in \`/src/config/\`
- Database in \`/src/database/\`
- Types in \`/src/types/\` (if using TypeScript)

## Database Best Practices
- Use connection pooling for database connections
- Implement proper indexing strategies
- Use migrations for database schema changes
- Implement database transaction handling
- Use ORMs/ODMs judiciously (Prisma, TypeORM, Mongoose)
- Implement proper database error handling
- Use database constraints and validations
- Implement soft deletes where appropriate

## Security Best Practices
- Implement proper authentication (JWT, OAuth2)
- Use HTTPS in production
- Sanitize and validate all inputs
- Implement proper CORS configuration
- Use secure HTTP headers (Helmet)
- Implement rate limiting and throttling
- Use environment variables for secrets
- Implement proper session management
- Use security-focused linting rules

## Performance Optimization
- Implement caching strategies (Redis, Memcached)
- Use clustering for multi-core utilization
- Implement proper connection pooling
- Use compression middleware
- Optimize database queries
- Implement request/response logging
- Use APM tools for monitoring
- Implement graceful shutdowns

## Error Handling
- Implement global error handling middleware
- Use proper HTTP status codes
- Log errors with context information
- Implement proper error responses
- Use custom error classes
- Handle both synchronous and asynchronous errors
- Implement circuit breaker patterns for external services

## Testing Preferences
- Use Jest for unit testing
- Use Supertest for API testing
- Mock external dependencies
- Test error scenarios and edge cases
- Aim for comprehensive test coverage
- Use test containers for integration tests
- Implement contract testing
- Use load testing for performance validation`,
        tags: ['nodejs', 'express', 'backend', 'api', 'rest', 'security', 'performance', 'architecture'],
        popularity: 88,
        lastUpdated: new Date('2025-07-14'),
        author: 'nodejs_team'
      },
      {
        id: '4',
        name: 'Java Spring Boot Microservices',
        category: 'Backend Framework',
        language: 'Java',
        framework: 'Spring Boot',
        description: 'Comprehensive guidelines for building enterprise-grade microservices with Spring Boot',
        content: `# Java Spring Boot Microservices Guidelines

## Project Context
This is a Java-based microservices architecture using Spring Boot, Spring Cloud, and modern Java practices for building scalable, resilient, and maintainable enterprise applications.

## Coding Standards
- Use Java 17+ with modern language features (records, sealed classes, pattern matching)
- Follow Oracle Java Code Conventions and Google Java Style Guide
- Use meaningful variable and method names with clear intent
- Implement proper exception handling with custom exceptions
- Use builder patterns for complex object creation
- Follow SOLID principles and clean code practices
- Use Lombok judiciously to reduce boilerplate
- Implement proper equals, hashCode, and toString methods
- Use Optional for null safety
- Follow package naming conventions (com.company.domain.subdomain)

## Architecture Guidelines
- Implement Domain-Driven Design (DDD) principles
- Use hexagonal architecture (ports and adapters)
- Follow microservices patterns (Circuit Breaker, Bulkhead, Timeout)
- Implement event-driven architecture with message brokers
- Use CQRS (Command Query Responsibility Segregation) where appropriate
- Implement proper service boundaries and bounded contexts
- Use API Gateway for external communication
- Implement service mesh for inter-service communication
- Follow 12-factor app methodology
- Use containerization with Docker and orchestration with Kubernetes

## Framework-Specific Rules
- Use Spring Boot 3.x with Spring Framework 6.x
- Leverage Spring Boot Auto-Configuration
- Use Spring Data JPA for database operations
- Implement Spring Security for authentication and authorization
- Use Spring Cloud for microservices patterns
- Implement Spring Boot Actuator for monitoring and health checks
- Use Spring WebFlux for reactive programming when needed
- Leverage Spring Boot Configuration Properties
- Use Spring Profiles for environment-specific configurations
- Implement Spring Boot Testing annotations and utilities

## Microservices Patterns
- Implement API Gateway pattern (Spring Cloud Gateway)
- Use Service Discovery (Eureka, Consul)
- Implement Circuit Breaker (Resilience4j, Hystrix)
- Use Load Balancing (Ribbon, Spring Cloud LoadBalancer)
- Implement Distributed Tracing (Zipkin, Jaeger)
- Use Configuration Management (Spring Cloud Config)
- Implement Event Sourcing and CQRS patterns
- Use Saga pattern for distributed transactions
- Implement Bulkhead pattern for resource isolation
- Use Retry and Timeout patterns

## File Structure
\`\`\`
src/main/java/
├── com/company/service/
│   ├── application/
│   │   ├── service/           # Application services
│   │   ├── dto/               # Data Transfer Objects
│   │   └── usecase/           # Use case implementations
│   ├── domain/
│   │   ├── model/             # Domain entities
│   │   ├── repository/        # Domain repository interfaces
│   │   ├── service/           # Domain services
│   │   └── event/             # Domain events
│   ├── infrastructure/
│   │   ├── config/            # Configuration classes
│   │   ├── persistence/       # JPA repositories and entities
│   │   ├── messaging/         # Message producers/consumers
│   │   ├── external/          # External service clients
│   │   └── security/          # Security configurations
│   └── presentation/
│       ├── controller/        # REST controllers
│       ├── dto/               # Request/Response DTOs
│       └── exception/         # Exception handlers
\`\`\`

## Database Best Practices
- Use JPA/Hibernate with proper entity mappings
- Implement database migrations with Flyway or Liquibase
- Use connection pooling (HikariCP)
- Implement proper transaction management
- Use database per microservice pattern
- Implement eventual consistency for cross-service data
- Use read replicas for query optimization
- Implement proper indexing strategies
- Use database constraints and validations
- Consider event sourcing for audit trails

## Security Implementation
- Implement OAuth2/OpenID Connect for authentication
- Use JWT tokens with proper validation
- Implement method-level security with @PreAuthorize
- Use HTTPS/TLS for all communications
- Implement proper CORS configuration
- Use Spring Security for comprehensive security
- Implement rate limiting and throttling
- Use security headers and CSRF protection
- Implement proper secrets management (Vault, AWS Secrets Manager)
- Use mutual TLS (mTLS) for service-to-service communication

## Monitoring and Observability
- Implement structured logging with SLF4J and Logback
- Use distributed tracing (Spring Cloud Sleuth + Zipkin/Jaeger)
- Implement metrics collection (Micrometer + Prometheus)
- Use Spring Boot Actuator for health checks and metrics
- Implement centralized logging (ELK Stack, Fluentd)
- Use Application Performance Monitoring (APM) tools
- Implement business metrics and KPIs
- Use alerting and notification systems
- Implement log correlation with trace IDs

## Performance Optimization
- Use caching strategies (Redis, Caffeine, Hazelcast)
- Implement connection pooling and resource management
- Use reactive programming with WebFlux for high throughput
- Implement database query optimization
- Use CDN for static content delivery
- Implement proper JVM tuning
- Use asynchronous processing for non-blocking operations
- Implement proper thread pool management
- Use compression for API responses

## Resilience Patterns
- Implement Circuit Breaker pattern (Resilience4j)
- Use Bulkhead pattern for resource isolation
- Implement Retry with exponential backoff
- Use Timeout patterns for external calls
- Implement graceful degradation
- Use health checks and readiness probes
- Implement proper error handling and recovery
- Use dead letter queues for failed messages
- Implement idempotency for critical operations

## Testing Strategy
- Write unit tests with JUnit 5 and Mockito
- Use Spring Boot Test for integration testing
- Implement contract testing with Spring Cloud Contract
- Use TestContainers for integration tests with real databases
- Implement end-to-end testing with REST Assured
- Use ArchUnit for architecture testing
- Implement performance testing with JMeter or Gatling
- Use mutation testing for test quality assessment
- Aim for 80%+ code coverage with meaningful tests

## DevOps and Deployment
- Use Docker for containerization
- Implement CI/CD pipelines (Jenkins, GitLab CI, GitHub Actions)
- Use Kubernetes for orchestration
- Implement Infrastructure as Code (Terraform, Ansible)
- Use Helm charts for Kubernetes deployments
- Implement blue-green or canary deployments
- Use service mesh (Istio, Linkerd) for advanced traffic management
- Implement proper secrets management
- Use monitoring and alerting in production

## API Design
- Follow RESTful principles and HTTP semantics
- Use OpenAPI 3.0 for API documentation
- Implement proper versioning strategies
- Use consistent error response formats
- Implement proper pagination for list endpoints
- Use HATEOAS for hypermedia APIs
- Implement proper content negotiation
- Use appropriate HTTP status codes
- Implement API rate limiting and throttling

## Message-Driven Architecture
- Use Apache Kafka or RabbitMQ for messaging
- Implement event-driven communication between services
- Use proper message serialization (Avro, JSON)
- Implement message deduplication and idempotency
- Use dead letter topics for failed message processing
- Implement proper message ordering when required
- Use event sourcing for audit and replay capabilities
- Implement saga patterns for distributed transactions`,
        tags: ['java', 'spring-boot', 'microservices', 'backend', 'enterprise', 'distributed-systems', 'architecture', 'resilience'],
        popularity: 89,
        lastUpdated: new Date('2025-07-14'),
        author: 'java_enterprise_team'
      }
    ];

    return { prompts, copilotTemplates };
  }

  // Overrides the genId method to ensure that items always have an ID.
  // If the collection is empty, the method below returns the initial number (1).
  // if the collection is not empty, the method below returns the highest
  // item id + 1.
  genId(prompts: Prompt[]): string;
  genId(copilotTemplates: CopilotTemplate[]): string;
  genId(collection: any[]): string {
    if (!collection || collection.length === 0) {
      return '1';
    }
    return (Math.max(...collection.map((item) => Number(item.id))) + 1).toString();
  }
}
