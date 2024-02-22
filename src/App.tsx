import { type Component } from 'solid-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App: Component = ({ children }: any) => {
  return <div class="relative overflow-hidden">{children}</div>;
};

export default App;
