import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

// Sleep stage chart component - horizontal line segments + gradient effect
const SleepChart = ({ sleepStages, date, totalMinutes, width }: any) => {
    console.log('sleep width---7', width);
  // If data is empty, return null directly
  if (!sleepStages || sleepStages.length === 0) {
    return null;
  }

  // Use the provided width, or default value if not provided
  const chartWidth = width || 0;
  const containerHeight = 50; // Container height (50px)
  
  // If width is invalid, return null
  if (chartWidth <= 0) {
    return null;
  }
  const lineWidth = 3; // Line width
  const gap = 2; // Spacing between stages
  const lineY = 2; // Line top position
  const gradientOffset = 1; // Gradient area offset from line (1px below line)
  // Gradient height = container height - line top position - line height - gradient offset
  const gradientHeight = containerHeight - lineY - lineWidth - gradientOffset; // 40 - 2 - 3 - 1 = 34px

  // Calculate total duration (if not provided, calculate from stage data)
  const total = totalMinutes || sleepStages.reduce((sum: number, stage: any) => sum + (stage.minutes || 0), 0);
  
  // Calculate width of each stage (subtract spacing)
  const totalGaps = (sleepStages.length - 1) * gap; // Total spacing
  const availableWidth = chartWidth - totalGaps; // Available width
  const stageWidths = sleepStages.map((stage: any) => {
    const percentage = total > 0 ? (stage.minutes / total) : 0;
    return Math.max(2, (availableWidth * percentage)); // Minimum width 2px
  });

  // Calculate starting position of each stage
  let currentX = 0;
  const stagePositions = stageWidths.map((width: number, index: number) => {
    const x = currentX;
    currentX += width + (index < stageWidths.length - 1 ? gap : 0); // Last stage doesn't add spacing
    return x;
  });

  // Helper function: convert hex color to rgba format and set transparency
  const hexToRgba = (hex: string, alpha: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Render a single sleep stage (line segment + gradient)
  const renderSleepStage = (stage: any, index: number) => {
    const { color } = stage;
    const width = stageWidths[index];
    const x = stagePositions[index];
    
    // Gradient color: 30% transparency color to white
    const gradientColor = hexToRgba(color, 0.3); // 30% transparency
    const whiteColor = '#FFFFFF';

    return (
      <View key={index} style={styles.sleepStageSegment}>
        {/* Horizontal line segment */}
        <View
          style={[
            styles.sleepStageLine,
            {
              left: x,
              top: lineY,
              width: width,
              height: lineWidth,
              backgroundColor: color,
            },
          ]}
        />
        
        {/* Gradient area - starts 1px below the line */}
        <LinearGradient
          colors={[gradientColor, whiteColor]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.sleepStageGradient,
            {
              left: x,
              top: lineY + lineWidth + gradientOffset,
              width: width,
              height: gradientHeight,
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View style={[styles.sleepStagesChartContainer, { width: chartWidth, height: containerHeight }]}>
      {sleepStages.map((stage: any, index: number) => renderSleepStage(stage, index))}
    </View>
  );
};

const styles = StyleSheet.create({
  sleepStagesChartContainer: {
    position: 'relative',
    marginTop: -4,

  },
  sleepStageSegment: {
    position: 'absolute',
  },
  sleepStageLine: {
    position: 'absolute',
  },
  sleepStageGradient: {
    position: 'absolute',
  },
});

export default SleepChart;
