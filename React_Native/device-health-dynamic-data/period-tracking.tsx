import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// 日期数据接口
interface DayData {
  timestamp: number; // 时间戳（秒）
  status: 0 | 1 | 2 | 3; // 0-安全期，1-经期，2-预测期，3-易孕期
  index: number; // 第几天（从1开始）
  isToday: boolean;
  date: Date; // 日期对象
}

// 组件 Props 接口
export interface PeriodTrackingDotsProps {
  // 最后一次经期开始日期（必需）
  lastPeriodDate: Date | string;
  // 周期长度，默认28天
  cycleLength?: number;
  // 经期长度，默认5天
  periodLength?: number;
  // 易孕期开始天数（默认12天，即排卵日前5天）
  fertileStartDay?: number;
  // 易孕期结束天数（默认16天，即排卵日后1天）
  fertileEndDay?: number;
  recordDate?: string; // 可选：记录日期
}

const PeriodTrackingDots: React.FC<PeriodTrackingDotsProps> = ({
  lastPeriodDate,
  cycleLength = 28,
  periodLength = 5,
  fertileStartDay = 12,
  fertileEndDay = 16,
  recordDate, // 可选：记录日期
}) => {
  // 【第二步：计算显示日期范围】
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = Math.floor(today.getTime() / 1000); // 今天0点的时间戳（秒）

  // 获取当前是星期几（JavaScript: 0=周日，1=周一，...，6=周六）
  const dayOfWeek = today.getDay(); // 0-6
  // 转换为：1=周一，2=周二，...，7=周日（用于计算）
  const weekNum = dayOfWeek === 0 ? 7 : dayOfWeek; // 1=周一，2=周二，...，7=周日

  // 计算本周第一天（周一）的时间戳
  // monTime = 今天0点的时间戳 - (weekNum - 1) * 86400
  // 如果今天是周三（weekNum = 3），则 monTime = todayTimestamp - 2 * 86400（即本周一）
  const monTime = todayTimestamp - (weekNum - 1) * 86400;

  // 生成21天的日期数组（从本周一开始）
  // 每天的时间戳：currentTime = monTime + i * 86400（i从0到20）
  const dayDataArray: DayData[] = [];
  for (let i = 0; i < 21; i++) {
    const currentTime = monTime + i * 86400;
    const currentDate = new Date(currentTime * 1000);
    const isToday = currentTime === todayTimestamp;

    dayDataArray.push({
      timestamp: currentTime,
      status: 0, // 默认安全期，后续会计算
      index: 0, // 默认索引，后续会计算
      isToday,
      date: currentDate, // 日期对象
    });
  }

  // 【第三步：判断每天的状态】
  // 解析最后一次经期日期
  const lastPeriod = typeof lastPeriodDate === 'string'
    ? new Date(lastPeriodDate)
    : new Date(lastPeriodDate);
  lastPeriod.setHours(0, 0, 0, 0);
  const lastPeriodTimestamp = Math.floor(lastPeriod.getTime() / 1000);

  // 计算所有经期周期数据
  const periodCycles: Array<{ start: number; end: number; isFuture: boolean }> = [];
  const maxCycles = 3; // 计算最多3个周期（过去1个，当前1个，未来1个）

  for (let cycleIndex = -1; cycleIndex <= maxCycles; cycleIndex++) {
    const periodStartTime = lastPeriodTimestamp + cycleIndex * cycleLength * 86400;
    const periodEndTime = periodStartTime + (periodLength - 1) * 86400;
    const isFuture = periodStartTime > todayTimestamp;

    periodCycles.push({
      start: periodStartTime,
      end: periodEndTime,
      isFuture,
    });
  }

  // 计算易孕期时间范围
  const fertileWindows: Array<{ start: number; end: number }> = [];
  for (let cycleIndex = -1; cycleIndex <= maxCycles; cycleIndex++) {
    const periodStartTime = lastPeriodTimestamp + cycleIndex * cycleLength * 86400;
    const easyStartTime = periodStartTime + fertileStartDay * 86400;
    const easyEndTime = periodStartTime + fertileEndDay * 86400;

    fertileWindows.push({
      start: easyStartTime,
      end: easyEndTime,
    });
  }

  // 计算安全期时间范围（经期和易孕期之间的时间）
  const safeTimes: Array<{ start: number; end: number }> = [];
  for (let cycleIndex = -1; cycleIndex <= maxCycles; cycleIndex++) {
    const periodStartTime = lastPeriodTimestamp + cycleIndex * cycleLength * 86400;
    const periodEndTime = periodStartTime + (periodLength - 1) * 86400;
    const easyStartTime = periodStartTime + fertileStartDay * 86400;

    // 经期结束后到易孕期开始前
    if (periodEndTime < easyStartTime) {
      safeTimes.push({
        start: periodEndTime + 86400,
        end: easyStartTime - 86400,
      });
    }

    // 易孕期结束后到下次经期开始前
    const easyEndTime = periodStartTime + fertileEndDay * 86400;
    const nextPeriodStartTime = periodStartTime + cycleLength * 86400;
    if (easyEndTime < nextPeriodStartTime) {
      safeTimes.push({
        start: easyEndTime + 86400,
        end: nextPeriodStartTime - 86400,
      });
    }
  }

  // 对21天中的每一天，判断状态
  const processedDayData = dayDataArray.map((dayData) => {
    const currentTime = dayData.timestamp;
    let status: 0 | 1 | 2 | 3 = 0;
    let index = 0;

    // 1. 判断是否为经期
    let foundPeriod = false;
    for (const period of periodCycles) {
      if (currentTime >= period.start && currentTime <= period.end) {
        // 计算经期第几天：index = (currentTime - periodStartTime) / 86400 + 1
        index = Math.floor((currentTime - period.start) / 86400) + 1;

        // 判断是经期还是预测期
        if (period.isFuture) {
          status = 2; // 预测期（未来）
        } else {
          status = 1; // 经期（过去或今天）
        }
        foundPeriod = true;
        break;
      }
    }

    // 2. 判断是否为易孕期（如果不是经期）
    if (!foundPeriod) {
      for (const fertileWindow of fertileWindows) {
        if (currentTime >= fertileWindow.start && currentTime <= fertileWindow.end) {
          // 计算易孕期第几天：index = (currentTime - easyStartTime) / 86400 + 1
          index = Math.floor((currentTime - fertileWindow.start) / 86400) + 1;
          status = 3; // 易孕期
          foundPeriod = true; // 标记为已找到，避免后续判断
          break;
        }
      }
    }

    // 3. 判断是否为安全期（如果不是经期和易孕期）
    if (!foundPeriod) {
      for (const safeTime of safeTimes) {
        if (currentTime > safeTime.start && currentTime < safeTime.end) {
          // 计算安全期第几天：index = (currentTime - start) / 86400 + 1
          index = Math.floor((currentTime - safeTime.start) / 86400) + 1;
          status = 0; // 安全期
          foundPeriod = true;
          break;
        }
      }
    }

    // 4. 如果都不匹配，默认为安全期
    if (!foundPeriod) {
      status = 0;
      index = 0;
    }

    return {
      ...dayData,
      status,
      index,
    };
  });

  // 计算图表尺寸
  const cardWidth = (screenWidth - 24 - 12) / 2;
  const contentPadding = 18 * 2;
  const chartWidth = cardWidth - contentPadding; // 图表宽度

  // 每条线的间距
  const lineSpacing = 12;
  // 第一条线距离顶部
  const firstLineTop = 7;
  // 每条线的高度
  const lineHeight = 2;
  // 每条线上点的间距
  const dotSpacing = chartWidth / 6; // 7个点，6个间距

  // 根据状态获取点的样式
  const getDotStyle = (status: number, isToday: boolean) => {
    if (isToday) {
      // 今天的点：14x18，圆角7
      return {
        width: 14,
        height: 18,
        borderRadius: 7,
        backgroundColor: getStatusColor(status),
      };
    } else {
      // 普通点：根据状态确定大小
      if (status === 0) {
        // 安全期：10x10，圆角5
        return {
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: '#F6F6F6',
        };
      } else {
        // 经期、预测期、易孕期：8x10，圆角4
        return {
          width: 8,
          height: 10,
          borderRadius: 4,
          backgroundColor: getStatusColor(status),
        };
      }
    }
  };

  // 根据状态获取颜色
  const getStatusColor = (status: number): string => {
    switch (status) {
      case 0: // 安全期
        return '#F6F6F6';
      case 1: // 经期
        return '#FE9EB1';
      case 2: // 预测期
        return '#FFFFFF'; // 白色背景
      case 3: // 易孕期
        return '#70B6FE';
      default:
        return '#F6F6F6';
    }
  };

  // 根据状态获取文字颜色（用于今天的点）
  const getTextColor = (status: number): string => {
    switch (status) {
      case 0: // 安全期
        return '#666666'; // 灰色
      case 1: // 经期
        return '#FFFFFF'; // 白色
      case 2: // 预测期
        return '#FD5B7A'; // 红色
      case 3: // 易孕期
        return '#FFFFFF'; // 白色
      default:
        return '#666666';
    }
  };

  // 【第四步：绘制图形】
  // 渲染3条水平线，每条线上7个点
  const renderChart = () => {
    const lines = [];

    // 创建3条水平线（代表3周）
    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      const lineTop = firstLineTop + rowIndex * (lineHeight + lineSpacing);

      // 当前行的数据（7天）
      const rowData = processedDayData.slice(rowIndex * 7, (rowIndex + 1) * 7);

      lines.push(
        <View key={rowIndex} style={styles.chartContainer}>
          {/* 水平线 */}
          <View
            style={{
              position: 'absolute',
              top: lineTop,
              left: 0,
              width: chartWidth,
              height: lineHeight,
              backgroundColor: '#F6F6F6',
            }}
          />

          {/* 在每条线上绘制7个点（代表7天） */}
          {rowData.map((dayData, dotIndex) => {
            const dotX = dotIndex * dotSpacing;
            const dotStyle = getDotStyle(dayData.status, dayData.isToday);
            const textColor = getTextColor(dayData.status);

            // Check if today (weekNum-1 == i*7+j)
            // i = rowIndex, j = dotIndex
            const absoluteIndex = rowIndex * 7 + dotIndex;
            const isToday = dayData.isToday;

            return (
              <React.Fragment key={dotIndex}>
                <View
                  style={{
                    position: 'absolute',
                    left: dotX - dotStyle.width / 2, // 居中对齐
                    top: lineTop - dotStyle.height / 2 + lineHeight / 2, // 垂直居中在线上
                    width: dotStyle.width,
                    height: dotStyle.height,
                    borderRadius: dotStyle.borderRadius,
                    backgroundColor: dotStyle.backgroundColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    // 如果是预测期（白色背景），添加边框
                    ...(dayData.status === 2 && !isToday ? {
                      borderWidth: 1,
                      borderColor: '#E0E0E0',
                    } : {}),
                  }}
                >
                  {/* If today, display "Today" */}
                  {isToday && (
                    <Text
                      style={{
                        fontSize: 8,
                        color: textColor,
                        fontWeight: '600',
                      }}
                    >
                      T
                    </Text>
                  )}
                  {/* 如果是预测期且不是今天，显示图标 */}
                  {dayData.status === 2 && !isToday && (
                    <View
                      style={{
                        width: 4,
                        height: 1,
                        backgroundColor: '#999999',
                      }}
                    />
                  )}
                </View>
              </React.Fragment>
            );
          })}
        </View>
      );
    }

    return lines;
  };

  // 只返回图表部分，日期和状态文本由外层统一渲染
  return (
    <View style={[styles.chartWrapper, { width: chartWidth, height: firstLineTop + 3 * (lineHeight + lineSpacing) - lineSpacing + lineHeight }]}>
      {renderChart()}
    </View>
  );
};

