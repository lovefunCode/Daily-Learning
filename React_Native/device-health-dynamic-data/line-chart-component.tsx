import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

// Area chart style
const LineChartComponent = ({ data, color = '#FF7300', showArea = true, width }: any) => {
  // If data is empty, return null directly
  if (!data || data.length === 0) {
    return null;
  }

  // Use the provided width, or default value if not provided
  const finalChartWidth = width || 0;
  
  // If width is invalid, return null
  if (finalChartWidth <= 0) {
    return null;
  }

  // Convert to data format required by LineChart
  const chartData = data.map((item: any) => ({
    value: item.value,
    label: '',
  }));

  // Calculate chart max and min values
  const values = data.map((item: any) => item.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue;
  const yAxisMax = range > 0 ? maxValue + range * 0.2 : maxValue + 1;
  const yAxisMin = range > 0 ? Math.max(0, minValue - range * 0.1) : 0;

  // Dynamically calculate spacing
  const dataPointsCount = chartData.length;
  const initialSpacing = 0;
  const endSpacing = 0;
  const calculatedSpacing = dataPointsCount > 1 
    ? Math.floor((finalChartWidth - initialSpacing - endSpacing) / (dataPointsCount - 1))
    : 0;
  const spacing = Math.max(8, Math.min(calculatedSpacing, 20));

  // Helper function: lighten color (for gradient end color)
  const lightenColor = (hex: string, factor: number = 0.85): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const newR = Math.min(255, Math.floor(r + (255 - r) * (1 - factor)));
    const newG = Math.min(255, Math.floor(g + (255 - g) * (1 - factor)));
    const newB = Math.min(255, Math.floor(b + (255 - b) * (1 - factor)));
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };

  // Area chart color - use the provided color parameter
  const areaColor = color; // Primary color (line color)
  const gradientStartColor = color; // Start color (same as primary color)
  const gradientEndColor = lightenColor(color, 0.9); // End color (lighter version, close to white)

  // Use try-catch wrapper to avoid crashes when SVG is not linked
  try {
    return (
      <View style={styles.chartWrapper}>
        <View style={styles.lineChartContainer}>
          <LineChart
            data={chartData}
            width={finalChartWidth}
            height={50}
            color={areaColor}
            thickness={2}
            hideRules={true}
            hideYAxisText={true}
            hideDataPoints={true} // Hide data points, only show smooth curve
            spacing={spacing}
            initialSpacing={0} // Ensure no initial spacing
            endSpacing={0} // Ensure no end spacing
            yAxisColor="transparent"
            xAxisColor="transparent"
            maxValue={yAxisMax}
            areaChart={showArea} // Control whether to show area chart based on showArea parameter
            curved={true} // Smooth curve
            startFillColor={showArea ? gradientStartColor : 'transparent'} // Use transparent fill if showArea is false
            endFillColor={showArea ? gradientEndColor : 'transparent'} // Use transparent fill if showArea is false
            startOpacity={showArea ? 0.4 : 0} // Opacity is 0 if showArea is false
            endOpacity={showArea ? 0.1 : 0} // Opacity is 0 if showArea is false
          />
        </View>
      </View>
    );
  } catch (error) {
    console.error('❌ LineChartComponent rendering failed:', error);
    return null;
  }
};

const styles = StyleSheet.create({
  chartWrapper: {
    alignItems: 'flex-start', // Left aligned, aligned with title
    justifyContent: 'center',
    borderRadius: 8,
    height: 50, // Fixed height at 50px
    backgroundColor: 'transparent',
    alignSelf: 'stretch', // Stretch to fill container width
    marginLeft: 0, // Ensure no left margin
    paddingLeft: 0, // Ensure no left padding
    marginHorizontal: 0, // Ensure no horizontal margin
    paddingHorizontal: 0, // Ensure no horizontal padding
    left: -12,
  },
  lineChartContainer: {
    marginLeft: 0, // Ensure LineChart container has no left margin
    paddingLeft: 0, // Ensure LineChart container has no left padding
    alignSelf: 'flex-start', // Left aligned
  },
});

export default LineChartComponent;
