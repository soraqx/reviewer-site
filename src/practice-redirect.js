import './styles/main.css';
import { mountSharedLayout } from './lib/shared-layout.js';

mountSharedLayout();

const current = new URL(window.location.href);
const quizStateKeys = ['module', 'category', 'mode', 'run', 'result'];
const hasQuizState = quizStateKeys.some((key) => current.searchParams.has(key));
const target = new URL(hasQuizState ? '/quiz/' : '/gallery/', current.origin);

for (const [key, value] of current.searchParams) {
  target.searchParams.set(key, value);
}
target.hash = current.hash;

window.location.replace(target.toString());
