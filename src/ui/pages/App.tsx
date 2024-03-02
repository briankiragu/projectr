import { type Component } from 'solid-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App: Component = ({ children }: any) => {
  return <div class="antialiased md:subpixel-antialiased">{children}</div>;
};

export default App;
