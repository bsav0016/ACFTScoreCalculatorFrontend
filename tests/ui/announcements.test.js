import React from 'react';
import { AccessibilityInfo } from 'react-native';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('expo-secure-store', () => ({ getItemAsync: jest.fn(async () => null), setItemAsync: jest.fn(), deleteItemAsync: jest.fn() }));
jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('expo-store-review', () => ({ isAvailableAsync: jest.fn(async () => false), requestReview: jest.fn() }));
jest.mock('expo-tracking-transparency', () => ({ requestTrackingPermissionsAsync: jest.fn(async () => ({})) }));
jest.mock('../../components/ACFTBannerAd', () => () => null);
jest.mock('../../components/errorReporting', () => ({ reportError: jest.fn(), reportOnce: jest.fn() }));

const AFTCalculator = require('../../components/Calculator/aftCalculator').default;
const { SETTLE_MS } = require('../../components/Calculator/useScoreAnnouncements');

let screenReaderOn;
let announce;

beforeEach(() => {
  jest.useFakeTimers();
  screenReaderOn = true;
  jest.spyOn(AccessibilityInfo, 'isScreenReaderEnabled').mockImplementation(async () => screenReaderOn);
  announce = jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {});
  // jest-expo already makes this a mock, so restoreAllMocks does not clear its calls between tests.
  announce.mockClear();
});

afterEach(async () => {
  await cleanup();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

const settle = () => act(async () => { jest.advanceTimersByTime(SETTLE_MS + 50); });
const type = (label, text) => fireEvent.changeText(screen.getByLabelText(label), text);

describe('calculator announcements', () => {
  test('says the score once typing settles, not on each keystroke', async () => {
    await render(<AFTCalculator navigation={{ navigate: jest.fn() }} />);
    await type('Age', '25');
    await type('Deadlift', '3');
    await act(async () => { jest.advanceTimersByTime(500); });
    await type('Deadlift', '34');
    await act(async () => { jest.advanceTimersByTime(500); });
    await type('Deadlift', '340');
    expect(announce).not.toHaveBeenCalled();
    await settle();
    expect(announce).toHaveBeenCalledTimes(1);
    expect(announce.mock.calls[0][0]).toMatch(/^Deadlift \d+ points?\.$/);
  });

  test('says nothing when no screen reader is on', async () => {
    screenReaderOn = false;
    await render(<AFTCalculator navigation={{ navigate: jest.fn() }} />);
    await type('Age', '25');
    await type('Deadlift', '340');
    await settle();
    expect(announce).not.toHaveBeenCalled();
  });

  test('says nothing for an event the person has not touched, and the second event only adds itself', async () => {
    await render(<AFTCalculator navigation={{ navigate: jest.fn() }} />);
    await type('Age', '25');
    await type('Deadlift', '340');
    await settle();
    await type('T push-ups', '40');
    await settle();
    expect(announce).toHaveBeenCalledTimes(2);
    expect(announce.mock.calls[1][0]).toMatch(/^T push-ups \d+ points?\.$/);
  });
});
