/**
 * Health Data Card Configuration Module
 * Manages card templates and data injection
 *
 * Responsibilities:
 * - Extract card templates from healthData
 * - Merge configuration with backend data
 * - Handle data fallback (show background when no data)
 */

import { transformBackendDataToFrontend } from './health-data-transform';
import { cardTypeMapping } from './health-data-definition';

/**
 * Extract card template from healthDataList
 * Returns template as-is (no data field to remove)
 *
 * @param typeKey - Card type key (e.g., 'heartRate', 'sleep')
 * @param healthDataList - Array of health data templates
 * @returns Template object with bg, title, description, type, etc.
 */
export const getCardTemplate = (typeKey: string, healthDataList: any[]): any | undefined => {
  const src = healthDataList.find((it: any) => it.type === typeKey);
  return src;
};

/**
 * Build card templates from healthDataList
 * Returns map of typeKey → template
 * Simplifies data lookup since templates now have type at top level
 */
export const buildCardTemplates = (
  healthDataList: any[]
): { [key: string]: any } => {
  const templates: { [key: string]: any } = {};

  for (const item of healthDataList) {
    if (item.type) {
      templates[item.type] = item;
    }
  }

  return templates;
};

/**
 * Process backend data and inject into dataByType
 * Only injects data when hasData === true
 * Leaves data undefined when hasData === false (triggers fallback UI)
 */
export const processBackendDataMap = (
  backendDataMap: { [key: string]: any } | undefined
): { [key: string]: any } => {
  const dataByType: { [key: string]: any } = {};

  if (!backendDataMap) {
    console.log('🔍 [getConfiguredHealthData] No backend data, all cards show background image + description');
    return dataByType;
  }

  console.log('🔍 [getConfiguredHealthData] backendDataMap:', backendDataMap);

  for (const [key, backendData] of Object.entries(backendDataMap)) {
    // Only transform if hasData is true or 1
    if (backendData && (backendData.hasData === 1 || backendData.hasData === true)) {
      const transformedData = transformBackendDataToFrontend(backendData);
      if (transformedData) {
        dataByType[key] = transformedData;
      } else {
        console.log(`⚠️ [BackendData] ${key} data transformation failed, card shows background image + description`);
      }
    } else {
      console.log(`ℹ️ [BackendData] ${key} hasData === false (hasData: ${backendData?.hasData}), card shows background image + description`);
    }
  }

  return dataByType;
};

/**
 * Convert displayedCards array to configuration format
 * Converts: [0, 1, 2, 3, 4, 5] → [{ type: 'sportRecord' }, { type: 'sleep' }, ...]
 */
export const displayedCardsToConfig = (displayedCards: number[]): any[] => {
  if (!displayedCards || displayedCards.length === 0) {
    return [];
  }

  const config = displayedCards
    .map((cardNum: number) => {
      const typeKey = cardTypeMapping[cardNum];
      return typeKey ? { type: typeKey } : null;
    })
    .filter(Boolean) as any[];

  console.log('📋 [DisplayedCards] Using backend displayedCards to generate config:', config);
  return config;
};

/**
 * Merge card configuration with backend data
 * Primary logic for rendering cards
 *
 * @param healthDataList - Array of health data templates (bg, title, description, etc.)
 * @param config - Card configuration array from JSON or config file
 * @param backendDataMap - Backend data map (hasData, values, etc.)
 * @param displayedCards - Array of card type numbers from backend (0-5)
 * @returns Array of configured cards ready for rendering
 */
export const getConfiguredHealthData = (
  healthDataList: any[],
  config: any[],
  backendDataMap?: { [key: string]: any },
  displayedCards?: number[]
): any[] => {
  // Step 1: Determine final configuration
  let finalConfig = config;
  if (displayedCards && Array.isArray(displayedCards) && displayedCards.length > 0) {
    finalConfig = displayedCardsToConfig(displayedCards);
  }

  // Step 2: Process backend data (transform and inject)
  const dataByType = processBackendDataMap(backendDataMap);

  // Step 3: Build card templates
  const CARD_TEMPLATES = buildCardTemplates(healthDataList);

  // Step 4: Merge templates with data
  const configuredData = finalConfig
    .map((cfg) => cfg.type)
    .map((typeKey: string) => {
      const tpl = CARD_TEMPLATES[typeKey];
      if (!tpl) {
        return undefined;
      }

      // Inject data (may be undefined if hasData === false)
      const injectedData = dataByType[typeKey];

      // Merge template with injected data
      // Template has: bg, title, titleCol, description, descCol, bgColor, lineColor, type
      // Injected data has: type, [dataKey]Data, date, currentValue, unit, etc.
      const result = { ...tpl, data: injectedData };

      // For SportRecord, also preserve sportType if it exists in the data
      if (typeKey === 'sportRecord' && injectedData?.sportType) {
        result.sportType = injectedData.sportType;
      }

      return result;
    })
    .filter(Boolean) as any[];

  return configuredData;
};
