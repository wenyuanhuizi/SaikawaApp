import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

export const SCREEN_WIDTH = width;
export const SCREEN_HEIGHT = height;

// iPads are 768pt wide or more in portrait
export const isTablet = width >= 768;

// Base design width — iPhone 14/15 (390pt)
const BASE_WIDTH = 390;

// Linear scale: grows proportionally with screen width
export const scale = (size: number): number =>
  Math.round((SCREEN_WIDTH / BASE_WIDTH) * size);

// Moderate scale: grows slower than linear — good for font sizes and padding
// factor=0 → no scaling, factor=1 → full linear scaling
export const moderateScale = (size: number, factor = 0.4): number =>
  size + (scale(size) - size) * factor;

// Max width for content areas on tablet (forms, cards, feed items)
export const MAX_CONTENT_WIDTH = isTablet ? 640 : SCREEN_WIDTH;
