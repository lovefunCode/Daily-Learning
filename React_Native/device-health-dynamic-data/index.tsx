/**
 * Device Health Dynamic Data Component
 * Displays health data cards in a 2-column grid layout
 *
 * Architecture:
 * - API calls handled by useHealthDataApi hook
 * - Data transformation via transformBackendDataToFrontend (in health-data-transform.ts)
 * - Card configuration via getConfiguredHealthData (in health-data-cards.ts)
 * - Rendering separated into specific card render functions
 */

import React from 'react';
import {Text, View, TouchableOpacity, NativeEventEmitter} from 'react-native';
import {useEffect, useState, useMemo, useCallback} from 'react';
import FastImage from 'react-native-fast-image';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../../navigation/AppNavigator';

// Sub-components
// TODO: Update these import paths to match your project structure
import PeriodTrackingDots, {
  getPeriodTrackingStatusText,
} from './period-tracking';
import MapTrajectory from './map-trajectory';
import SleepChart from './sleep';
import BloodOxygenChart from './blood-oxygen';
import LineChartComponent from './line-chart-component';

// TODO: Replace with your own navigation and state management
// import {YourRouter} from './your-router';
// import {YourJumpList} from './your-jump-list';
// import {RootState} from './your-store';
// import {DeviceItem} from './your-types';

// Refactored modules
import healthDataConfig, {healthData} from './health-data-definition';
import {useHealthDataApi} from './health-data-api';
import {getConfiguredHealthData} from './health-data-cards';
import {cardStyles, CARD_WIDTH, CARD_CONTENT_WIDTH} from './health-data-styles';
import {
  findSportBackgroundImageOrNull,
  getSportTypeName,
} from './health-data-utils';
import {formatDuration} from './health-data-transform';
// TODO: Replace with your own toast and utilities
// import {useToast} from './your-toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import {enableWDYR} from './your-wdyr-helper';

/**
 * Main Component
 */
