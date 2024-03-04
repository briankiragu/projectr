import { type Component } from 'solid-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App: Component = (props: any) => {
  return <div class="antialiased md:subpixel-antialiased">{props.children}</div>;
};

export default App;
