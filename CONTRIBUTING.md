# Contributing to AgriSense

Thank you for your interest in contributing to AgriSense! This document provides guidelines for contributing to the project.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Git
- Supabase account (for testing)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/agrisense.git
   cd agrisense
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env.local
   # Fill in your environment variables
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

### Component Structure
```typescript
// Component template
import React from 'react';
import { ComponentProps } from './types';

interface ComponentNameProps {
  // Define props
}

const ComponentName: React.FC<ComponentNameProps> = ({ prop1, prop2 }) => {
  // Component logic
  
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### Testing Requirements
- Write unit tests for new features
- Add integration tests for API calls
- Update existing tests when modifying features
- Maintain test coverage above 80%

### Documentation
- Update README.md for major changes
- Add JSDoc comments for new functions
- Update API documentation for new endpoints
- Include examples in documentation

## Pull Request Process

### Before Submitting
1. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes**
   - Write code following style guidelines
   - Add tests for new functionality
   - Update documentation

3. **Test Your Changes**
   ```bash
   npm run test
   npm run test:e2e
   npm run lint
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

### Submitting PR
1. **Push to Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**
   - Use descriptive title
   - Provide detailed description
   - Link related issues
   - Add screenshots for UI changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows style guidelines
   - [ ] Self-review completed
   - [ ] Documentation updated
   - [ ] Tests added/updated
   ```

## Issue Reporting

### Bug Reports
When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos if applicable
- Environment details (OS, browser, etc.)

### Feature Requests
For new features, provide:
- Clear description of the feature
- Use case and motivation
- Proposed implementation (if applicable)
- Alternatives considered

## Code Review Process

### Review Criteria
- Code quality and style
- Test coverage
- Documentation completeness
- Performance implications
- Security considerations

### Review Timeline
- Initial review within 2 business days
- Follow-up reviews within 1 business day
- Merge approval from maintainers

## Development Areas

### High Priority
- NASA API integration improvements
- Performance optimizations
- Mobile experience enhancements
- Testing coverage improvements

### Medium Priority
- New advisory features
- Community features
- Analytics and reporting
- Internationalization

### Low Priority
- UI/UX improvements
- Documentation updates
- Code refactoring
- Dependency updates

## Architecture Guidelines

### Frontend Architecture
- Use React functional components with hooks
- Implement proper state management
- Follow component composition patterns
- Use TypeScript for type safety

### Backend Integration
- Use Supabase for data persistence
- Implement proper error handling
- Follow RESTful API patterns
- Use environment variables for configuration

### Testing Strategy
- Unit tests for business logic
- Integration tests for API calls
- E2E tests for user flows
- Visual regression tests for UI

## Release Process

### Versioning
We use semantic versioning (MAJOR.MINOR.PATCH):
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

### Release Cycle
- Major releases: Quarterly
- Minor releases: Monthly
- Patch releases: As needed

### Release Checklist
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Version bumped
- [ ] Changelog updated
- [ ] Release notes prepared

## Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Follow professional communication

### Getting Help
- Check existing documentation
- Search closed issues
- Ask in discussions
- Contact maintainers

## Recognition

### Contributors
Contributors are recognized in:
- README.md contributors section
- Release notes
- Project documentation

### Maintainers
Maintainers are selected based on:
- Consistent contributions
- Code quality
- Community engagement
- Technical expertise

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

If you have questions about contributing:
- Open a discussion
- Contact maintainers
- Join our Discord community
- Check existing documentation

Thank you for contributing to AgriSense! 🌱
