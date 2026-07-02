import React, { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { Glyph } from '../components/Glyph';
import { Icon } from '../components/Icon';
import { PlayButton } from '../components/PlayButton';
import { Screen } from '../components/ui';
import { Consonant, CONSONANTS, SERIES, SERIES_ORDER, VOWELS } from '../data/khmer';
import { DISPLAY, MONO, UI } from '../theme/fonts';
import { useTheme } from '../theme/ThemeContext';
import { ScreenProps } from '../navigation/types';

function gridCols(contentW: number, min: number, gap: number) {
  const cols = Math.max(2, Math.floor((contentW + gap) / (min + gap)));
  const tileW = (contentW - gap * (cols - 1)) / cols;
  return { cols, tileW };
}

function Tile({ c, tileW, onPress }: { c: Consonant; tileW: number; onPress: () => void }) {
  const { c: col, sh } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        {
          width: tileW,
          backgroundColor: col.surface,
          borderWidth: 1,
          borderColor: pressed ? col.line2 : col.line,
          borderRadius: 14,
          paddingTop: 14,
          paddingBottom: 10,
          paddingHorizontal: 8,
          alignItems: 'center',
          gap: 7,
          overflow: 'hidden',
          transform: [{ translateY: pressed ? -3 : 0 }],
        },
        sh.sm,
      ]}
    >
      <View
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 3,
          backgroundColor: c.register === 'a' ? col.areg : col.oreg,
        }}
      />
      <Glyph size={40} scaled>
        {c.glyph}
      </Glyph>
      <Text style={{ fontFamily: MONO.medium, fontSize: 13, color: col.ink2 }}>{c.roman}</Text>
      <PlayButton item={c} size={40} ghost playId={'tile-' + c.glyph} />
    </Pressable>
  );
}

function GroupHead({ name, place, count }: { name: string; place?: string; count: number }) {
  const { c } = useTheme();
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: 12,
        marginHorizontal: 2,
        marginBottom: 12,
        paddingBottom: 9,
        borderBottomWidth: 1.5,
        borderBottomColor: c.line,
      }}
    >
      <Text style={{ fontFamily: DISPLAY.bold, fontSize: 18, color: c.ink, letterSpacing: -0.4 }}>
        {name}
      </Text>
      {place && <Text style={{ fontFamily: UI.regular, fontSize: 12.5, color: c.ink3 }}>{place}</Text>}
      <View style={{ flex: 1 }} />
      <Text style={{ fontFamily: MONO.regular, fontSize: 12, color: c.ink3 }}>{count}</Text>
    </View>
  );
}

