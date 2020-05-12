import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });

  if(fighter) {
    const fighterInfoPreview = createFighterInfoBlock(fighter, positionClassName);
    fighterElement.append(fighterInfoPreview);
  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}

function createFighterInfoBlock(fighter, positionClassName) {
  const icons = {
    attack: '🗡️',
    defense: '🛡️',
    health: '❤'
  };
  const infoElementWrapper = createElement({ tagName: 'div', className: 'fighter__info_wrapper' });
  const infoElementName = createElement({ tagName: 'h3', className: 'fighter__info_name' });
  const infoElementImageWrapper = createElement({ tagName: 'div', className: `fighter__info_image_wrapper ${positionClassName}` });
  const infoElementImage = createFighterImage(fighter);
  const infoElementTable = createElement({ tagName: 'table', className: 'fighter__info' });
  const infoElementRowKeys = createElement({ tagName: 'tr', className: 'fighter__info_row--keys' });
  const infoElementRowValues = createElement({ tagName: 'tr', className: 'fighter__info_row--values' });

  infoElementName.innerHTML = fighter.name || 'Fighter';
  infoElementImageWrapper.append(infoElementImage);
  Object.values(icons).forEach(icon => {
    const infoElementColumnKey = createElement({ tagName: 'th', className: 'fighter__info_column--key' });
    infoElementColumnKey.innerHTML = icon;
    infoElementRowKeys.append(infoElementColumnKey);
  });
  Object.keys(icons).forEach(key => {
    const infoElementColumnValue = createElement({ tagName: 'th', className: 'fighter__info_column--values' });
    infoElementColumnValue.innerHTML = fighter[key];
    infoElementRowValues.append(infoElementColumnValue)
  });

  infoElementWrapper.append(infoElementName);
  infoElementWrapper.append(infoElementImageWrapper);
  infoElementTable.append(infoElementRowKeys);
  infoElementTable.append(infoElementRowValues);
  infoElementWrapper.append(infoElementTable);

  return infoElementWrapper;
}
