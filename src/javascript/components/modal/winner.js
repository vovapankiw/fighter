import App from '../../app';
import { showModal } from './modal';
import { createElement } from '../../helpers/domHelper';
import { stopSoundHandler } from '../../helpers/soundHandler';

export function showWinnerModal(fighter) {
  // call showModal function
  const bodyElement = createElement({ tagName: 'div',  className: 'body-element' });
  const bodyElementName = createElement({ tagName: 'p',  className: 'body-element_name' });
  const bodyElementHealth = createElement({ tagName: 'p',  className: 'body-element_health' });
  const bodyElementDefense =  createElement({ tagName: 'p',  className: 'body-element_defense' });
  const bodyElementAttack =  createElement({ tagName: 'p',  className: 'body-element_attack' });

  bodyElementName.innerHTML = `name: ${fighter.name}`;
  bodyElementHealth.innerHTML = `health: ${fighter.health}`;
  bodyElementDefense.innerHTML = `defense: ${fighter.defense}`;
  bodyElementAttack.innerHTML = `attack: ${fighter.attack}`;

  bodyElement.prepend(bodyElementDefense);
  bodyElement.prepend(bodyElementAttack);
  bodyElement.prepend(bodyElementHealth);
  bodyElement.prepend(bodyElementName);

  showModal({
    title: 'Winner',
    bodyElement,
    onClose: () => {
      App.rootElement.innerHTML = '';
      stopSoundHandler();
      new App();
    }
  })
}
