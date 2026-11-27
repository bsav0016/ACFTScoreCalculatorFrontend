// Local lint rules for screen-reader support (eslint-plugin-react-native-a11y does not support ESLint 9).
//
//   a11y/input-has-name      every <TextInput> sets accessibilityLabel (or accessibilityLabelledBy)
//   a11y/touchable-has-role  every <TouchableOpacity> / <Pressable> / <TouchableHighlight> sets accessibilityRole
//
// A control that spreads props ({...props}) is trusted to pass them through. Disable a rule for one element with
// `// eslint-disable-next-line a11y/touchable-has-role` and a reason.
const attributeNames = (node) => node.attributes.filter(a => a.type === 'JSXAttribute').map(a => a.name.name);
const hasSpread = (node) => node.attributes.some(a => a.type === 'JSXSpreadAttribute');

const elementRule = (tags, anyOf, message) => ({
  meta: { type: 'problem', schema: [] },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type !== 'JSXIdentifier' || !tags.includes(node.name.name)) return;
        if (hasSpread(node)) return;
        if (attributeNames(node).some(name => anyOf.includes(name))) return;
        context.report({ node, message: message.replace('{tag}', node.name.name) });
      },
    };
  },
});

module.exports = {
  rules: {
    'input-has-name': elementRule(['TextInput'], ['accessibilityLabel', 'accessibilityLabelledBy'],
      '<{tag}> needs an accessibilityLabel so a screen reader can name it.'),
    'touchable-has-role': elementRule(['TouchableOpacity', 'Pressable', 'TouchableHighlight'], ['accessibilityRole', 'role'],
      '<{tag}> needs an accessibilityRole (usually "button") so a screen reader announces it as a control.'),
  },
};