export default function DeviceHealthDynamicData() {
  // TODO: Replace with your own state management
  // const {deviceList, current} = useSelector(
  //   (state: RootState) => state.deviceData,
  // );
  // const deviceItem = useMemo(
  //   () => deviceList?.at(current) || ({} as DeviceItem),
  //   [deviceList, current],
  // );
  const deviceItem = {}; // Placeholder - replace with your device item

  // TODO: Replace with your own toast and navigation
  // const {showToast} = useToast();
  const showToast = (options: any) => {
    console.log('Toast:', options.message);
  };
  // const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const navigation = {} as any; // Placeholder

  // Log device changes (not on every render)
  useEffect(() => {
    console.log('deviceItem--', deviceItem);
  }, [deviceItem]);

  // Get API data using custom hook
  const {backendDataMap, displayedCards, isLoadingData} =
    useHealthDataApi(deviceItem);

  // Get configured cards (merge templates with backend data) - memoized to prevent unnecessary recalculations
  const configuredData = useMemo(
    () =>
      getConfiguredHealthData(
        healthData,
        healthDataConfig,
        backendDataMap,
        displayedCards.length > 0 ? displayedCards : undefined,
      ),
    [backendDataMap, displayedCards],
  );

  // const configuredData =  getConfiguredHealthData(
  //     healthData,
  //     healthDataConfig,
  //     backendDataMap,
  //     displayedCards.length > 0 ? displayedCards : undefined,
  //   )

  useEffect(() => {
    console.log('🔍 [configuredData] configuredData:', configuredData);
  }, [configuredData]);

  /**
   * Handle card press - navigate to detail page
   */
  const onCardPress = useCallback((index: number, item: any) => {
    console.log('onCardPress', index, item);
    // TODO: Replace with your own navigation
    // YourRouter.navigateToDetail({
    //   screen: YourJumpList[item.title],
    //   params: {},
    // });
  }, []);

  // const onCardPress = (index: number, item: any) => {
  //   console.log('onCardPress', index, item);
  //   console.log('Created new onCardPress function')
  //   NativePhRouter.navigateToNative({
  //     jumpVo: JumpVoList[item.title as keyof typeof JumpVoList],
  //     deviceModel: {},
  //   });
  // }

  // const onEditCards = () => {
  //   console.log('onEditCards--190-', JumpVoList['EditCardPage']);
  //   NativePhRouter.navigateToNative({
  //     jumpVo: JumpVoList['EditCardPage'],
  //     deviceModel: {},
  //   });
  // };

  /**
   * Handle edit cards button
   * Navigate to edit cards page, then navigate to the third tab
   */
  const onEditCards = useCallback(async () => {
    // TODO: Replace with your own navigation logic
    // console.log('onEditCards', YourJumpList['EditCardPage']);
    // Skip if device not ready
    if (!deviceItem || !(deviceItem as any).mac) {
      showToast({
        message: 'Please bind device first',
        duration: 2000,
        position: 'center',
        backgroundColor: '#4A4A4A',
        textColor: '#FFFFFF',
        borderRadius: 20,
        fontSize: 14,
        fontWeight: '500',
        paddingHorizontal: 20,
        paddingVertical: 12,
      });

      // 2. Get tabConfig from AsyncStorage
      const tabConfigStr = await AsyncStorage.getItem('tabConfig');
      if (tabConfigStr) {
        // Parse JSON string (AsyncStorage returns a string)
        const tabConfigArray = JSON.parse(tabConfigStr);
        // 3. Check if there are at least 3 tabs
        if (Array.isArray(tabConfigArray) && tabConfigArray.length >= 3) {
          // Get the third tab (index 2, since array starts from 0)
          const thirdTab = tabConfigArray[2];
          const thirdTabPgCode = String(thirdTab.pgCode);
          // 4. Navigate to the third tab of MainTabs
          // Screen name must be a string and match the Tab.Screen name property
          (navigation as any).navigate('MainTabs', {
            screen: thirdTabPgCode,
            params: {
              pgCode: thirdTab.pgCode,
              defType: thirdTab.defType,
            },
          });
        } else {
          console.warn(
            '🔍 [onEditCards] Not enough tabs in tabConfig, current count:',
            tabConfigArray?.length || 0,
          );
        }
      } else {
        console.warn('🔍 [onEditCards] tabConfig not found in AsyncStorage');
      }
      return;
    }

    try {
      // 1. Navigate to edit cards page first
      // TODO: Replace with your own navigation
      // await YourRouter.navigateToNativeWithCheck({
      //   jumpVo: YourJumpList['EditCardPage'],
      //   deviceModel: {},
      // });
    } catch (error) {
      console.error('🔍 [onEditCards] Navigation failed:', error);
    }
  }, [deviceItem, showToast, navigation]);

  /**
   * Render heart rate card
   */
  const renderHeartRateCard = (item: any) => {
    if (!item.data?.heartRateData || item.data.heartRateData.length === 0) {
      return null;
    }

    return (
      <View style={cardStyles.chartContainer}>
        {item.data.date && (
          <Text style={cardStyles.dateText}>{item.data.date}</Text>
        )}
        <View style={cardStyles.chartComponentWrapper}>
          <LineChartComponent
            data={item.data.heartRateData}
            date={item.data.date}
            currentValue={item.data.currentValue}
            unit={item.data.unit}
            color={item.lineColor || item.data.color || '#FF7300'}
            showArea={item.data.showArea ?? item.showArea ?? true}
            width={CARD_CONTENT_WIDTH}
          />
        </View>
        {item.data.currentValue !== undefined && (
          <View style={cardStyles.valueContainer}>
            <Text style={cardStyles.valueText}>{item.data.currentValue}</Text>
            {item.data.unit && (
              <Text style={cardStyles.unitText}>{item.data.unit}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  /**
   * Render respiratory rate card
   */
  const renderRespiratoryRateCard = (item: any) => {
    if (
      !item.data?.respiratoryRateData ||
      item.data.respiratoryRateData.length === 0
    ) {
      return null;
    }

    return (
      <View style={cardStyles.chartContainer}>
        {item.data.date && (
          <Text style={cardStyles.dateText}>{item.data.date}</Text>
        )}
        <View style={cardStyles.chartComponentWrapper}>
          <LineChartComponent
            data={item.data.respiratoryRateData}
            date={item.data.date}
            currentValue={item.data.currentValue}
            unit={item.data.unit}
            color={item.lineColor || item.data.color || '#00D6B3'}
            showArea={false}
            width={CARD_CONTENT_WIDTH}
          />
        </View>
        {item.data.currentValue !== undefined && (
          <View style={cardStyles.valueContainer}>
            <Text style={cardStyles.valueText}>{item.data.currentValue}</Text>
            {item.data.unit && (
              <Text style={cardStyles.unitText}>{item.data.unit}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  /**
   * Render blood oxygen card
   */
  const renderBloodOxygenCard = (item: any) => {
    if (!item.data?.bloodOxygenData || item.data.bloodOxygenData.length === 0) {
      return null;
    }

    return (
      <View style={cardStyles.chartContainer}>
        {item.data.date && (
          <Text style={cardStyles.dateText}>{item.data.date}</Text>
        )}
        <View style={cardStyles.chartComponentWrapper}>
          <BloodOxygenChart
            data={item.data.bloodOxygenData}
            date={item.data.date}
            currentValue={item.data.currentValue}
            unit={item.data.unit}
            width={CARD_CONTENT_WIDTH}
          />
        </View>
        {item.data.currentValue !== undefined && (
          <View style={cardStyles.valueContainer}>
            <Text style={cardStyles.valueText}>{item.data.currentValue}</Text>
            {item.data.unit && (
              <Text style={cardStyles.unitText}>{item.data.unit}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  /**
   * Render sleep card
   */
  const renderSleepCard = (item: any) => {
    if (!item.data?.sleepStages || item.data.sleepStages.length === 0) {
      return null;
    }

    return (
      <View style={cardStyles.chartContainer}>
        {item.data.date && (
          <Text style={cardStyles.dateText}>{item.data.date}</Text>
        )}
        <View style={cardStyles.chartComponentWrapper}>
          <SleepChart
            sleepStages={item.data.sleepStages}
            date={item.data.date}
            totalMinutes={item.data.totalMinutes}
            width={CARD_CONTENT_WIDTH}
          />
        </View>
        {item.data.totalMinutes > 0 && (
          <View style={cardStyles.totalDurationContainer}>
            <Text style={cardStyles.totalDurationText}>
              {formatDuration(item.data.totalMinutes).hours}
            </Text>
            <Text style={cardStyles.greyText}>h</Text>
            <Text style={cardStyles.totalDurationText}>
              {formatDuration(item.data.totalMinutes).mins}
            </Text>
            <Text style={cardStyles.greyText}>m</Text>
          </View>
        )}
      </View>
    );
  };

  /**
   * Render sport record card
   */
  const renderSportRecordCard = (item: any) => {
    const sportBgImage = item.sportType
      ? findSportBackgroundImageOrNull(item.sportType)
      : null;

    let centerContent = null;
    if (sportBgImage) {
      centerContent = (
        <View style={cardStyles.sportRecordImageContainer}>
          <FastImage
            source={sportBgImage}
            style={cardStyles.sportRecordCenterImage}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>
      );
    } else if (item.data?.coordinates) {
      centerContent = (
        <View style={cardStyles.sportRecordMapContainer}>
          <MapTrajectory
            coordinates={item.data.coordinates}
            trajectorySegments={item.data.trajectorySegments}
            width={undefined}
            height={40}
            padding={4}
          />
        </View>
      );
    }

    return (
      <View style={cardStyles.chartContainer}>
        <View style={cardStyles.sportRecordHeaderRow}>
          {item.data?.date && (
            <Text style={cardStyles.dateText}>{item.data.date}</Text>
          )}
          {getSportTypeName(item.sportType) && (
            <Text
              style={[cardStyles.dateText, cardStyles.sportRecordTypeNameText]}>
              {getSportTypeName(item.sportType)}
            </Text>
          )}
        </View>

        {centerContent}

        {item.data?.currentValue !== undefined && (
          <View style={cardStyles.valueContainer}>
            <Text style={cardStyles.valueText}>{item.data.currentValue}</Text>
            {item.data.unit && (
              <Text style={cardStyles.unitText}>{item.data.unit}</Text>
            )}
          </View>
        )}
      </View>
    );
  };

  /**
   * Render period tracking card
   */
  const renderPeriodTrackingCard = (item: any) => {
    if (!item.data?.lastPeriodDate) {
      return null;
    }

    const statusInfo = getPeriodTrackingStatusText(
      item.data.lastPeriodDate,
      item.data.cycleLength,
      item.data.periodLength,
      item.data.fertileStartDay,
      item.data.fertileEndDay,
    );

    return (
      <View style={cardStyles.chartContainer}>
        {item.data.recordDate && (
          <Text style={cardStyles.dateText}>{item.data.recordDate}</Text>
        )}

        <View style={cardStyles.periodTrackingContainer}>
          <PeriodTrackingDots
            lastPeriodDate={item.data.lastPeriodDate}
            cycleLength={item.data.cycleLength}
            periodLength={item.data.periodLength}
            fertileStartDay={item.data.fertileStartDay}
            fertileEndDay={item.data.fertileEndDay}
            recordDate={item.data.recordDate}
          />
        </View>

        {statusInfo.statusIndex > 0 && (
          <View style={cardStyles.valueContainer}>
            <Text style={cardStyles.statusLabel}>{statusInfo.statusLabel}</Text>
            <Text style={cardStyles.statusUnit}>Day</Text>
            <Text style={cardStyles.valuePeriodText}>
              {statusInfo.statusIndex}
            </Text>
          </View>
        )}
      </View>
    );
  };

  /**
   * Main render function for each health card
   */
  const renderHealthCard = (item: any, index: number) => {
    const isSportRecord = item.type === 'sportRecord';
    const backgroundImage = item.bg || undefined;
    const showBackgroundImage = !item.data && !!backgroundImage;

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={0.8}
        onPress={() => onCardPress?.(index, item)}
        style={[cardStyles.card, {width: CARD_WIDTH}]}>
        {/* Background image (shown when no data) */}
        {showBackgroundImage && backgroundImage && (
          <FastImage
            source={backgroundImage}
            style={[cardStyles.bgImage, {width: CARD_WIDTH, height: 140}]}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}

        {/* Content layer */}
        <View style={cardStyles.content}>
          {/* Text content */}
          <View style={cardStyles.textContainer}>
            <Text
              style={[cardStyles.title, {color: item.titleCol || '#282828'}]}
              numberOfLines={1}>
              {item.title}
            </Text>

            {/* Description (shown when no data) */}
            {item.description && !item.data && (
              <Text
                style={[
                  cardStyles.description,
                  {color: item.descCol || '#999999'},
                ]}
                numberOfLines={2}>
                {item.description}
              </Text>
            )}

            {/* Render appropriate chart based on data type */}
            {item.data &&
              (() => {
                const dataType = item.type;
                console.log(
                  '🔍 [renderHealthCard] item.data:',
                  item.data,
                  'dataType:',
                  dataType,
                );

                if (isSportRecord) {
                  return renderSportRecordCard(item);
                } else if (dataType === 'heartRate') {
                  return renderHeartRateCard(item);
                } else if (dataType === 'respiratoryRate') {
                  return renderRespiratoryRateCard(item);
                } else if (dataType === 'bloodOxygen') {
                  return renderBloodOxygenCard(item);
                } else if (dataType === 'sleep') {
                  return renderSleepCard(item);
                } else if (dataType === 'periodTracking') {
                  return renderPeriodTrackingCard(item);
                }

                console.log(
                  '⚠️ [renderHealthCard] Chart component not found, dataType:',
                  dataType,
                );
                return null;
              })()}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    displayedCards.length > 0 ? (
      <View style={cardStyles.container}>
        {/* Grid layout */}
        <View style={cardStyles.grid}>
          {configuredData.map((item, index) => renderHealthCard(item, index))}
        </View>

        {/* Edit cards button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onEditCards}
          style={cardStyles.editButton}>
          <Text style={cardStyles.editButtonText}>Edit Cards</Text>
        </TouchableOpacity>
      </View>): null
  );
}

// TODO: Enable WDYR tracking for debugging render performance (optional)
// if (process.env.NODE_ENV === 'development') {
//   enableWDYR(DeviceHealthDynamicData, {
//     customName: 'DeviceHealthDynamicData',
//     trackProps: false, // Props are deeply nested, may be noisy
//     trackHooks: true, // Track hook changes instead
//   });
// }
