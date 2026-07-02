/**
 * Bridges the dataset to bundled audio modules.
 * Returns the require()'d clip for an item + voice set, or null when no audio
 * exists (all vowels, while VOWEL_AUDIO_AVAILABLE is false).
 */
import { consonantAudio } from '../data/audioAssets';
import { Item, VOWEL_AUDIO_AVAILABLE } from '../data/khmer';
import { AudioSource } from './AudioBus';

export function itemAudio(item: Item | null | undefined, set: 1 | 2): AudioSource | null {
  if (!item) return null;
  if (item.kind === 'vowel') {
    // No bundled vowel audio yet; UI falls back to romanized readings.
    if (!VOWEL_AUDIO_AVAILABLE) return null;
    return null;
  }
  return consonantAudio(item.pad, set);
}