// 导出辅助函数：计算今天的状态文本
export const getPeriodTrackingStatusText = (
  lastPeriodDate: Date | string,
  cycleLength: number = 28,
  periodLength: number = 5,
  fertileStartDay: number = 12,
  fertileEndDay: number = 16
): { statusText: string; statusLabel: string; statusIndex: number } => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTimestamp = Math.floor(today.getTime() / 1000);

  // 解析最后一次经期日期
  const lastPeriod = typeof lastPeriodDate === 'string'
    ? new Date(lastPeriodDate)
    : new Date(lastPeriodDate);
  lastPeriod.setHours(0, 0, 0, 0);
  const lastPeriodTimestamp = Math.floor(lastPeriod.getTime() / 1000);

  // 计算所有经期周期数据
  const periodCycles: Array<{ start: number; end: number; isFuture: boolean }> = [];
  const maxCycles = 3;

  for (let cycleIndex = -1; cycleIndex <= maxCycles; cycleIndex++) {
    const periodStartTime = lastPeriodTimestamp + cycleIndex * cycleLength * 86400;
    const periodEndTime = periodStartTime + (periodLength - 1) * 86400;
    const isFuture = periodStartTime > todayTimestamp;

    periodCycles.push({
      start: periodStartTime,
      end: periodEndTime,
      isFuture,
    });
  }

  // 计算易孕期时间范围
  const fertileWindows: Array<{ start: number; end: number }> = [];
  for (let cycleIndex = -1; cycleIndex <= maxCycles; cycleIndex++) {
    const periodStartTime = lastPeriodTimestamp + cycleIndex * cycleLength * 86400;
    const easyStartTime = periodStartTime + fertileStartDay * 86400;
    const easyEndTime = periodStartTime + fertileEndDay * 86400;

    fertileWindows.push({
      start: easyStartTime,
      end: easyEndTime,
    });
  }

  // 判断今天的状态
  let status: 0 | 1 | 2 | 3 = 0;
  let index = 0;
  let foundPeriod = false;

  // 1. 判断是否为经期
  for (const period of periodCycles) {
    if (todayTimestamp >= period.start && todayTimestamp <= period.end) {
      index = Math.floor((todayTimestamp - period.start) / 86400) + 1;
      if (period.isFuture) {
        status = 2; // 预测期
      } else {
        status = 1; // 经期
      }
      foundPeriod = true;
      break;
    }
  }

  // 2. 判断是否为易孕期
  if (!foundPeriod) {
    for (const fertileWindow of fertileWindows) {
      if (todayTimestamp >= fertileWindow.start && todayTimestamp <= fertileWindow.end) {
        index = Math.floor((todayTimestamp - fertileWindow.start) / 86400) + 1;
        status = 3; // 易孕期
        foundPeriod = true;
        break;
      }
    }
  }

  // 3. 默认为安全期
  if (!foundPeriod) {
    status = 0;
    index = 0;
  }

  // Determine text based on status
  let statusLabel = '';
  if (status === 3) {
    statusLabel = 'Fertile';
  } else if (status === 1) {
    statusLabel = 'Period';
  } else if (status === 2) {
    statusLabel = 'Predicted';
  } else {
    statusLabel = 'Safe';
  }

  // Format display text: "{status} Day {index}"
  const statusText = index > 0 ? `${statusLabel} Day ${index}` : statusLabel;

  return {
    statusText,
    statusLabel,
    statusIndex: index,
  };
};

const styles = StyleSheet.create({
  chartWrapper: {
    position: 'relative',
    left: 6,
  },
  chartContainer: {
    position: 'relative',
    width: '100%',
  },
});

export default PeriodTrackingDots;