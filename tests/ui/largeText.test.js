import React from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import { act, render, screen } from '@testing-library/react-native';
import { MAX_FONT_SCALE, Text, TextInput } from '../../components/text';
import { CompactInput, EventRow, Field, InputRow } from '../../components/ui';

jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn(async () => null), setItemAsync: jest.fn(), deleteItemAsync: jest.fn() }));
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-store-review', () => ({ isAvailableAsync: jest.fn(async () => false), requestReview: jest.fn() }));
jest.mock('expo-tracking-transparency', () => ({ requestTrackingPermissionsAsync: jest.fn(async () => ({})) }));
jest.mock('../../components/ACFTBannerAd', () => () => null);
jest.mock('../../components/errorReporting', () => ({ reportError: jest.fn(), reportOnce: jest.fn() }));

const AFTCalculator = require('../../components/Calculator/aftCalculator').default;
const AFTPlanner = require('../../components/Calculator/AFTPlanner').default;

const setFontScale = (fontScale) => act(() => {
  Dimensions.set({ window: { width: 390, height: 844, scale: 3, fontScale } });
});

afterEach(async () => { await setFontScale(1); });

const eventField = (overrides = {}) => ({
  key: 'deadlift', text: 'Deadlift', value: '', ph: '(in lbs)', onCT: () => {}, onSE: () => {}, onPress: () => {},
  visible: false, imagePath: 1, imageStyle: {}, score: 0, ...overrides,
});

describe('text scaling limit', () => {
  test('Text and TextInput stop growing at 2x', async () => {
    await render(<><Text>Hello</Text><TextInput accessibilityLabel="Name" /></>);
    expect(MAX_FONT_SCALE).toBe(2);
    expect(screen.getByText('Hello').props.maxFontSizeMultiplier).toBe(2);
    expect(screen.getByLabelText('Name').props.maxFontSizeMultiplier).toBe(2);
  });

  test('a caller can ask for a different limit', async () => {
    await render(<Text maxFontSizeMultiplier={1.2}>Tiny</Text>);
    expect(screen.getByText('Tiny').props.maxFontSizeMultiplier).toBe(1.2);
  });

  test('an input ref still reaches the input', async () => {
    const ref = React.createRef();
    await render(<TextInput ref={ref} accessibilityLabel="Name" />);
    expect(ref.current).toBeTruthy();
    expect(typeof ref.current.focus).toBe('function');
  });

  test('every piece of text on the calculator and planner is capped', async () => {
    await render(<AFTCalculator navigation={{ navigate: jest.fn() }} />);
    for (const element of screen.getAllByText(/\S/)) expect(element.props.maxFontSizeMultiplier).toBe(2);
    await screen.unmount();
    const route = { params: { age: 25, maleOrCombat: true, raws: { deadlift: 200, pushups: 20, sdc: 3, plank: 2, tmr: 17 } } };
    await render(<AFTPlanner route={route} navigation={{ navigate: jest.fn() }} />);
    for (const element of screen.getAllByText(/\S/)) expect(element.props.maxFontSizeMultiplier).toBe(2);
  });
});

describe('layout at large text', () => {
  const flat = (element) => StyleSheet.flatten(element.props.style) || {};

  test('at normal size an input row keeps label, inputs and score side by side', async () => {
    await render(<InputRow label="Age"><CompactInput value="" onChangeText={() => {}} placeholder="17-99" /></InputRow>);
    const row = screen.getByPlaceholderText('17-99').parent.parent;
    expect(flat(row).flexDirection).toBe('row');
  });

  test('at 2x an input row stacks, and the input is still named', async () => {
    await setFontScale(2);
    await render(<InputRow label="Age"><CompactInput value="" onChangeText={() => {}} placeholder="17-99" /></InputRow>);
    const row = screen.getByPlaceholderText('17-99').parent.parent;
    expect(flat(row).flexDirection).toBe('column');
    expect(screen.getByPlaceholderText('17-99')).toHaveAccessibleName('Age');
  });

  test('at 2x a Field puts its input under the label at full width', async () => {
    await setFontScale(2);
    await render(<Field label="Target total" value="" onChangeText={() => {}} placeholder="500" />);
    const input = screen.getByPlaceholderText('500');
    expect(flat(input).width).toBeUndefined();
    expect(flat(input).alignSelf).toBe('stretch');
  });

  test('at normal size a Field keeps its 120-wide input', async () => {
    await render(<Field label="Target total" value="" onChangeText={() => {}} placeholder="500" />);
    expect(flat(screen.getByPlaceholderText('500')).width).toBe(120);
  });

  test('at 2x the score button is still there and reads the same', async () => {
    await setFontScale(2);
    await render(<EventRow field={eventField({ value: '340', score: 84 })} />);
    expect(screen.getByRole('button')).toHaveAccessibleName('Deadlift score chart, 84 points');
    expect(screen.getByPlaceholderText('(in lbs)')).toHaveAccessibleName('Deadlift');
  });

  test('the calculator and the planner render at 1x and 2x with every input still named', async () => {
    for (const scale of [1, 2]) {
      await setFontScale(scale);
      await render(<AFTCalculator navigation={{ navigate: jest.fn() }} />);
      for (const name of ['Age', 'Deadlift', 'T push-ups', 'Sprint drag carry minutes', 'Two mile run seconds']) {
        expect(screen.getByLabelText(name)).toBeOnTheScreen();
      }
      await screen.unmount();
    }
  });
});

describe('segmented control and total bar at large text', () => {
  const { Segmented, TotalBar } = require('../../components/ui');
  const flat = (element) => StyleSheet.flatten(element.props.style) || {};
  const options = [{ value: true, label: 'Male / Combat MOS' }, { value: false, label: 'Female non-combat' }];

  test('the segments sit side by side normally and stack at 2x', async () => {
    await render(<Segmented options={options} value={true} onChange={() => {}} />);
    expect(flat(screen.getByRole('button', { name: 'Male / Combat MOS' }).parent).flexDirection).toBe('row');
    await screen.unmount();
    await setFontScale(2);
    await render(<Segmented options={options} value={true} onChange={() => {}} />);
    expect(flat(screen.getByRole('button', { name: 'Male / Combat MOS' }).parent).flexDirection).toBe('column');
  });

  test('the total and its buttons share a line normally and stack at 2x, with every button kept', async () => {
    const bar = <TotalBar total={350} max={500} canSave canShare onSave={() => {}} onClear={() => {}} onShare={() => {}} />;
    await render(bar);
    const normal = flat(screen.getByText('TOTAL SCORE').parent.parent).flexDirection;
    await screen.unmount();
    await setFontScale(2);
    await render(bar);
    expect(normal).toBe('row');
    expect(flat(screen.getByText('TOTAL SCORE').parent.parent).flexDirection).toBe('column');
    for (const name of ['Clear', 'Share', 'Save score']) expect(screen.getByRole('button', { name })).toBeOnTheScreen();
  });
});
