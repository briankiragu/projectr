/* @refresh reload */
import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';

// Import global styles.
import './index.css';

// Import components.
const App = lazy(() => import('./App'));
const LyricsProjectionCard = lazy(
  () => import('./ui/cards/LyricsProjectionCard')
);

// Get the root element
const root = document.getElementById('root');

render(
  () => (
    <Router>
      <Route path="/" component={App} />
      <Route path="/project" component={LyricsProjectionCard} />
    </Router>
  ),
  root!
);
