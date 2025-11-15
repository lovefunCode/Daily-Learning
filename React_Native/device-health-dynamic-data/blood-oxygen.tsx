import React from "react";
import { View, StyleSheet } from "react-native";

// Blood oxygen bar chart component
const BloodOxygenChart = ({ data, width }: any) => {
  // Step 1: Data preprocessing
  // 1. Convert data array to chart data format
  const rawValues = data.map((item: any) => item.value || 0);

  // 2. Fixed to 8 points, pad with 0 if insufficient
  const fixedData = [...rawValues];
  while (fixedData.length < 8) {
    fixedData.push(0);
  }
  // Take only the first 8 points
  const chartData = fixedData.slice(0, 8);

  // 3. Reverse the array
  const reversedData = [...chartData].reverse();

  // Step 2: Calculate chart dimensions
  // Use the provided width, or default value if not provided
  const containerWidth = width || 0; // Container width
  const containerHeight = 50; // Container height fixed at 50px

  // If width is invalid, return null
  if (containerWidth <= 0) {
    return null;
  }

  // Bar width: container width / 8 (position interval for each bar)
  const barPositionWidth = containerWidth / 8;

  // Y-axis unit height: (container height - 30) / 100
  const yAxisUnitHeight = (containerHeight - 30) / 100;

  // Bar width: 4px (fixed)
  const barWidth = 4;

  // Step 3: Determine color based on blood oxygen value
  const getBarColor = (value: number): string => {
    if (value <= 70) {
      return "#EB403E"; // Red
    } else if (value >= 90) {
      return "#266AF6"; // Blue
    } else {
      return "#FF961E"; // Orange
    }
  };

  // Use try-catch wrapper to avoid rendering failures
  try {
    return (
      <View style={[styles.chartWrapper, { position: "relative" }]}>
        {reversedData.map((value: number, index: number) => {
          // Calculate bar height
          const barHeight = value * yAxisUnitHeight;

          // Calculate bar position
          const barX = index * barPositionWidth; // x = index * bar width
          const barY = 15; // y = 15 (starts from 15px from top)

          // Get color
          const barColor = getBarColor(value);

          return (
            <View
              key={index}
              style={{
                position: "absolute",
                left: barX + (barPositionWidth - barWidth) / 2, // Center aligned
                top: barY,
                width: barWidth, // Bar width: 4px
                height: barHeight, // Height calculated based on blood oxygen value
                backgroundColor: barColor,
                borderRadius: 2, // Border radius: 2px
              }}
            />
          );
        })}
      </View>
    );
  } catch (error) {
    console.error("❌ BloodOxygenChart rendering failed:", error);
    return null;
  }
};

const styles = StyleSheet.create({
  chartWrapper: {
    alignItems: "flex-start", // Left aligned, aligned with title
    justifyContent: "center",
    borderRadius: 8,
    height: 50, // Fixed height at 50px
    backgroundColor: "transparent",
    alignSelf: "stretch", // Stretch to fill container width
    left: -4,
  },
});

export default BloodOxygenChart;
