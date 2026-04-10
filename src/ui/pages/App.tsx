import { type ParentComponent } from "solid-js";

const App: ParentComponent = (props) => {
  return (
    <div class="antialiased md:subpixel-antialiased">{props.children}</div>
  );
};

export default App;
