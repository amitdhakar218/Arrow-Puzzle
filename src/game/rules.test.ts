import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkDirectionExit,
  tapTile,
  findFreeArrow,
  generate100Levels,
  ArrowTile,
  NEXT_CLOCKWISE_DIR,
} from './rules.ts';

test('checkDirectionExit correctly detects free paths vs blocked paths', () => {
  const arrows: ArrowTile[] = [
    {
      id: 1,
      row: 1,
      col: 1,
      direction: 'UP',
      type: 'STANDARD',
      color: '#38bdf8',
      isCleared: false,
    },
    {
      id: 2,
      row: 0,
      col: 1,
      direction: 'LEFT',
      type: 'STANDARD',
      color: '#f43f5e',
      isCleared: false,
    },
  ];

  // Arrow 1 points UP towards (0, 1) where Arrow 2 is situated -> should be blocked!
  const exitCheck1 = checkDirectionExit(arrows[0], 'UP', arrows, 3, 3);
  assert.equal(exitCheck1.canExit, false);
  assert.equal(exitCheck1.blockerId, 2);

  // Arrow 2 points LEFT towards (0, 0) and outside grid -> no obstacle -> canExit true!
  const exitCheck2 = checkDirectionExit(arrows[1], 'LEFT', arrows, 3, 3);
  assert.equal(exitCheck2.canExit, true);
});

test('tapTile clears an unblocked arrow and preserves remaining', () => {
  const arrows: ArrowTile[] = [
    {
      id: 1,
      row: 0,
      col: 0,
      direction: 'LEFT',
      type: 'STANDARD',
      color: '#38bdf8',
      isCleared: false,
    },
    {
      id: 2,
      row: 1,
      col: 1,
      direction: 'RIGHT',
      type: 'STANDARD',
      color: '#10b981',
      isCleared: false,
    },
  ];

  const { newArrows, result, isLevelCleared } = tapTile(1, arrows, 3, 3);
  assert.equal(result.canExit, true);
  assert.equal(result.exitingArrowId, 1);
  assert.equal(isLevelCleared, false);
  assert.equal(newArrows.find(a => a.id === 1)?.isCleared, true);
  assert.equal(newArrows.find(a => a.id === 2)?.isCleared, false);

  // Now tap arrow 2 -> level cleared!
  const step2 = tapTile(2, newArrows, 3, 3);
  assert.equal(step2.result.canExit, true);
  assert.equal(step2.isLevelCleared, true);
});

test('rotator arrows rotate clockwise when blocked', () => {
  const arrows: ArrowTile[] = [
    {
      id: 1,
      row: 1,
      col: 1,
      direction: 'UP',
      type: 'ROTATOR',
      color: '#8b5cf6',
      isCleared: false,
    },
    {
      id: 2,
      row: 0,
      col: 1,
      direction: 'UP',
      type: 'STANDARD',
      color: '#f43f5e',
      isCleared: false,
    },
  ];

  // Arrow 1 is pointing UP and blocked by Arrow 2
  const { newArrows, result } = tapTile(1, arrows, 3, 3);
  assert.equal(result.canExit, false);
  assert.equal(result.rotatedTo, 'RIGHT');

  const rotatedArrow = newArrows.find(a => a.id === 1);
  assert.equal(rotatedArrow?.direction, 'RIGHT');
  assert.equal(NEXT_CLOCKWISE_DIR['UP'], 'RIGHT');
});

test('generate100Levels creates all 100 levels with valid data and guaranteed first moves', () => {
  const levels = generate100Levels();
  assert.equal(levels.length, 100);

  // Check level 1
  assert.equal(levels[0].levelNumber, 1);
  assert.equal(levels[0].chapter, 1);
  assert.ok(levels[0].arrows.length >= 3);

  // Check level 100
  assert.equal(levels[99].levelNumber, 100);
  assert.equal(levels[99].chapter, 5);
  assert.ok(levels[99].arrows.length >= 25);

  // Every single level must have at least one legal free arrow to start!
  for (let i = 0; i < 100; i++) {
    const lvl = levels[i];
    const free = findFreeArrow(lvl.arrows, lvl.gridRows, lvl.gridCols);
    assert.ok(
      free !== null,
      `Level ${lvl.levelNumber} must have at least one free arrow at start`
    );
  }
});
