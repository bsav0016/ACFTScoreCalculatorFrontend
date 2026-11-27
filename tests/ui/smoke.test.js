import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import Button from '../../components/Button';
import { Field } from '../../components/ui';

describe('component test harness', () => {
  test('a Button renders its title and reports presses', async () => {
    const onPress = jest.fn();
    await render(<Button title="Calculate" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Calculate' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('a Field renders its label and reports typing', async () => {
    const onChangeText = jest.fn();
    await render(<Field label="Age" value="" onChangeText={onChangeText} placeholder="Years" />);
    expect(screen.getByLabelText('Age')).toBeTruthy();
    await fireEvent.changeText(screen.getByPlaceholderText('Years'), '29');
    expect(onChangeText).toHaveBeenCalledWith('29');
  });
});
