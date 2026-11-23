import './styles/main.css';
import './styles/lesson.css';
import 'katex/dist/katex.min.css';
import { mountSharedLayout } from './lib/shared-layout.js';
import { renderLesson } from './lib/lesson-renderer.js';
import { setupHashTabs } from './lib/tabs.js';
import lesson from './data/lessons/polygon-vocabulary.json';
import { mountPolygonExplorer } from './sims/polygon-vocabulary.js';

mountSharedLayout();
renderLesson(lesson);
setupHashTabs(document.querySelector('#shape-tabs'));
mountPolygonExplorer();
