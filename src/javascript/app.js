import { createFighters } from './components/fightersView';
import { fighterService } from './services/fightersService';
import { startSoundHandler } from './helpers/soundHandler';

class App {
  constructor() {
    this.startApp();
  }

  static rootElement = document.getElementById('root');
  static loadingElement = document.getElementById('loading-overlay');

  async startApp() {
    try {
      App.loadingElement.style.visibility = 'visible';

      const fighters = await fighterService.getFighters();
      const fightersElement = createFighters(fighters);

      App.rootElement.appendChild(fightersElement);
      startSoundHandler('../../../resources/sounds/background.mp3');
    } catch (error) {
      console.warn(error);
      App.rootElement.innerText = 'Failed to load data';
    } finally {
      App.loadingElement.style.visibility = 'hidden';
    }
  }
}

export default App;
