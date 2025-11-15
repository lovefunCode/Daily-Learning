/**
 * Health Data API Module
 * Encapsulates all API calls and state management for health data
 *
 * Responsibilities:
 * - Fetch card list from backend
 * - Fetch detailed health data for each card type
 * - Manage loading state
 * - Handle errors gracefully
 */

import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
// TODO: Replace with your own device API interface
// import {YourDeviceAPI} from './your-device-api';
import {cardTypeMapping, healthDataConfig} from './health-data-definition';
// TODO: Replace with your own event emitter
// import {YourEventEmitter} from './your-event-emitter';
import {NativeEventEmitter} from 'react-native';
// TODO: Replace with your own types and state management
// import {DeviceItem} from './types';
// import {RootState} from './store';

interface UseHealthDataApiReturn {
  backendDataMap: {[key: string]: any};
  displayedCards: number[];
  isLoadingData: boolean;
}

// TODO: Replace with your own event emitter
// const eventNotifyEmitter = new NativeEventEmitter(YourEventEmitter as any);

/**
 * Custom hook for fetching health data from APIs
 * Progressive loading: Cards display as data arrives, no waiting for all APIs
 *
 * @param deviceItem - Current device information
 * @returns Object with backendDataMap, displayedCards, isLoadingData
 */
export const useHealthDataApi = (
  deviceItem: any, // TODO: Replace with your DeviceItem type
): UseHealthDataApiReturn => {
  const [backendDataMap, setBackendDataMap] = useState<{[key: string]: any}>(
    {},
  );
  const [displayedCards, setDisplayedCards] = useState<number[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // TODO: Replace with your own state management
  // const {isLoggedIn} = useSelector((state: RootState) => state.globalData);
  const isLoggedIn = true; // Placeholder

  /**
   * Load health data card list and detailed data
   * This function can be called by useEffect and event listeners
   */
  const loadHealthData = () => {
    setIsLoadingData(true);

    // Step 1: Fetch card list
    // Note: Replace PhDevice with your own device API interface
    // PhDevice.getHealthDataCard({deviceModel: deviceItem})
    //   .then((cardList: any) => {
    //     console.log('📋 [HealthData] Card list received:', cardList);
    //     // Define cards to display (0-sport, 1-sleep, 2-heart rate, 3-respiratory rate, 4-blood oxygen, 5-period tracking)
    //     const cardsToDisplay = cardList.displayedCards;
    //     setDisplayedCards(cardsToDisplay);

    //     console.log('🔍 [HealthData] Cards to display:', cardsToDisplay);
      

    //     // Step 2: Fetch detail data for each card (progressive rendering)
    //     if (!Array.isArray(cardsToDisplay)) {
    //       setIsLoadingData(false);
    //       return;
    //     }

    //     // Clear previous data, reload
    //     setBackendDataMap({});

    //     cardsToDisplay.forEach((cardType: number, index: number) => {
    //       // Ensure cardType is a number
    //       const cardTypeNum =
    //         typeof cardType === 'string' ? parseInt(cardType, 10) : cardType;
    //       const dataKey = cardTypeMapping[cardTypeNum];

    //       if (!dataKey) {
    //         return;
    //       }

    //       // Call API and update state immediately when data arrives
    //       // Use converted number type
    //       PhDevice.getHealthDataDetail({
    //         type: cardTypeNum,
    //         deviceModel: deviceItem,
    //       })
    //         .then((detail: any) => {
    //           console.log(
    //             `📊 [HealthData] Raw data received for ${dataKey} (type: ${cardType}):`,
    //             detail,
    //           );

    //           // Check hasData flag (supports both true and 1)
    //           if (detail && (detail.hasData === 1 || detail.hasData === true)) {
    //             // 🎯 KEY: Update state immediately (don't wait for other cards)
    //             setBackendDataMap(prevMap => {
    //               const newMap = {...prevMap, [dataKey]: detail};
    //               return newMap;
    //             });
    //           } else {
    //             console.log(
    //               `ℹ️ [HealthData] ${dataKey} hasData is not 1 (hasData: ${detail?.hasData}), using default mock data`,
    //             );
    //           }
    //         })
    //         .catch((error: any) => {
    //           console.error(
    //             `❌ [HealthData] Failed to fetch ${dataKey} (type: ${cardType}) data:`,
    //             error,
    //           );
    //         });
    //     });

    //     // 🎯 KEY: Mark loading complete immediately (don't wait for all APIs)
    //     setIsLoadingData(false);
    //   })
    //   .catch((error: any) => {
    //     setIsLoadingData(false);
    //   });
    
    // TODO: Implement your own API calls here
    // Example structure:
    // YourDeviceAPI.getHealthDataCard({deviceModel: deviceItem})
    //   .then((cardList: any) => { ... })
  };

  useEffect(() => {
    // If user is not logged in, use default healthDataConfig to display cards
    if (!isLoggedIn) {
      console.log('ℹ️ [HealthData] User not logged in, using default health data cards');
      // Extract default card types from healthDataConfig
      // healthDataConfig format: [{ type: 'sleep' }, { type: 'heartRate' }, ...]
      // Need to convert to number array: [1, 2, ...] (corresponding to cardTypeMapping)
      const defaultDisplayedCards: number[] = [];
      const reverseCardTypeMapping: {[key: string]: number} = {};
      Object.entries(cardTypeMapping).forEach(([num, type]) => {
        reverseCardTypeMapping[type] = parseInt(num, 10);
      });

      healthDataConfig.forEach((config: any) => {
        const cardNum = reverseCardTypeMapping[config.type];
        if (cardNum !== undefined) {
          defaultDisplayedCards.push(cardNum);
        }
      });

      setDisplayedCards(defaultDisplayedCards);
      setBackendDataMap({}); // Empty data, use default healthData
      setIsLoadingData(false);
      return;
    }

    // User is logged in, call API to load data
    console.log('✅ [HealthData] User logged in, calling API to load data');
    loadHealthData();

    // TODO: Replace with your own event listeners
    // const subscriptions: any[] = [];

    // // Listen to EVENT_HEALTH_DATA_CARD_SAVE event (triggered after editing cards)
    // subscriptions.push(eventNotifyEmitter.addListener(
    //   'EVENT_HEALTH_DATA_CARD_SAVE',
    //   (event: any) => {
    //     console.log(
    //       '📢 [HealthData] Received EVENT_HEALTH_DATA_CARD_SAVE event:',
    //       event,
    //     );
    //     // Only reload data for logged-in users
    //     if (isLoggedIn) {
    //       loadHealthData();
    //     }
    //   },
    // ));

    // // Listen to EVENT_HEALTH_SYNC_UPDATE event (triggered after pull-to-refresh syncHealthData completes)
    // subscriptions.push(eventNotifyEmitter.addListener(
    //   'EVENT_HEALTH_SYNC_UPDATE',
    //   (event: any) => {
    //     console.log(
    //       '📢 [HealthData] Received EVENT_HEALTH_SYNC_UPDATE event (sync completed, reloading data):',
    //       event,
    //     );
    //   },
    // ));

    // // Clean up event listeners
    // return () => {
    //   subscriptions.forEach(sub=>sub.remove());
    // };
  }, [deviceItem, isLoggedIn]);

  return {backendDataMap, displayedCards, isLoadingData};
};
