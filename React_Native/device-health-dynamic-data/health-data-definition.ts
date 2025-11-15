// Health data configuration (JSON array)
export const healthDataConfig = [
  {"type": "sleep"},
  {"type": "heartRate"},
  {"type": "respiratoryRate"},
  {"type": "bloodOxygen"},
  {"type": "sportRecord"},
  {"type": "periodTracking"}
];


// Sleep stage type constants
export const TYPE_DEEP = '2';    // Deep sleep
export const TYPE_SHALLOW = '1';  // Light sleep
export const TYPE_AWAKE = '3';    // Awake
export const TYPE_REM = '4';      // REM (if available)

// Sleep stage color mapping
export const sleepStageColorMap: { [key: string]: string } = {
  [TYPE_DEEP]: '#345FFD',    // Deep sleep - Blue
  [TYPE_SHALLOW]: '#9B56F5', // Light sleep - Purple
  [TYPE_AWAKE]: '#00D6B3',   // Awake - Green
  [TYPE_REM]: '#069EFE',     // REM - Cyan
};


export const healthData = [
  {
    bg: require('../../../assets/healthData/sleep-bg.png'),
    title: 'Sleep',
    titleCol: '#282828',
    description: 'Sleep monitoring and stress relief',
    descCol: '#999999',
    bgColor: '#F4F0FF', // Purple gradient background
    type: 'sleep',
    data: {
      // sleepStages: [
      //   { type: 'deep', label: '深睡', minutes: 150, color: '#345FFD' }, // 蓝色
      //   { type: 'light', label: '浅睡', minutes: 120, color: '#9B56F5' }, // 紫色
      //   { type: 'awake', label: '清醒', minutes: 30, color: '#00D6B3' }, // 绿色
      //   { type: 'rem', label: '眼动', minutes: 90, color: '#069EFE' }, // 青色
      // ],
      // date: '06/06',
      // totalMinutes: 390, // 总睡眠时长（分钟）
    },
  },
  {
    bg: require('../../../assets/healthData/heart-health-bg.png'),
    title: 'Heart Rate',
    titleCol: '#282828',
    description: 'Heart rate monitoring and ECG interpretation',
    descCol: '#999999',
    lineColor: '#FF7300', // Orange gradient background
    type: 'heartRate',
    data: {
      // date: '06/06',
      // unit: '次/分钟',
    },
  },
  {
    bg: require('../../../assets/healthData/respiratory-rate-bg.png'),
    title: 'Respiratory Rate',
    titleCol: '#282828',
    description: 'Improve lung function, relax and unwind',
    descCol: '#999999',
    bgColor: '#E8F8F5', // Cyan gradient background
    lineColor: '#1EC972', // Green (consistent with image description)
    type: 'respiratoryRate',
    data: {
      // date: '11/17',
      // unit: '次',
    },
  },
  {
    bg: require('../../../assets/healthData/blood-oxygen-bg.png'),
    title: 'Blood Oxygen',
    titleCol: '#282828',
    description: 'Continuous blood oxygen, high-altitude detection',
    descCol: '#999999',
    bgColor: '#FFF4E8', // Orange gradient background
    lineColor: '#345FFD', // Blue (consistent with image description)
    type: 'bloodOxygen',
    data: {
      // date: '01/18',
      // unit: '%',
    },
  },
  {
    bg: require('../../../assets/healthData/sport-record-bg.png'),
    title: 'Sport Record',
    titleCol: '#282828',
    description: 'Record your workouts, witness transformation',
    descCol: '#999999',
    bgColor: '#FFFFFF', // White background
    type: 'sportRecord',
    data: {
      // type: 2, // 运动记录数据类型
      // date: '11/17',
      // unit: 'km',
      // distance: 1000,
      // kcal: 28,
    },
  },
  // 示例：模式3 - 有数据 + 无背景图（显示 MapTrajectory）
  // {
  //   bg: require('../../../assets/healthData/sport-record-bg.png'),
  //   title: '运动记录',
  //   titleCol: '#282828',
  //   description: '记录运动，见证蜕变',
  //   descCol: '#999999',
  //   bgColor: '#FFFFFF',
  //   sportType: 99, // 不存在的 sportType，会触发 MapTrajectory 显示
  //   type:'SportRecord',
  //   data: {
  //     type: 'mapTrajectory',
  //     date: '11/17',
  //     currentValue: 100,
  //     unit: 'km',
  //     coordinates: [
  //       { latitude: 39.9042, longitude: 116.4074 },
  //       { latitude: 39.9050, longitude: 116.4080 },
  //       { latitude: 39.9060, longitude: 116.4090 },
  //       { latitude: 39.9070, longitude: 116.4100 },
  //       { latitude: 39.9080, longitude: 116.4110 },
  //       { latitude: 39.9090, longitude: 116.4120 },
  //       { latitude: 39.9100, longitude: 116.4130 },
  //     ],
  //   },
  // },
  {
    bg: require('../../../assets/healthData/menstrual-track-bg.png'),
    title: 'Period Tracking',
    titleCol: '#282828',
    description: 'Predict periods, prepare in advance',
    descCol: '#999999',
    bgColor: '#FFFFFF', // White background
    type: 'periodTracking',
    data: {
      // recordDate: '11/05', // 今天日期
      // 最后一次经期开始日期（格式：YYYY-MM-DD 字符串或 Date 对象）
      // 示例1：使用字符串格式（推荐）
      // lastPeriodDate: '2025-11-05', // 最后一次经期开始日期，例如：2025-01-05
      // 示例2：使用 Date 对象
      // lastPeriodDate: new Date('2025-01-05'),
      // 示例3：动态计算（假设最后一次经期是10天前）
      // lastPeriodDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      
      // cycleLength: 28, // 周期长度（天），默认28天
      // periodLength: 5, // 经期长度（天），默认5天
      // fertileStartDay: 12, // 易孕期开始天数（默认12天，即排卵日前5天）
      // fertileEndDay: 16, // 易孕期结束天数（默认16天，即排卵日后1天）
    },
  },
];


// Sport type image mapping (React Native require doesn't support dynamic paths, needs static mapping)
export const sportImagePathMap: { [key: string]: any } = {
  'img_treadmill': require('../../../assets/healthData/img_treadmill_center.png'),
  'img_outdoorscene': require('../../../assets/healthData/img_outdoorscene_center.png'),
  'img_mountainpeak': require('../../../assets/healthData/img_mountainpeak_center.png'),
  'img_indoorscene': require('../../../assets/healthData/img_indoorscene_center.png'),
  'img_swimmingpool': require('../../../assets/healthData/img_swimmingpool_center.png'),
  'img_pingpong': require('../../../assets/healthData/img_pingpong_center.png'),
  'img_golf': require('../../../assets/healthData/img_golf_center.png'),
};

// Map numeric card types to configuration types
// 0-sport, 1-sleep, 2-heart rate, 3-respiratory rate, 4-blood oxygen, 5-period tracking
// This mapping is used in multiple places:
// 1. Convert displayedCards number array to configuration type array
// 2. Map API returned cardType to dataKey
// 3. Map backend returned backendType to dataTypeKey
export const cardTypeMapping: { [key: number]: string } = {
  0: 'sportRecord',      // Sport
  1: 'sleep',            // Sleep
  2: 'heartRate',        // Heart rate
  3: 'respiratoryRate',  // Respiratory rate
  4: 'bloodOxygen',      // Blood oxygen
  5: 'periodTracking',   // Period tracking
};

// Default export health data configuration
export default healthDataConfig;
