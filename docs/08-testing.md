# Testing Strategy

MesaFácil uses the following tools for testing and quality assurance:

## Tools

*   **Unit & Component Testing:** Vitest (`@vitest/browser`, `@vitest/coverage-v8`).
*   **E2E Testing:** Playwright.
*   **UI Component Explorer:** Storybook.

## Guidelines

1.  **Component Tests:** Write tests for reusable components in `src/components/`. Ensure edge cases for `FormGenerator` are covered.
2.  **API Mocking:** When testing components connected to RTK Query, mock the API responses or use a mock store wrapper.
3.  **Visual Regression:** Use Storybook to document and visually test UI components.
4.  **E2E:** Critical user flows (e.g., Login, Creating an order) should be covered by Playwright tests.
