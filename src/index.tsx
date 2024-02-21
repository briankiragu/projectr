/* @refresh reload */
import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';

// Import global styles.
import './index.css';

// Import components.
const App = lazy(() => import('./App'));
const Project = lazy(() => import('./pages/Project'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Get the root element
const root = document.getElementById('root');

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Dashboard} />
      <Route path="/project" component={Project} />
    </Router>
  ),
  root!
);
