import React from 'react';
import { render, screen, within } from '@testing-library/react-native';

// Whole-screen audits: every text input has a name, every button has a name. A new unlabelled control on one of these
// screens fails here. The phone-only pieces (secure storage, ads, tracking prompt, store review) are mocked.
jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn(async () => null), setItemAsync: jest.fn(), deleteItemAsync: jest.fn() }));
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-store-review', () => ({ isAvailableAsync: jest.fn(async () => false), requestReview: jest.fn() }));
jest.mock('expo-tracking-transparency', () => ({ requestTrackingPermissionsAsync: jest.fn(async () => ({})) }));
jest.mock('../../components/ACFTBannerAd', () => () => null);
jest.mock('../../components/errorReporting', () => ({ reportError: jest.fn(), reportOnce: jest.fn() }));

const AFTCalculator = require('../../components/Calculator/aftCalculator').default;
const AFTPlanner = require('../../components/Calculator/AFTPlanner').default;

const navigation = { navigate: jest.fn() };

// Every TextInput, shown or hidden from the accessibility tree, must have a non-empty accessibilityLabel.
function unnamedInputs() {
  return screen.getAllByDisplayValue(/^/, { includeHiddenElements: true })
    .filter(input => !(input.props.accessibilityLabel || '').trim())
    .map(input => input.props.placeholder || '(no placeholder)');
}

function unnamedButtons() {
  return screen.getAllByRole('button').filter(button => {
    const name = button.props.accessibilityLabel || '';
    if (name.trim()) return false;
    return within(button).queryAllByText(/\S/).length === 0;
  }).length;
}

describe('AFT calculator screen', () => {
  test('every text input has a name', async () => {
    await render(<AFTCalculator navigation={navigation} />);
    expect(unnamedInputs()).toEqual([]);
  });

  test('the inputs are named for what goes in them', async () => {
    await render(<AFTCalculator navigation={navigation} />);
    for (const name of ['Age', 'Deadlift', 'T push-ups', 'Sprint drag carry minutes', 'Sprint drag carry seconds',
      'Plank minutes', 'Plank seconds', 'Two mile run minutes', 'Two mile run seconds']) {
      expect(screen.getByLabelText(name)).toBeOnTheScreen();
    }
  });

  test('every button has a name', async () => {
    await render(<AFTCalculator navigation={navigation} />);
    expect(unnamedButtons()).toBe(0);
  });

  test('the goal planner and alternate events links are buttons', async () => {
    await render(<AFTCalculator navigation={navigation} />);
    expect(screen.getByRole('button', { name: 'Goal planner' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Alternate events' })).toBeOnTheScreen();
    expect(screen.getByRole('button', { name: 'Which MOS count as combat?' })).toBeOnTheScreen();
  });
});

describe('Goal planner screen', () => {
  const route = {
    params: { age: 25, maleOrCombat: true, raws: { deadlift: 200, pushups: 20, sdc: 3, plank: 2, tmr: 17 } },
  };

  test('every text input has a name', async () => {
    await render(<AFTPlanner route={route} navigation={navigation} />);
    expect(unnamedInputs()).toEqual([]);
    expect(screen.getByLabelText('Target total')).toBeOnTheScreen();
  });

  test('every button has a name, and the quick targets say what they set', async () => {
    await render(<AFTPlanner route={route} navigation={navigation} />);
    expect(unnamedButtons()).toBe(0);
    expect(screen.getAllByRole('button', { name: /^Set target to \d+, plus (25|50) points$/ })).toHaveLength(2);
  });

  test('the section titles are headings', async () => {
    await render(<AFTPlanner route={route} navigation={navigation} />);
    expect(screen.getByRole('header', { name: 'Your goal' })).toBeOnTheScreen();
  });
});
