/**
 * Health Data Utility Functions
 * Helper functions for various operations
 */

import sportImageMapping from './sport-image-mapping.json';
import { sportImagePathMap } from './health-data-definition';

/**
 * Find sport background image based on sportType
 * Returns null if not found, triggering MapTrajectory fallback
 *
 * @param sportType - Sport type ID (number or string)
 * @returns Image resource or null
 */
export const findSportBackgroundImageOrNull = (sportType?: number | string): any | null => {
  console.log('🔍 [findSportBackgroundImageOrNull] Starting search, sportType:', sportType);

  if (!sportType) {
    return null;
  }

  const sportTypeId = String(sportType);
  const sportInfo = (sportImageMapping as any)[sportTypeId];

  if (!sportInfo || !sportInfo.typeImg) {
    return null;
  }

  const imgKey = sportInfo.typeImg;
  const imagePath = sportImagePathMap[imgKey];

  if (!imagePath) {
    return null;
  }

  return imagePath;
};

/**
 * Get sport type name from sport type ID
 * Used for displaying sport type in UI
 *
 * @param sportType - Sport type ID
 * @returns Sport type display name (e.g., "Outdoor Running")
 */
export const getSportTypeName = (sportType?: number | string): string => {
  if (!sportType) return '';
  const sportTypeId = String(sportType);
  const sportInfo = (sportImageMapping as any)[sportTypeId];
  return sportInfo?.typeName || '';
};
