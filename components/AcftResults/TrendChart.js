import { useState } from 'react';
import { View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';
import { colors } from '../theme';
import { AFT_MAX_TOTAL } from './progress';

const HEIGHT = 120;
const PAD = { top: 10, bottom: 10, left: 34, right: 12 };

// Line chart of AFT totals in the order they were taken. `series` is [{ id, total }], oldest first.
export default function TrendChart({ series }) {
  const [width, setWidth] = useState(0);
  if (series.length < 2) return null;

  const totals = series.map((p) => p.total);
  // Pad the axis a little around the data, clamped to the 0..500 range.
  const low = Math.max(0, Math.floor((Math.min(...totals) - 20) / 10) * 10);
  const high = Math.min(AFT_MAX_TOTAL, Math.ceil((Math.max(...totals) + 20) / 10) * 10);
  const span = Math.max(high - low, 1);
  const innerW = Math.max(width - PAD.left - PAD.right, 1);
  const innerH = HEIGHT - PAD.top - PAD.bottom;
  const x = (i) => PAD.left + (innerW * i) / (series.length - 1);
  const y = (value) => PAD.top + innerH * (1 - (value - low) / span);

  return (
    <View
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
      accessible
      accessibilityLabel={`Total score over your last ${series.length} tests, from ${totals[0]} to ${totals[totals.length - 1]}`}
    >
      {width > 0 && (
        <Svg width={width} height={HEIGHT}>
          {[low, high].map((value) => (
            <Line key={value} x1={PAD.left} x2={width - PAD.right} y1={y(value)} y2={y(value)} stroke={colors.border} strokeWidth={1} />
          ))}
          {[low, high].map((value) => (
            <SvgText key={`t${value}`} x={PAD.left - 6} y={y(value) + 4} fontSize={11} fill={colors.textMuted} textAnchor="end">
              {value}
            </SvgText>
          ))}
          <Polyline
            points={series.map((p, i) => `${x(i)},${y(p.total)}`).join(' ')}
            fill="none"
            stroke={colors.gold}
            strokeWidth={2}
          />
          {series.map((p, i) => (
            <Circle key={p.id} cx={x(i)} cy={y(p.total)} r={4} fill={colors.gold} />
          ))}
        </Svg>
      )}
    </View>
  );
}
