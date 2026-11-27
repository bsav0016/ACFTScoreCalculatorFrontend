import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { EventRow, Field, InputRow, CompactInput, LabeledInput, SectionLabel } from '../../components/ui';

// The names a screen reader reads for the shared inputs. Every screen is built from these, so a control that loses its
// name here loses it everywhere.

const eventField = (overrides = {}) => ({
  key: 'deadlift', text: 'Deadlift', value: '', ph: '(in lbs)', onCT: () => {}, onSE: () => {}, onPress: () => {},
  visible: false, imagePath: 1, imageStyle: {}, score: 0, ...overrides,
});

describe('Field', () => {
  test('the input is named by its label', async () => {
    await render(<Field label="Target total" value="" onChangeText={() => {}} placeholder="600" />);
    expect(screen.getByLabelText('Target total')).toBeOnTheScreen();
    expect(screen.getByPlaceholderText('600')).toHaveAccessibleName('Target total');
  });

  test('the visible label is not read a second time', async () => {
    await render(<Field label="Age" value="" onChangeText={() => {}} />);
    expect(screen.queryByText('Age')).toBeNull();
    expect(screen.getByText('Age', { includeHiddenElements: true })).toBeTruthy();
  });

  test('an error is announced as an alert and is the input hint', async () => {
    await render(<Field label="Age" value="3" onChangeText={() => {}} error="Enter an age from 17 to 99" />);
    expect(screen.getByRole('alert')).toHaveTextContent('Enter an age from 17 to 99');
    expect(screen.getByLabelText('Age').props.accessibilityHint).toBe('Enter an age from 17 to 99');
  });

  test('without an error there is no hint and no alert', async () => {
    await render(<Field label="Age" value="30" onChangeText={() => {}} />);
    expect(screen.queryByRole('alert')).toBeNull();
    expect(screen.getByLabelText('Age').props.accessibilityHint).toBeUndefined();
  });
});

describe('LabeledInput', () => {
  test('the input is named by its label', async () => {
    await render(<LabeledInput label="Username" value="" onChangeText={() => {}} />);
    expect(screen.getByLabelText('Username')).toBeOnTheScreen();
  });

  test('a caller can still give the input its own name', async () => {
    await render(<LabeledInput label="Password" accessibilityLabel="Your password" value="" onChangeText={() => {}} />);
    expect(screen.getByLabelText('Your password')).toBeOnTheScreen();
  });
});

describe('InputRow and CompactInput', () => {
  test('the input is named by the row label', async () => {
    await render(<InputRow label="Age"><CompactInput value="" onChangeText={() => {}} placeholder="17-99" /></InputRow>);
    expect(screen.getByPlaceholderText('17-99')).toHaveAccessibleName('Age');
  });

  test('a row with a chart exposes one control for it, not two', async () => {
    await render(<EventRow field={eventField()} />);
    expect(screen.getAllByRole('button')).toHaveLength(1);
  });
});

describe('EventRow', () => {
  test('a single-value event has one named input', async () => {
    await render(<EventRow field={eventField()} />);
    expect(screen.getByPlaceholderText('(in lbs)')).toHaveAccessibleName('Deadlift');
  });

  test('a timed event names minutes and seconds, using the spoken event name', async () => {
    await render(<EventRow field={eventField({ text: 'SDC', spoken: 'Sprint drag carry', ph: 'Minutes', key2: 'sdcSec', value2: '', onCT2: () => {}, onSE2: () => {} })} />);
    expect(screen.getByPlaceholderText('Minutes')).toHaveAccessibleName('Sprint drag carry minutes');
    expect(screen.getByPlaceholderText('Seconds')).toHaveAccessibleName('Sprint drag carry seconds');
  });

  test('the score button says what the event scored once something is entered', async () => {
    await render(<EventRow field={eventField({ value: '340', score: 84 })} />);
    expect(screen.getByRole('button')).toHaveAccessibleName('Deadlift score chart, 84 points');
  });

  test('the score button does not claim a score before anything is entered', async () => {
    await render(<EventRow field={eventField({ score: 0 })} />);
    expect(screen.getByRole('button')).toHaveAccessibleName('Deadlift score chart');
  });
});

describe('SectionLabel', () => {
  test('is a heading', async () => {
    await render(<SectionLabel>More</SectionLabel>);
    expect(screen.getByRole('header')).toHaveTextContent('More');
  });
});
