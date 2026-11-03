import { Linking, Text, TouchableOpacity } from 'react-native';
import { Card } from './ui';
import { colors, font, space } from './theme';
import { DISCLAIMER } from './sources';

// "Sources" card for a screen: each source opens in the browser. `sources` are entries from ./sources.
export default function SourceNote({ sources, disclaimer = true }) {
  return (
    <Card>
      <Text style={font.heading}>Sources</Text>
      {sources.map((src) => (
        <TouchableOpacity key={src.url} onPress={() => Linking.openURL(src.url)} accessibilityRole="link"
          style={{ marginTop: space.sm }}>
          <Text style={{ color: colors.gold, fontSize: 14, textDecorationLine: 'underline' }}>{src.title}</Text>
          <Text style={font.caption}>{src.publisher}</Text>
        </TouchableOpacity>
      ))}
      {disclaimer && <Text style={[font.caption, { marginTop: space.md }]}>{DISCLAIMER}</Text>}
    </Card>
  );
}
