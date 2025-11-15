/**
 * Health Data Styles
 * All StyleSheet definitions for health data cards
 * Separated for cleaner component structure
 */

import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = (screenWidth - 24 - 12) / 2;
const cardContentWidth = cardWidth - 24;

export const cardStyles = StyleSheet.create({
  // Container and Grid
  container: {
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  // Card Base
  card: {
    marginBottom: 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    height: 140,
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  content: {
    flex: 1,
    padding: 12,
    height: 140,
    position: 'relative',
    zIndex: 1,
  },

  // Text Content
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
  },
  description: {
    marginTop: 10,
    fontSize: 12,
    color: '#9A9A9A',
    lineHeight: 16,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#999999',
    marginBottom: 2,
  },

  // Chart Container
  chartContainer: {
    width: '100%',
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  chartComponentWrapper: {
    marginLeft: 0,
    paddingLeft: 0,
    paddingRight: 0,
    marginTop: 4,
  },
  chartWrapper: {
    alignItems: 'flex-start',
    justifyContent: 'center',
    borderRadius: 8,
    height: 50,
    backgroundColor: 'transparent',
    alignSelf: 'stretch',
  },

  // Value Display
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    height: 28,
    marginTop: -10,
  },
  valueText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#282828',
  },
  unitText: {
    fontSize: 12,
    color: '#9A9A9A',
    marginLeft: 4,
  },

  // Sleep Card Specific
  totalDurationContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 4,
  },
  totalDurationText: {
    fontSize: 26,
    color: '#282828',
    fontWeight: '500',
  },
  greyText: {
    color: '#696969',
    fontSize: 12,
  },
  periodTrackingContainer: {
    marginTop: 4,
    height: 50,
  },

  // Period Tracking Specific
  statusLabel: {
    fontSize: 12,
    color: '#696969',
  },
  statusUnit: {
    fontSize: 12,
    color: '#696969',
  },
  valuePeriodText: {
    fontSize: 26,
    fontWeight: '600',
    color: '#282828',
    marginHorizontal: 4,
  },

  // Sport Record Specific
  sportRecordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 1,
    marginBottom: 8,
  },
  sportRecordHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  sportRecordTypeNameText: {
    marginLeft: 8,
  },
  sportRecordTypeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#282828',
  },
  sportRecordDateText: {
    fontSize: 12,
    color: '#999999',
  },
  sportRecordText: {
    fontSize: 12,
    color: '#999999',
    marginLeft: 4,
  },
  sportRecordMapContainer: {
    marginVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportRecordImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginBottom: 4,
  },
  sportRecordCenterImage: {
    width: cardWidth,
    height: 50,
  },
  sportRecordFooter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 'auto',
  },
  sportRecordValue: {
    fontSize: 26,
    fontWeight: '600',
    color: '#282828',
  },
  sportRecordUnit: {
    fontSize: 12,
    color: '#9A9A9A',
    marginLeft: 4,
  },

  // Edit Button
  editButton: {
    alignSelf: 'center',
    marginTop: 0,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    color: '#FF7300',
    fontWeight: '500',
  },
});

export const CARD_WIDTH = cardWidth;
export const CARD_CONTENT_WIDTH = cardContentWidth;
