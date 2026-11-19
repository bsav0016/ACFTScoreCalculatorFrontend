import { openLink } from '../components/openLink';

const make = (openURL) => ({ linking: { openURL }, notify: jest.fn() });

test('opens the link and says nothing when it works', async () => {
  const deps = make(jest.fn().mockResolvedValue(undefined));
  expect(await openLink('https://example.test/a', deps)).toBe(true);
  expect(deps.linking.openURL).toHaveBeenCalledWith('https://example.test/a');
  expect(deps.notify).not.toHaveBeenCalled();
});

test('when the phone cannot open it, tells the person where to find it instead of throwing', async () => {
  const deps = make(jest.fn().mockRejectedValue(new Error('Unable to open URL: https://example.test/a')));
  await expect(openLink('https://example.test/a', { ...deps, what: 'the privacy policy' })).resolves.toBe(false);
  expect(deps.notify).toHaveBeenCalledTimes(1);
  expect(deps.notify.mock.calls[0][0]).toContain("Couldn't open the privacy policy");
  expect(deps.notify.mock.calls[0][0]).toContain('https://example.test/a');
});

test('a mail link shows the address without mailto:', async () => {
  const deps = make(jest.fn().mockRejectedValue(new Error('no mail app')));
  await openLink('mailto:me@example.test', { ...deps, what: 'your mail app' });
  expect(deps.notify.mock.calls[0][0]).toContain('me@example.test');
  expect(deps.notify.mock.calls[0][0]).not.toContain('mailto:');
});
