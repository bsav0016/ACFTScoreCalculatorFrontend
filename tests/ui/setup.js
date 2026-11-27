// Runs before every component test. Adds Testing Library's accessibility matchers (toHaveAccessibleName, ...).
import { expect } from '@jest/globals';
import * as matchers from '@testing-library/react-native/matchers';

expect.extend(matchers);