export function BrowseScreen({ navigation }: ScreenProps<'Browse'>) {
  const { c } = useTheme();
  const { width } = useWindowDimensions();
  const contentW = Math.min(width - 40, 1080);
  const [tab, setTab] = useState<'consonants' | 'vowels'>('consonants');
  const [q, setQ] = useState('');

  const query = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    return CONSONANTS.filter((con) => {
      if (!query) return true;
      if (con.roman.toLowerCase().indexOf(query) >= 0) return true;
      if (con.glyph === q.trim()) return true;
      if (con.ipa.toLowerCase().indexOf(query) >= 0) return true;
      return con.words.some(
        (w) => w.en.toLowerCase().indexOf(query) >= 0 || w.roman.toLowerCase().indexOf(query) >= 0,
      );
    });
  }, [query, q]);

  const searching = !!query;
  const { tileW } = gridCols(contentW, 96, 11);
  const { tileW: vTileW } = gridCols(contentW, 120, 11);

  const seg = (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: c.surface2,
        borderWidth: 1,
        borderColor: c.line,
        borderRadius: 999,
        padding: 3,
      }}
    >
      {(['consonants', 'vowels'] as const).map((t) => {
        const on = tab === t;
        return (
          <Pressable
            key={t}
            onPress={() => setTab(t)}
            style={[
              { paddingVertical: 9, paddingHorizontal: 16, borderRadius: 999 },
              on && { backgroundColor: c.surface },
            ]}
          >
            <Text style={{ fontFamily: UI.semibold, fontSize: 14, color: on ? c.ink : c.ink2 }}>
              {t === 'consonants' ? 'Consonants' : 'Vowels'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );

  return (
    <Screen>
      {/* Controls */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
        {seg}
        {tab === 'consonants' && (
          <View style={{ flex: 1, minWidth: 150, position: 'relative', justifyContent: 'center' }}>
            <View style={{ position: 'absolute', left: 13, zIndex: 1 }}>
              <Icon name="search" size={17} color={c.ink3} />
            </View>
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder="Search sound, glyph or word…"
              placeholderTextColor={c.ink3}
              style={{
                fontFamily: UI.regular,
                fontSize: 14.5,
                color: c.ink,
                paddingVertical: 10,
                paddingLeft: 38,
                paddingRight: 14,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: c.line,
                backgroundColor: c.surface,
              }}
            />
          </View>
        )}
      </View>

      {tab === 'consonants' ? (
        searching ? (
          filtered.length ? (
            <View style={{ marginBottom: 26 }}>
              <GroupHead name="Results" count={filtered.length} />
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 11 }}>
                {filtered.map((con) => (
                  <Tile
                    key={con.glyph}
                    c={con}
                    tileW={tileW}
                    onPress={() => navigation.navigate('Detail', { glyph: con.glyph })}
                  />
                ))}
              </View>
            </View>
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <Glyph size={40} color={c.ink2} style={{ marginBottom: 10 }}>
                ស្ងាត់
              </Glyph>
              <Text style={{ fontFamily: UI.regular, fontSize: 15, color: c.ink2, textAlign: 'center' }}>
                No matches. Try a sound like “kh” or a word like “fish”.
              </Text>
            </View>
          )
        ) : (
          SERIES_ORDER.map((sk) => {
            const s = SERIES[sk];
            const items = CONSONANTS.filter((con) => con.series === sk);
            return (
              <View key={sk} style={{ marginBottom: 26 }}>
                <GroupHead name={s.label} place={s.place} count={items.length} />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 11 }}>
                  {items.map((con) => (
                    <Tile
                      key={con.glyph}
                      c={con}
                      tileW={tileW}
                      onPress={() => navigation.navigate('Detail', { glyph: con.glyph })}
                    />
                  ))}
                </View>
              </View>
            );
          })
        )
      ) : (
        <View>
          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              alignItems: 'flex-start',
              backgroundColor: c.oregSoft,
              borderWidth: 1,
              borderColor: c.oreg,
              borderRadius: 14,
              padding: 14,
              marginBottom: 20,
            }}
          >
            <Icon name="ear" size={18} color={c.oregInk} />
            <Text style={{ flex: 1, fontFamily: UI.regular, fontSize: 13.5, color: c.oregInk, lineHeight: 20 }}>
              A dependent vowel’s sound depends on the consonant it rides on. Each tile shows both
              readings — â-series (1st register) and ô-series (2nd register), on the base ក. Audio is
              consonants-only for now.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 11 }}>
            {VOWELS.map((v) => (
              <View
                key={v.id}
                style={{
                  width: vTileW,
                  backgroundColor: c.surface,
                  borderWidth: 1,
                  borderColor: c.line,
                  borderRadius: 14,
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Glyph size={38} scaled>
                  {v.base}
                </Glyph>
                <View style={{ flexDirection: 'row', gap: 6, width: '100%' }}>
                  <View style={{ flex: 1, alignItems: 'center', borderRadius: 8, paddingVertical: 5, backgroundColor: c.aregSoft }}>
                    <Text style={{ fontSize: 9, letterSpacing: 1, color: c.aregInk, fontFamily: MONO.semibold }}>â</Text>
                    <Text style={{ fontFamily: MONO.semibold, fontSize: 13, color: c.aregInk }}>{v.aRead}</Text>
                  </View>
                  <View style={{ flex: 1, alignItems: 'center', borderRadius: 8, paddingVertical: 5, backgroundColor: c.oregSoft }}>
                    <Text style={{ fontSize: 9, letterSpacing: 1, color: c.oregInk, fontFamily: MONO.semibold }}>ô</Text>
                    <Text style={{ fontFamily: MONO.semibold, fontSize: 13, color: c.oregInk }}>{v.oRead}</Text>
                  </View>
                </View>
                <Text style={{ fontFamily: UI.regular, fontSize: 11, color: c.ink3 }}>{v.note}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </Screen>
  );
}
