import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

// Coordinate point interface
interface Coordinate {
  latitude: number; // Latitude
  longitude: number; // Longitude
}

// Screen coordinate interface
interface ScreenPoint {
  x: number;
  y: number;
}

// Component Props interface
export interface MapTrajectoryProps {
  // Trajectory segment data (array of arrays, each sub-array is a trajectory segment)
  trajectorySegments?: Coordinate[][];
  // Or directly pass coordinate point array
  coordinates?: Coordinate[];
  // Map view width (default: card width)
  width?: number;
  // Map view height (default: 40px)
  height?: number;
  // Padding (default: 4px)
  padding?: number;
}

const MapTrajectory: React.FC<MapTrajectoryProps> = ({
  trajectorySegments = [],
  coordinates = [],
  width,
  height = 40,
  padding = 4,
}) => {
  // Calculate chart dimensions
  const cardWidth = (screenWidth - 24 - 12) / 2;
  const contentPadding = 18 * 2;
  const chartWidth = cardWidth - contentPadding;
  const mapWidth = width || chartWidth;
  const mapHeight = height;

  // Step 1: Data preprocessing
  // 1. Merge all trajectory segments
  let allCoordinates: Coordinate[] = [];
  
  if (coordinates && coordinates.length > 0) {
    // If coordinate array is directly provided
    allCoordinates = coordinates;
  } else if (trajectorySegments && trajectorySegments.length > 0) {
    // If trajectory segment array is provided, merge all segments
    allCoordinates = trajectorySegments.flat();
  }

  // If no data, return empty view
  if (allCoordinates.length === 0) {
    return null;
  }

  // 2. Calculate map display area
  const minLat = Math.min(...allCoordinates.map(coord => coord.latitude));
  const maxLat = Math.max(...allCoordinates.map(coord => coord.latitude));
  const minLng = Math.min(...allCoordinates.map(coord => coord.longitude));
  const maxLng = Math.max(...allCoordinates.map(coord => coord.longitude));

  const latRange = maxLat - minLat || 0.001; // Avoid division by zero
  const lngRange = maxLng - minLng || 0.001; // Avoid division by zero

  // Calculate available drawing area (subtract padding)
  const availableWidth = mapWidth - padding * 2;
  const availableHeight = mapHeight - padding * 2;

  // Step 2: Coordinate conversion
  // Convert latitude/longitude to screen coordinates
  const latLngToScreen = (coord: Coordinate): ScreenPoint => {
    // Normalize coordinates (0-1)
    const normalizedX = (coord.longitude - minLng) / lngRange;
    const normalizedY = (coord.latitude - minLat) / latRange;

    // Convert to screen coordinates (consider padding)
    const x = padding + normalizedX * availableWidth;
    // Y-axis needs to be flipped (screen Y-axis down, map Y-axis up)
    const y = padding + (1 - normalizedY) * availableHeight;

    return { x, y };
  };

  // Convert all coordinate points
  const screenPoints = allCoordinates.map(latLngToScreen);

  // Step 3: Draw trajectory line
  // Create path string
  const createPath = (points: ScreenPoint[]): string => {
    if (points.length === 0) return '';
    
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`;
    }
    return path;
  };

  const pathString = createPath(screenPoints);

  // Start and end point coordinates
  const startPoint = screenPoints[0];
  const endPoint = screenPoints[screenPoints.length - 1];

  // Use try-catch wrapper to avoid crashes when SVG is not linked
  try {
    return (
      <View style={styles.container}>
        <Svg width={mapWidth} height={mapHeight} style={styles.svg}>
          {/* Draw trajectory line */}
          <Path
            d={pathString}
            fill="none"
            stroke="#1EC972" // Green
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Step 4: Draw start point marker */}
          {startPoint && (
            <Circle
              cx={startPoint.x}
              cy={startPoint.y}
              r="3"
              fill="#FFFFFF" // White fill
              stroke="#1EC972" // Green stroke
              strokeWidth="1.5"
            />
          )}

          {/* Step 5: Draw end point marker */}
          {endPoint && (
            <Circle
              cx={endPoint.x}
              cy={endPoint.y}
              r="3"
              fill="#FFFFFF" // White fill
              stroke="#FF7300" // Orange stroke
              strokeWidth="1.5"
            />
          )}
        </Svg>
        <View style={styles.valueContainer}>
            <Text style={styles.valueText}>100</Text>
            <Text style={styles.unitText}>km</Text>
        </View>
      </View>
    );
  } catch (error) {
    console.error('❌ MapTrajectory rendering failed:', error);
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    backgroundColor: 'transparent',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    height: 28,
    marginTop: -12,
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
});

export default MapTrajectory;

