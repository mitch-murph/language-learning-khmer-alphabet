// Auto-generated static require map for consonant audio.
// React Native/Metro require() needs static literal paths, so every clip is listed.
// Vowel audio is not recorded yet (see VOWEL_AUDIO_AVAILABLE in khmer.ts).

type AudioModule = number;

const set1: Record<string, AudioModule> = {
  "01": require("../../assets/audio/set1/01.mp3"),
  "02": require("../../assets/audio/set1/02.mp3"),
  "03": require("../../assets/audio/set1/03.mp3"),
  "04": require("../../assets/audio/set1/04.mp3"),
  "05": require("../../assets/audio/set1/05.mp3"),
  "06": require("../../assets/audio/set1/06.mp3"),
  "07": require("../../assets/audio/set1/07.mp3"),
  "08": require("../../assets/audio/set1/08.mp3"),
  "09": require("../../assets/audio/set1/09.mp3"),
  "10": require("../../assets/audio/set1/10.mp3"),
  "11": require("../../assets/audio/set1/11.mp3"),
  "12": require("../../assets/audio/set1/12.mp3"),
  "13": require("../../assets/audio/set1/13.mp3"),
  "14": require("../../assets/audio/set1/14.mp3"),
  "15": require("../../assets/audio/set1/15.mp3"),
  "16": require("../../assets/audio/set1/16.mp3"),
  "17": require("../../assets/audio/set1/17.mp3"),
  "18": require("../../assets/audio/set1/18.mp3"),
  "19": require("../../assets/audio/set1/19.mp3"),
  "20": require("../../assets/audio/set1/20.mp3"),
  "21": require("../../assets/audio/set1/21.mp3"),
  "22": require("../../assets/audio/set1/22.mp3"),
  "23": require("../../assets/audio/set1/23.mp3"),
  "24": require("../../assets/audio/set1/24.mp3"),
  "25": require("../../assets/audio/set1/25.mp3"),
  "26": require("../../assets/audio/set1/26.mp3"),
  "27": require("../../assets/audio/set1/27.mp3"),
  "28": require("../../assets/audio/set1/28.mp3"),
  "29": require("../../assets/audio/set1/29.mp3"),
  "30": require("../../assets/audio/set1/30.mp3"),
  "31": require("../../assets/audio/set1/31.mp3"),
  "32": require("../../assets/audio/set1/32.mp3"),
  "33": require("../../assets/audio/set1/33.mp3"),
};

const set2: Record<string, AudioModule> = {
  "01": require("../../assets/audio/set2/01.mp3"),
  "02": require("../../assets/audio/set2/02.mp3"),
  "03": require("../../assets/audio/set2/03.mp3"),
  "04": require("../../assets/audio/set2/04.mp3"),
  "05": require("../../assets/audio/set2/05.mp3"),
  "06": require("../../assets/audio/set2/06.mp3"),
  "07": require("../../assets/audio/set2/07.mp3"),
  "08": require("../../assets/audio/set2/08.mp3"),
  "09": require("../../assets/audio/set2/09.mp3"),
  "10": require("../../assets/audio/set2/10.mp3"),
  "11": require("../../assets/audio/set2/11.mp3"),
  "12": require("../../assets/audio/set2/12.mp3"),
  "13": require("../../assets/audio/set2/13.mp3"),
  "14": require("../../assets/audio/set2/14.mp3"),
  "15": require("../../assets/audio/set2/15.mp3"),
  "16": require("../../assets/audio/set2/16.mp3"),
  "17": require("../../assets/audio/set2/17.mp3"),
  "18": require("../../assets/audio/set2/18.mp3"),
  "19": require("../../assets/audio/set2/19.mp3"),
  "20": require("../../assets/audio/set2/20.mp3"),
  "21": require("../../assets/audio/set2/21.mp3"),
  "22": require("../../assets/audio/set2/22.mp3"),
  "23": require("../../assets/audio/set2/23.mp3"),
  "24": require("../../assets/audio/set2/24.mp3"),
  "25": require("../../assets/audio/set2/25.mp3"),
  "26": require("../../assets/audio/set2/26.mp3"),
  "27": require("../../assets/audio/set2/27.mp3"),
  "28": require("../../assets/audio/set2/28.mp3"),
  "29": require("../../assets/audio/set2/29.mp3"),
  "30": require("../../assets/audio/set2/30.mp3"),
  "31": require("../../assets/audio/set2/31.mp3"),
  "32": require("../../assets/audio/set2/32.mp3"),
  "33": require("../../assets/audio/set2/33.mp3"),
};

export const AUDIO: Record<1 | 2, Record<string, AudioModule>> = { 1: set1, 2: set2 };

/** Returns the bundled audio module for a consonant pad + voice set, or null. */
export function consonantAudio(pad: string, set: 1 | 2): AudioModule | null {
  return AUDIO[set][pad] ?? null;
}
