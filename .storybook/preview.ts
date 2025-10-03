import type { Preview } from '@storybook/react-vite'
import '../src/styles/tokens.css';
import '../src/styles/globals.css';

// Si tienes ThemeProvider y deseas envolver todas las stories:
// import { ThemeProvider } from '../src/app/providers/ThemeProvider';
// const withTheme = (Story) => (
//   <ThemeProvider>
//     <Story />
//   </ThemeProvider>
// );

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
  // decorators: [withTheme],
};

export default preview;