import { controls } from '../../constants/controls';
import { startSoundHandler } from '../helpers/soundHandler';

export async function fight(first, second) {
  const firstFighter = {...first};
  const secondFighter = {...second};
  const keyMap = {};
  const criticalHitOption = {
    disabledForFirst: false,
    disabledForSecond: false
  };
  const healthBar = {
    first: document.querySelector('#left-fighter-indicator' ),
    second: document.querySelector('#right-fighter-indicator')
  };

  return new Promise((resolve) => {
    const getHit = (e) => fightControls(e, resolve, firstFighter, secondFighter, keyMap, healthBar, criticalHitOption);
    const updateHoldingKeys = (e) => updateReleasedKey(e, keyMap);

    document.addEventListener('keydown', getHit, false);
    document.addEventListener('keyup',updateHoldingKeys, false );
  });
}

export function getDamage(attacker, defender, isCritical = false) {
  const hitPower = isCritical ? 2 * getHitPower(attacker): getHitPower(attacker);
  const value  = hitPower - getBlockPower(defender);

  return value > 0 ? value : 0;
}

export function getHitPower(fighter) {
  const { attack } = fighter;
  const criticalHitChance = randomNum(1, 2);

  return attack * criticalHitChance;
}

export function getBlockPower(fighter) {
  const { defense } = fighter;
  const dodgeChance = randomNum(1, 2);

  return defense * dodgeChance
}

function randomNum(max, min) {
  return Math.random() * (max - min) + min;
}

function updateReleasedKey(e, keyMap) {
  keyMap[e.code] = false;
}

function updatePressedKey(e, keyMap) {
  keyMap[e.code] = true;
}

function fightControls (e, resolve, first, second, keyMap, healthBar, criticalHitOption) {
  updatePressedKey(e, keyMap);

  // Finish game if one of players has health <= 0
  if(first.health <= 0 || second.health <= 0) {
    finishGame(first, second, resolve);
    return;
  }
  // sound of the fight
  startSoundHandler('../../../resources/sounds/punch.mp3');

  // Check if someone made super hit
  const { fighterOneHit, fighterTwoHit } = isSuperHit(keyMap);

  if((fighterOneHit || fighterTwoHit) && isSuperHitAllowed(criticalHitOption, keyMap)) {
    const { attacker, defender, bar } = superHit(e, keyMap, first, second, healthBar);
    updateFighterHealth(attacker, defender, bar, true);

    return;
  }

  // Handle attack
  switch (e.code) {
    case controls.PlayerOneAttack:
      if(isInBlock(e.code, keyMap)){  // second in block
        return;
      } else {
        updateFighterHealth(first, second, healthBar['second'], false);
      }

      break;
    case controls.PlayerTwoAttack:
      if(isInBlock(e.code, keyMap)){  // first in block
        return;
      } else {
        updateFighterHealth(second, first, healthBar['first'], false);
      }
      break;
  }
}

function isInBlock(code, keyMap) {
  const { PlayerOneAttack, PlayerTwoAttack, PlayerOneBlock, PlayerTwoBlock } = controls;

  if(code === PlayerOneAttack) {
    return keyMap[PlayerTwoBlock] ||  keyMap[PlayerOneBlock];
  } else if (code === PlayerTwoAttack) {
    return keyMap[PlayerOneBlock] || keyMap[PlayerTwoBlock];
  }

  return false;
}

function updateFighterHealth(attacker, defender, defenderHealthBar, isCritical) {
  defender.health = defender.health - getDamage(attacker, defender, isCritical);
  defenderHealthBar.style.width = defender.health + '%';
}

function isSuperHit(keyMap) {
  const fighterOneHit = controls.PlayerOneCriticalHitCombination.filter(key => keyMap[key]).length === 3;
  const fighterTwoHit = controls.PlayerTwoCriticalHitCombination.filter(key => keyMap[key]).length === 3;

  return {
    fighterOneHit,
    fighterTwoHit,
  }
}

function isSuperHitAllowed(criticalHitOption, keyMap) {
  const { fighterOneHit, fighterTwoHit } = isSuperHit(keyMap);

  if(criticalHitOption.disabledForFirst && fighterOneHit) {
    return false;
  }

  if(criticalHitOption.disabledForSecond && fighterTwoHit) {
    return false;
  }

  if(fighterOneHit) {
    criticalHitOption.disabledForFirst = true;
    setTimeout(() => {
      criticalHitOption.disabledForFirst = false;
    }, 10000);
  } else if(fighterTwoHit) {
    criticalHitOption.disabledForSecond = true;
    setTimeout(() => {
      criticalHitOption.disabledForSecond = false;
    }, 10000);
  }

  return true;
}

function superHit(e, keyMap, first, second, healthBar) {
  const { fighterOneHit, fighterTwoHit } = isSuperHit(keyMap);

  return {
    isSuperHit: fighterOneHit || fighterTwoHit,
    attacker: fighterOneHit ?  first : second,
    defender: fighterOneHit ?  second : first,
    bar: fighterOneHit ?  healthBar['second'] : healthBar['first'],
  }
}

function finishGame(first, second, resolve) {
  const winner = first.health <= 0 ? second : first;
  document.removeEventListener('keydown', fightControls);
  document.removeEventListener('keyup', updatePressedKey);
  resolve(winner);
}