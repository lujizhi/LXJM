// LXJM具身智能设备管理平台 - 模拟数据

// ==================== 算法管理 ====================
export interface Algorithm {
  algorithm_id: string;
  algorithm_name: string;
  algorithm_type: 'hair_exposure' | 'fragile_label' | 'station_dashboard';
  algorithm_version: string;
  model_file_path: string;
  accuracy: number;
  recall: number;
  f1_score: number;
  detection_threshold: number;
  status: 'training' | 'pending' | 'online' | 'offline';
  created_at: string;
  updated_at: string;
  description: string;
  associated_devices: number;
  recognition_content: string;
  applicable_scenarios: string;
}

export const algorithms: Algorithm[] = [
  {
    algorithm_id: 'algo-001',
    algorithm_name: '头发外露检测算法',
    algorithm_type: 'hair_exposure',
    algorithm_version: 'v2.1.3',
    model_file_path: '/models/hair_v2.1.3.onnx',
    accuracy: 0.963,
    recall: 0.941,
    f1_score: 0.952,
    detection_threshold: 0.75,
    status: 'online',
    created_at: '2025-01-15 10:30:00',
    updated_at: '2025-04-20 14:22:00',
    description: '基于YOLOv8的头发外露检测算法，支持多角度识别',
    associated_devices: 8,
    recognition_content: '头发外露、防护帽佩戴违规',
    applicable_scenarios: '无尘车间人员出入检测、生产操作工位合规检查',
  },
  {
    algorithm_id: 'algo-002',
    algorithm_name: '头发外露检测算法',
    algorithm_type: 'hair_exposure',
    algorithm_version: 'v2.2.0-beta',
    model_file_path: '/models/hair_v2.2.0.onnx',
    accuracy: 0.971,
    recall: 0.955,
    f1_score: 0.963,
    detection_threshold: 0.72,
    status: 'pending',
    created_at: '2025-04-18 09:15:00',
    updated_at: '2025-04-25 16:40:00',
    description: '优化小目标检测能力，增加侧视角识别支持',
    associated_devices: 0,
    recognition_content: '头发外露、防护帽佩戴违规、侧视角头发识别',
    applicable_scenarios: '无尘车间人员出入检测、多角度场景适配',
  },
  {
    algorithm_id: 'algo-003',
    algorithm_name: '易碎标签缺陷检测算法',
    algorithm_type: 'fragile_label',
    algorithm_version: 'v1.5.2',
    model_file_path: '/models/label_v1.5.2.onnx',
    accuracy: 0.948,
    recall: 0.923,
    f1_score: 0.935,
    detection_threshold: 0.8,
    status: 'online',
    created_at: '2024-11-20 14:00:00',
    updated_at: '2025-03-10 11:30:00',
    description: '标签破损、模糊、脱落等多类型缺陷识别',
    associated_devices: 5,
    recognition_content: '标签破损、标签模糊、标签脱落',
    applicable_scenarios: '产线标签质量检测、入库标签核验',
  },
  {
    algorithm_id: 'algo-004',
    algorithm_name: '易碎标签缺陷检测算法',
    algorithm_type: 'fragile_label',
    algorithm_version: 'v1.6.0',
    model_file_path: '/models/label_v1.6.0.onnx',
    accuracy: 0.912,
    recall: 0.889,
    f1_score: 0.900,
    detection_threshold: 0.78,
    status: 'training',
    created_at: '2025-04-22 08:00:00',
    updated_at: '2025-04-27 10:00:00',
    description: '新增褶皱缺陷类型识别，训练中',
    associated_devices: 0,
    recognition_content: '标签破损、标签模糊、标签脱落、标签褶皱',
    applicable_scenarios: '产线标签质量检测、新品标签核验',
  },
  {
    algorithm_id: 'algo-005',
    algorithm_name: '工位不良看板识别算法',
    algorithm_type: 'station_dashboard',
    algorithm_version: 'v1.3.0',
    model_file_path: '/models/dashboard_v1.3.0.onnx',
    accuracy: 0.935,
    recall: 0.918,
    f1_score: 0.926,
    detection_threshold: 0.7,
    status: 'online',
    created_at: '2025-02-10 16:20:00',
    updated_at: '2025-04-15 09:45:00',
    description: '工位状态自动识别与统计（正常/异常/空闲）',
    associated_devices: 12,
    recognition_content: '工位状态（正常/异常/空闲）、工位利用率',
    applicable_scenarios: '生产车间工位实时监控、产能分析',
  },
  {
    algorithm_id: 'algo-006',
    algorithm_name: '工位不良看板识别算法',
    algorithm_type: 'station_dashboard',
    algorithm_version: 'v1.2.1',
    model_file_path: '/models/dashboard_v1.2.1.onnx',
    accuracy: 0.921,
    recall: 0.905,
    f1_score: 0.913,
    detection_threshold: 0.72,
    status: 'offline',
    created_at: '2024-12-05 11:00:00',
    updated_at: '2025-02-10 16:20:00',
    description: '旧版本，已被v1.3.0替代',
    associated_devices: 0,
    recognition_content: '工位状态（正常/异常/空闲）',
    applicable_scenarios: '生产车间工位监控（已停用）',
  },
];

// ==================== 地图管理 ====================
export interface MapItem {
  map_id: string;
  map_name: string;
  map_type: 'factory' | 'workshop' | 'warehouse';
  map_size: string;
  map_status: 'draft' | 'active' | 'archived';
  device_id?: string;
  points: MapPoint[];
  lines: MapLine[];
  areas: MapArea[];
  arm_poses: ArmPose[];
}

// 机械臂姿态
export interface ArmPose {
  pose_id: string;
  pose_name: string;
  joint_angles: number[]; // 7个关节角度
  captured_at: string;
}

export interface MapPoint {
  point_id: string;
  point_name: string;
  point_type: 'patrol' | 'charging';
  x: number;
  y: number;
  yaw: number; // 偏航角度 -180 ~ 180
  is_device?: boolean; // 是否为设备点位
  voice_content: string;
  voice_volume: number; // 语音音量 0-100
  // 机械臂配置
  arm_config: {
    mode: 'preset' | 'custom'; // 预设姿态或自定义
    enabled: boolean; // 是否启用姿态执行
    preset_poses?: { pose_id: string; algorithm_id?: string }[]; // 预设姿态列表(含关联算法)
    custom_poses?: { name: string; joint_angles: number[]; algorithm_id?: string }[]; // 自定义姿态列表(含关联算法)
    speed?: number; // 运行速度 1-100
  };
}

export interface MapLine {
  line_id: string;
  line_name: string;
  point_ids: string[];
  line_type: 'patrol' | 'transport';
}

export interface MapArea {
  area_id: string;
  area_name: string;
  area_type: 'standard' | 'restricted' | 'forbidden';
  vertices: { x: number; y: number }[];
  description?: string;
  speed_limit?: number;
  posture?: 'normal' | 'slow' | 'crawl';
}

export const maps: MapItem[] = [
  {
    map_id: 'map-001',
    map_name: 'A栋3F生产车间',
    map_type: 'workshop',
    map_size: '120m×80m',
    map_status: 'active',
    device_id: 'dev-001',
    points: [
      { point_id: 'mp-001', point_name: '入口检测点', point_type: 'patrol', x: 10, y: 40, yaw: 0, voice_content: '已到达入口检测点，开始拍照检测', voice_volume: 80, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-002', algorithm_id: 'algo-001' }], speed: 50 } },
      { point_id: 'mp-002', point_name: '产线A巡检点', point_type: 'patrol', x: 30, y: 30, yaw: 45, voice_content: '产线A巡检中，请注意避让', voice_volume: 70, arm_config: { mode: 'custom', enabled: true, custom_poses: [{ name: '自定义姿态1', joint_angles: [0, -30, 45, 0, 0, 0, 0] }], speed: 40 } },
      { point_id: 'mp-003', point_name: '标签检测区', point_type: 'patrol', x: 50, y: 25, yaw: 90, voice_content: '开始标签检测，请勿移动目标物体', voice_volume: 90, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-002', algorithm_id: 'algo-003' }], speed: 30 } },
      { point_id: 'mp-004', point_name: '质检工位', point_type: 'patrol', x: 65, y: 45, yaw: -30, is_device: true, voice_content: '质检工位到达，开始视觉检测', voice_volume: 85, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-001', algorithm_id: 'algo-001' }], speed: 50 } },
      { point_id: 'mp-005', point_name: '产线B巡检点', point_type: 'patrol', x: 80, y: 35, yaw: 180, voice_content: '产线B巡检进行中', voice_volume: 60, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-001' }], speed: 60 } },
      { point_id: 'mp-006', point_name: '充电桩', point_type: 'charging', x: 95, y: 70, yaw: 0, voice_content: '已到达充电桩，开始充电', voice_volume: 50, arm_config: { mode: 'preset', enabled: false, preset_poses: [{ pose_id: 'pose-001' }], speed: 20 } },
      { point_id: 'mp-007', point_name: '出口确认点', point_type: 'patrol', x: 110, y: 40, yaw: -90, voice_content: '出口确认，巡检任务即将完成', voice_volume: 70, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-001' }], speed: 50 } },
    ],
    lines: [
      { line_id: 'ml-001', line_name: '主巡检路线A', point_ids: ['mp-001', 'mp-002', 'mp-003', 'mp-004'], line_type: 'patrol' },
      { line_id: 'ml-002', line_name: '主巡检路线B', point_ids: ['mp-004', 'mp-005', 'mp-006', 'mp-007'], line_type: 'patrol' },
      { line_id: 'ml-003', line_name: '充电路线', point_ids: ['mp-005', 'mp-006'], line_type: 'transport' },
    ],
    areas: [
      { area_id: 'ma-001', area_name: '货架禁止通行区', area_type: 'forbidden', vertices: [{ x: 40, y: 50 }, { x: 60, y: 50 }, { x: 60, y: 70 }, { x: 40, y: 70 }], description: '货架区域，路径规划完全避开' },
      { area_id: 'ma-002', area_name: '标准通行区A', area_type: 'standard', vertices: [{ x: 20, y: 20 }, { x: 45, y: 20 }, { x: 45, y: 45 }, { x: 20, y: 45 }], description: '开放区域，可自由规划路径' },
      { area_id: 'ma-003', area_name: '限制通行区-狭窄通道', area_type: 'restricted', vertices: [{ x: 88, y: 62 }, { x: 105, y: 62 }, { x: 105, y: 78 }, { x: 88, y: 78 }], description: '狭窄通道，需减速通过', speed_limit: 0.5, posture: 'slow' },
    ],
    arm_poses: [
      { pose_id: 'pose-001', pose_name: '默认姿态', joint_angles: [0, 0, 0, 0, 0, 0, 0], captured_at: '2025-01-10 09:30:00' },
      { pose_id: 'pose-002', pose_name: '拍照姿态', joint_angles: [15, -30, 45, 0, 10, 0, 0], captured_at: '2025-01-10 10:15:00' },
    ],
  },
  {
    map_id: 'map-002',
    map_name: 'B栋1F仓储区',
    map_type: 'warehouse',
    map_size: '200m×100m',
    map_status: 'active',
    device_id: 'dev-003',
    points: [
      { point_id: 'mp-008', point_name: '仓库入口', point_type: 'patrol', x: 10, y: 50, yaw: 0, voice_content: '仓库入口已到达', voice_volume: 70, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-003' }], speed: 50 } },
      { point_id: 'mp-009', point_name: '货架A区', point_type: 'patrol', x: 50, y: 30, yaw: 90, voice_content: '货架A区巡检中', voice_volume: 80, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-003' }], speed: 40 } },
      { point_id: 'mp-010', point_name: '货架B区', point_type: 'patrol', x: 100, y: 30, yaw: -45, voice_content: '货架B区巡检中', voice_volume: 80, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-003' }], speed: 40 } },
      { point_id: 'mp-011', point_name: '出货区', point_type: 'patrol', x: 150, y: 70, yaw: 180, is_device: true, voice_content: '出货区到达，开始检测', voice_volume: 75, arm_config: { mode: 'custom', enabled: true, custom_poses: [{ name: '自定义姿态1', joint_angles: [10, -20, 30, 0, 0, 0, 0] }], speed: 35 } },
      { point_id: 'mp-012', point_name: '充电站', point_type: 'charging', x: 180, y: 85, yaw: 0, voice_content: '已到达充电站', voice_volume: 50, arm_config: { mode: 'preset', enabled: false, preset_poses: [{ pose_id: 'pose-003' }], speed: 20 } },
    ],
    lines: [
      { line_id: 'ml-004', line_name: '仓储巡检路线', point_ids: ['mp-008', 'mp-009', 'mp-010', 'mp-011'], line_type: 'patrol' },
      { line_id: 'ml-005', line_name: '返程路线', point_ids: ['mp-011', 'mp-012', 'mp-008'], line_type: 'transport' },
    ],
    areas: [
      { area_id: 'ma-004', area_name: '货架标准通行区', area_type: 'standard', vertices: [{ x: 35, y: 15 }, { x: 120, y: 15 }, { x: 120, y: 50 }, { x: 35, y: 50 }], description: '货架区域通道' },
      { area_id: 'ma-005', area_name: '充电区域', area_type: 'restricted', vertices: [{ x: 170, y: 75 }, { x: 195, y: 75 }, { x: 195, y: 95 }, { x: 170, y: 95 }], description: '充电区域，需减速通过', speed_limit: 0.3, posture: 'slow' },
    ],
    arm_poses: [
      { pose_id: 'pose-003', pose_name: '巡检姿态', joint_angles: [10, -20, 30, 0, 5, 0, 0], captured_at: '2025-02-05 15:00:00' },
    ],
  },
  {
    map_id: 'map-003',
    map_name: 'C栋全层工厂',
    map_type: 'factory',
    map_size: '300m×200m',
    map_status: 'draft',
    device_id: 'dev-005',
    points: [
      { point_id: 'mp-013', point_name: '工厂入口', point_type: 'patrol', x: 15, y: 100, yaw: 0, voice_content: '工厂入口确认', voice_volume: 70, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-001' }], speed: 50 } },
      { point_id: 'mp-014', point_name: '生产线1', point_type: 'patrol', x: 80, y: 60, yaw: 45, is_device: true, voice_content: '生产线1巡检中', voice_volume: 85, arm_config: { mode: 'custom', enabled: true, custom_poses: [{ name: '自定义姿态1', joint_angles: [20, -40, 50, 10, 0, 0, 0] }], speed: 45 } },
      { point_id: 'mp-015', point_name: '生产线2', point_type: 'patrol', x: 80, y: 140, yaw: -45, is_device: true, voice_content: '生产线2巡检中', voice_volume: 85, arm_config: { mode: 'custom', enabled: true, custom_poses: [{ name: '自定义姿态1', joint_angles: [20, -40, 50, 10, 0, 0, 0] }], speed: 45 } },
      { point_id: 'mp-016', point_name: '仓库区', point_type: 'patrol', x: 200, y: 100, yaw: 90, voice_content: '仓库区到达', voice_volume: 60, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-001' }], speed: 30 } },
    ],
    lines: [
      { line_id: 'ml-006', line_name: '基础巡检路线', point_ids: ['mp-013', 'mp-014', 'mp-015', 'mp-016'], line_type: 'patrol' },
    ],
    areas: [
      { area_id: 'ma-006', area_name: '核心生产区', area_type: 'standard', vertices: [{ x: 60, y: 40 }, { x: 120, y: 40 }, { x: 120, y: 160 }, { x: 60, y: 160 }], description: '核心生产开放区域' },
    ],
    arm_poses: [],
  },
  {
    map_id: 'map-004',
    map_name: 'A栋2F组装车间',
    map_type: 'workshop',
    map_size: '100m×60m',
    map_status: 'active',
    device_id: 'dev-004',
    points: [
      { point_id: 'mp-017', point_name: '标签区入口', point_type: 'patrol', x: 10, y: 30, yaw: 0, voice_content: '标签区入口，开始检测', voice_volume: 90, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-004', algorithm_id: 'algo-003' }], speed: 30 } },
      { point_id: 'mp-018', point_name: '标签检测位1', point_type: 'patrol', x: 35, y: 20, yaw: 30, voice_content: '标签检测位1，执行拍照', voice_volume: 95, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-004', algorithm_id: 'algo-003' }], speed: 25 } },
      { point_id: 'mp-019', point_name: '标签检测位2', point_type: 'patrol', x: 55, y: 20, yaw: 60, voice_content: '标签检测位2，执行拍照', voice_volume: 95, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-004', algorithm_id: 'algo-003' }], speed: 25 } },
      { point_id: 'mp-020', point_name: '返修区', point_type: 'patrol', x: 55, y: 45, yaw: -90, voice_content: '返修区到达，注意异常品', voice_volume: 80, arm_config: { mode: 'custom', enabled: true, custom_poses: [{ name: '自定义姿态1', joint_angles: [5, -15, 30, 0, 0, 0, 0] }], speed: 40 } },
      { point_id: 'mp-021', point_name: '出口确认点', point_type: 'patrol', x: 90, y: 30, yaw: 180, voice_content: '巡检完成，准备离开', voice_volume: 60, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-001', algorithm_id: 'algo-001' }], speed: 50 } },
    ],
    lines: [
      { line_id: 'ml-007', line_name: '标签检测路线', point_ids: ['mp-017', 'mp-018', 'mp-019', 'mp-020', 'mp-021'], line_type: 'patrol' },
    ],
    areas: [
      { area_id: 'ma-007', area_name: '标签检测标准区', area_type: 'standard', vertices: [{ x: 25, y: 10 }, { x: 65, y: 10 }, { x: 65, y: 35 }, { x: 25, y: 35 }], description: '标签检测开放区域' },
    ],
    arm_poses: [
      { pose_id: 'pose-004', pose_name: '检测姿态', joint_angles: [0, -45, 60, 0, 15, 0, 0], captured_at: '2024-12-15 17:00:00' },
    ],
  },
  {
    map_id: 'map-005',
    map_name: 'D栋质检车间（旧）',
    map_type: 'workshop',
    map_size: '80m×50m',
    map_status: 'archived',
    points: [
      { point_id: 'mp-022', point_name: '质检入口', point_type: 'patrol', x: 10, y: 25, yaw: 0, voice_content: '质检车间入口', voice_volume: 70, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-001' }], speed: 50 } },
      { point_id: 'mp-023', point_name: '质检工位1', point_type: 'patrol', x: 40, y: 20, yaw: 45, voice_content: '质检工位1到达', voice_volume: 80, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-001' }], speed: 40 } },
      { point_id: 'mp-024', point_name: '质检工位2', point_type: 'patrol', x: 60, y: 35, yaw: -45, voice_content: '质检工位2到达', voice_volume: 80, arm_config: { mode: 'preset', enabled: true, preset_poses: [{ pose_id: 'pose-001' }], speed: 40 } },
    ],
    lines: [
      { line_id: 'ml-008', line_name: '质检路线', point_ids: ['mp-022', 'mp-023', 'mp-024'], line_type: 'patrol' },
    ],
    areas: [
      { area_id: 'ma-008', area_name: '质检标准区', area_type: 'standard', vertices: [{ x: 30, y: 10 }, { x: 70, y: 10 }, { x: 70, y: 45 }, { x: 30, y: 45 }], description: '质检开放区域' },
    ],
    arm_poses: [],
  },
];

export const mapList = maps;

// ==================== 设备管理 ====================
export interface DeviceAccessory {
  accessory_id: string;
  accessory_name: string;
  accessory_type: 'mechanical_arm' | 'camera' | 'sensor' | 'light' | 'loudspeaker';
  status: 'online' | 'offline' | 'fault';
  model: string;
}

export interface Device {
  device_id: string;
  device_name: string;
  device_code: string;
  device_type: 'robot_dog' | 'mechanical_arm' | 'camera' | 'sensor' | 'light';
  parent_device_id: string | null;
  model: string;
  serial_number: string;
  firmware_version: string;
  status: 'online' | 'offline' | 'fault' | 'sleeping' | 'charging' | 'running' | 'paused';
  battery_level: number;
  current_location: { x: number; y: number };
  last_communication: string;
  current_task_id: string | null;
  network_signal: number;
  accessories: DeviceAccessory[];
  created_at: string;
}

export const devices: Device[] = [
  {
    device_id: 'dev-001',
    device_name: '机器狗-A001',
    device_code: 'RD-A001',
    device_type: 'robot_dog',
    parent_device_id: null,
    model: '云深处山猫M20 Pro',
    serial_number: 'SN20250101001',
    firmware_version: 'v3.2.1',
    status: 'running',
    battery_level: 72,
    current_location: { x: 45.2, y: 30.8 },
    last_communication: '2025-04-27 16:55:00',
    current_task_id: 'task-001',
    network_signal: 88,
    accessories: [
      { accessory_id: 'acc-001', accessory_name: '高清摄像头', accessory_type: 'camera', status: 'online', model: 'Cam-HD200' },
      { accessory_id: 'acc-002', accessory_name: '机械臂-M1', accessory_type: 'mechanical_arm', status: 'online', model: 'Arm-Lite5' },
      { accessory_id: 'acc-003', accessory_name: '环境传感器', accessory_type: 'sensor', status: 'online', model: 'Env-S100' },
      { accessory_id: 'acc-010', accessory_name: '喊话器-01', accessory_type: 'loudspeaker', status: 'online', model: 'SPK-A3F' },
    ],
    created_at: '2025-01-05 10:00:00',
  },
  {
    device_id: 'dev-002',
    device_name: '机器狗-A002',
    device_code: 'RD-A002',
    device_type: 'robot_dog',
    parent_device_id: null,
    model: '云深处山猫M20 Pro',
    serial_number: 'SN20250101002',
    firmware_version: 'v3.2.1',
    status: 'charging',
    battery_level: 45,
    current_location: { x: 10.0, y: 5.0 },
    last_communication: '2025-04-27 16:54:30',
    current_task_id: null,
    network_signal: 92,
    accessories: [
      { accessory_id: 'acc-004', accessory_name: '红外摄像头', accessory_type: 'camera', status: 'online', model: 'Cam-IR150' },
      { accessory_id: 'acc-005', accessory_name: '补光灯', accessory_type: 'light', status: 'offline', model: 'Light-LED30' },
    ],
    created_at: '2025-01-05 10:15:00',
  },
  {
    device_id: 'dev-003',
    device_name: '机器狗-B001',
    device_code: 'RD-B001',
    device_type: 'robot_dog',
    parent_device_id: null,
    model: '云深处山猫M20 Pro',
    serial_number: 'SN20250202001',
    firmware_version: 'v3.1.0',
    status: 'online',
    battery_level: 91,
    current_location: { x: 80.5, y: 45.0 },
    last_communication: '2025-04-27 16:55:12',
    current_task_id: null,
    network_signal: 76,
    accessories: [
      { accessory_id: 'acc-006', accessory_name: '全景摄像头', accessory_type: 'camera', status: 'online', model: 'Cam-Pano360' },
    ],
    created_at: '2025-02-01 14:00:00',
  },
  {
    device_id: 'dev-004',
    device_name: '机器狗-A003',
    device_code: 'RD-A003',
    device_type: 'robot_dog',
    parent_device_id: null,
    model: '云深处山猫M20 Pro',
    serial_number: 'SN20250301001',
    firmware_version: 'v3.2.0',
    status: 'fault',
    battery_level: 15,
    current_location: { x: 55.3, y: 22.1 },
    last_communication: '2025-04-27 15:30:00',
    current_task_id: null,
    network_signal: 0,
    accessories: [
      { accessory_id: 'acc-007', accessory_name: '高清摄像头', accessory_type: 'camera', status: 'fault', model: 'Cam-HD200' },
    ],
    created_at: '2025-03-01 09:00:00',
  },
  {
    device_id: 'dev-005',
    device_name: '机器狗-C001',
    device_code: 'RD-C001',
    device_type: 'robot_dog',
    parent_device_id: null,
    model: '云深处山猫M20 Pro',
    serial_number: 'SN20250401001',
    firmware_version: 'v4.0.0-beta',
    status: 'sleeping',
    battery_level: 100,
    current_location: { x: 0, y: 0 },
    last_communication: '2025-04-27 08:00:00',
    current_task_id: null,
    network_signal: 65,
    accessories: [
      { accessory_id: 'acc-008', accessory_name: '激光雷达', accessory_type: 'sensor', status: 'online', model: 'Lidar-X1' },
      { accessory_id: 'acc-009', accessory_name: '机械臂-H1', accessory_type: 'mechanical_arm', status: 'online', model: 'Arm-Heavy10' },
    ],
    created_at: '2025-04-01 11:00:00',
  },
  {
    device_id: 'dev-006',
    device_name: '机器狗-A004',
    device_code: 'RD-A004',
    device_type: 'robot_dog',
    parent_device_id: null,
    model: '云深处山猫M20 Pro',
    serial_number: 'SN20250415001',
    firmware_version: 'v3.2.1',
    status: 'offline',
    battery_level: 0,
    current_location: { x: 0, y: 0 },
    last_communication: '2025-04-25 18:00:00',
    current_task_id: null,
    network_signal: 0,
    accessories: [],
    created_at: '2025-04-15 16:00:00',
  },
];

// ==================== 任务管理 ====================
export interface TaskStep {
  step_id: string;
  point_name: string;
  point_type: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  started_at: string | null;
  completed_at: string | null;
  algorithm_name: string | null;
  action: string;
  arm_photos?: string[];
}

export interface Task {
  task_id: string;
  task_name: string;
  task_type: 'patrol' | 'inspection' | 'monitoring' | 'emergency';
  map_id: string;
  map_name: string;
  device_id: string;
  device_name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'paused' | 'cancelled' | 'failed';
  schedule_type: 'immediate' | 'scheduled' | 'periodic';
  period_interval?: number;
  scheduled_time: string | null;
  navigation_mode?: 'autonomous' | 'linear';
  completion_action?: 'return_charger' | 'wait_in_place';
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  steps: TaskStep[];
  progress: number;
  report_generated: boolean;
}

export const tasks: Task[] = [
  {
    task_id: 'task-001',
    task_name: 'A3F车间日常巡检',
    task_type: 'patrol',
    map_id: 'map-001',
    map_name: 'A栋3F生产车间',
    device_id: 'dev-001',
    device_name: '机器狗-A001',
    status: 'in_progress',
    schedule_type: 'periodic',
    scheduled_time: null,
    created_at: '2025-04-27 08:00:00',
    started_at: '2025-04-27 08:30:00',
    completed_at: null,
    progress: 62,
    steps: [
      { step_id: 's1', point_name: 'P01-入口检测点', point_type: 'patrol', status: 'completed', started_at: '08:30', completed_at: '08:35', algorithm_name: '头发外露检测算法', action: '拍照+算法检测' },
      { step_id: 's2', point_name: 'P02-产线A巡检点', point_type: 'patrol', status: 'completed', started_at: '08:36', completed_at: '08:42', algorithm_name: '工位不良看板识别算法', action: '拍照+录像' },
      { step_id: 's3', point_name: 'P03-标签检测区', point_type: 'patrol', status: 'completed', started_at: '08:43', completed_at: '08:50', algorithm_name: '易碎标签缺陷检测算法', action: '算法检测+数据上报' },
      { step_id: 's4', point_name: 'P04-质检工位', point_type: 'patrol', status: 'in_progress', started_at: '08:51', completed_at: null, algorithm_name: '头发外露检测算法', action: '拍照+算法检测' },
      { step_id: 's5', point_name: 'P05-产线B巡检点', point_type: 'patrol', status: 'pending', started_at: null, completed_at: null, algorithm_name: null, action: '拍照+录像' },
      { step_id: 's6', point_name: 'P06-充电桩', point_type: 'charging', status: 'pending', started_at: null, completed_at: null, algorithm_name: null, action: '自动充电' },
    ],
    report_generated: false,
  },
  {
    task_id: 'task-002',
    task_name: 'B1F仓储区安全巡检',
    task_type: 'inspection',
    map_id: 'map-002',
    map_name: 'B栋1F仓储区',
    device_id: 'dev-003',
    device_name: '机器狗-B001',
    status: 'pending',
    schedule_type: 'scheduled',
    scheduled_time: '2025-04-27 22:00:00',
    created_at: '2025-04-27 07:00:00',
    started_at: null,
    completed_at: null,
    progress: 0,
    steps: [
      { step_id: 's1', point_name: 'W01-仓库入口', point_type: 'patrol', status: 'pending', started_at: null, completed_at: null, algorithm_name: null, action: '拍照' },
      { step_id: 's2', point_name: 'W02-货架A区', point_type: 'patrol', status: 'pending', started_at: null, completed_at: null, algorithm_name: null, action: '环境检测' },
      { step_id: 's3', point_name: 'W03-货架B区', point_type: 'patrol', status: 'pending', started_at: null, completed_at: null, algorithm_name: null, action: '环境检测' },
    ],
    report_generated: false,
  },
  {
    task_id: 'task-003',
    task_name: 'A2F组装车间标签质检',
    task_type: 'inspection',
    map_id: 'map-004',
    map_name: 'A栋2F组装车间',
    device_id: 'dev-001',
    device_name: '机器狗-A001',
    status: 'completed',
    schedule_type: 'immediate',
    scheduled_time: null,
    created_at: '2025-04-26 14:00:00',
    started_at: '2025-04-26 14:05:00',
    completed_at: '2025-04-26 15:30:00',
    progress: 100,
    steps: [
      { step_id: 's1', point_name: 'A01-标签区入口', point_type: 'patrol', status: 'completed', started_at: '14:05', completed_at: '14:10', algorithm_name: '易碎标签缺陷检测算法', action: '算法检测' },
      { step_id: 's2', point_name: 'A02-标签检测位1', point_type: 'patrol', status: 'completed', started_at: '14:11', completed_at: '14:25', algorithm_name: '易碎标签缺陷检测算法', action: '拍照+算法检测' },
      { step_id: 's3', point_name: 'A03-标签检测位2', point_type: 'patrol', status: 'completed', started_at: '14:26', completed_at: '14:40', algorithm_name: '易碎标签缺陷检测算法', action: '拍照+算法检测' },
      { step_id: 's4', point_name: 'A04-返修区', point_type: 'patrol', status: 'completed', started_at: '14:41', completed_at: '14:55', algorithm_name: '头发外露检测算法', action: '拍照+检测' },
      { step_id: 's5', point_name: 'A05-出口确认', point_type: 'patrol', status: 'completed', started_at: '14:56', completed_at: '15:00', algorithm_name: null, action: '确认完成' },
    ],
    report_generated: true,
  },
  {
    task_id: 'task-004',
    task_name: 'A3F紧急排查任务',
    task_type: 'emergency',
    map_id: 'map-001',
    map_name: 'A栋3F生产车间',
    device_id: 'dev-002',
    device_name: '机器狗-A002',
    status: 'failed',
    schedule_type: 'immediate',
    scheduled_time: null,
    created_at: '2025-04-25 19:00:00',
    started_at: '2025-04-25 19:05:00',
    completed_at: '2025-04-25 19:15:00',
    progress: 20,
    steps: [
      { step_id: 's1', point_name: 'P10-异常区入口', point_type: 'patrol', status: 'completed', started_at: '19:05', completed_at: '19:08', algorithm_name: null, action: '拍照' },
      { step_id: 's2', point_name: 'P11-异常区域', point_type: 'patrol', status: 'failed', started_at: '19:09', completed_at: null, algorithm_name: '工位不良看板识别算法', action: '算法检测' },
    ],
    report_generated: false,
  },
  {
    task_id: 'task-005',
    task_name: 'A3F夜间定期巡检',
    task_type: 'patrol',
    map_id: 'map-001',
    map_name: 'A栋3F生产车间',
    device_id: 'dev-001',
    device_name: '机器狗-A001',
    status: 'completed',
    schedule_type: 'periodic',
    scheduled_time: null,
    created_at: '2025-04-26 22:00:00',
    started_at: '2025-04-26 22:30:00',
    completed_at: '2025-04-27 00:15:00',
    progress: 100,
    steps: [
      { step_id: 's1', point_name: 'P01-入口检测点', point_type: 'patrol', status: 'completed', started_at: '22:30', completed_at: '22:35', algorithm_name: '头发外露检测算法', action: '拍照+检测' },
      { step_id: 's2', point_name: 'P02-产线A巡检点', point_type: 'patrol', status: 'completed', started_at: '22:36', completed_at: '22:45', algorithm_name: null, action: '环境监测' },
      { step_id: 's3', point_name: 'P03-标签检测区', point_type: 'patrol', status: 'completed', started_at: '22:46', completed_at: '23:00', algorithm_name: '易碎标签缺陷检测算法', action: '检测+上报' },
    ],
    report_generated: true,
  },
];

// ==================== 告警管理 ====================
export interface Alert {
  alert_id: string;
  alert_level: 'critical' | 'high' | 'warning' | 'info';
  alert_type: 'hair_exposure' | 'fragile_label' | 'station_dashboard' | 'foreign_object' | 'equipment_abnormal';
  alert_title: string;
  alert_content: string;
  description: string;
  device_id: string;
  device_name: string;
  occurred_at: string;
  alert_location: string;
  location: string;
  image_url: string | null;
  status: 'pending' | 'processing' | 'resolved' | 'ignored';
  handler: string | null;
  handled_by: string | null;
  handle_note: string | null;
  handled_at: string | null;
}

export interface AlertRule {
  rule_id: string;
  algorithm_type: 'hair_exposure' | 'fragile_label' | 'station_dashboard';
  algorithm_name: string;
  voice_enabled: boolean;
  voice_content: string;
  voice_volume: number;
}

export const alertRules: AlertRule[] = [
  {
    rule_id: 'rule-001',
    algorithm_type: 'hair_exposure',
    algorithm_name: '头发外露检测算法',
    voice_enabled: true,
    voice_content: '检测到头发外露违规，请立即整改！',
    voice_volume: 80,
  },
  {
    rule_id: 'rule-002',
    algorithm_type: 'fragile_label',
    algorithm_name: '易碎标签缺陷检测算法',
    voice_enabled: true,
    voice_content: '检测到标签缺陷，请前往确认处理！',
    voice_volume: 90,
  },
  {
    rule_id: 'rule-003',
    algorithm_type: 'station_dashboard',
    algorithm_name: '工位不良看板识别算法',
    voice_enabled: false,
    voice_content: '检测到工位异常，请关注！',
    voice_volume: 70,
  },
];

export const alerts: Alert[] = [
  {
    alert_id: 'ALT-20250427-001',
    alert_level: 'critical',
    alert_type: 'hair_exposure',
    alert_title: '头发外露违规检测',
    alert_content: '在A3F车间入口处检测到人员头发外露，防护帽佩戴违规',
    description: '在A3F车间入口处检测到人员头发外露，防护帽佩戴违规',
    device_id: 'dev-001',
    device_name: '机器狗-A001',
    occurred_at: '2025-04-27 16:40:00',
    alert_location: 'A栋3F生产车间-入口检测点P01',
    location: 'A栋3F生产车间-入口检测点P01',
    image_url: null,
    status: 'pending',
    handler: null,
    handled_by: null,
    handle_note: null,
    handled_at: null,
  },
  {
    alert_id: 'ALT-20250427-002',
    alert_level: 'high',
    alert_type: 'fragile_label',
    alert_title: '易碎标签破损检测',
    alert_content: '在A2F标签检测区发现产品标签严重破损，需立即处理',
    description: '在A2F标签检测区发现产品标签严重破损，需立即处理',
    device_id: 'dev-001',
    device_name: '机器狗-A001',
    occurred_at: '2025-04-27 15:20:00',
    alert_location: 'A栋2F组装车间-标签检测位2',
    location: 'A栋2F组装车间-标签检测位2',
    image_url: null,
    status: 'processing',
    handler: '张工',
    handled_by: '张工',
    handle_note: '已通知产线负责人确认标签质量',
    handled_at: '2025-04-27 15:25:00',
  },
  {
    alert_id: 'ALT-20250427-003',
    alert_level: 'warning',
    alert_type: 'station_dashboard',
    alert_title: '工位异常状态识别',
    alert_content: 'A3F产线A区域工位识别到异常状态，持续时长超过阈值',
    description: 'A3F产线A区域工位识别到异常状态，持续时长超过阈值',
    device_id: 'dev-001',
    device_name: '机器狗-A001',
    occurred_at: '2025-04-27 14:10:00',
    alert_location: 'A栋3F生产车间-产线A巡检点P02',
    location: 'A栋3F生产车间-产线A巡检点P02',
    image_url: null,
    status: 'pending',
    handler: null,
    handled_by: null,
    handle_note: null,
    handled_at: null,
  },
  {
    alert_id: 'ALT-20250427-004',
    alert_level: 'warning',
    alert_type: 'hair_exposure',
    alert_title: '侧视角头发外露检测',
    alert_content: '在质检工位检测到人员侧视角头发外露，疑似防护帽松动',
    description: '在质检工位检测到人员侧视角头发外露，疑似防护帽松动',
    device_id: 'dev-001',
    device_name: '机器狗-A001',
    occurred_at: '2025-04-27 13:45:00',
    alert_location: 'A栋3F生产车间-质检工位P04',
    location: 'A栋3F生产车间-质检工位P04',
    image_url: null,
    status: 'resolved',
    handler: '李工',
    handled_by: '李工',
    handle_note: '已确认人员重新佩戴防护帽，整改完成',
    handled_at: '2025-04-27 13:55:00',
  },
  {
    alert_id: 'ALT-20250427-005',
    alert_level: 'info',
    alert_type: 'fragile_label',
    alert_title: '标签模糊预警',
    alert_content: '在标签检测位1检测到产品标签轻微模糊，暂未达到缺陷标准',
    description: '在标签检测位1检测到产品标签轻微模糊，暂未达到缺陷标准',
    device_id: 'dev-001',
    device_name: '机器狗-A001',
    occurred_at: '2025-04-27 12:30:00',
    alert_location: 'A栋2F组装车间-标签检测位1',
    location: 'A栋2F组装车间-标签检测位1',
    image_url: null,
    status: 'resolved',
    handler: '系统',
    handled_by: '系统',
    handle_note: '标签模糊程度在可接受范围内，自动关闭',
    handled_at: '2025-04-27 12:35:00',
  },
  {
    alert_id: 'ALT-20250426-006',
    alert_level: 'critical',
    alert_type: 'hair_exposure',
    alert_title: '头发外露违规检测',
    alert_content: '在返修区检测到人员头发外露，防护帽未佩戴',
    description: '在返修区检测到人员头发外露，防护帽未佩戴',
    device_id: 'dev-001',
    device_name: '机器狗-A001',
    occurred_at: '2025-04-26 14:50:00',
    alert_location: 'A栋2F组装车间-返修区A04',
    location: 'A栋2F组装车间-返修区A04',
    image_url: null,
    status: 'resolved',
    handler: '王工',
    handled_by: '王工',
    handle_note: '已现场督促佩戴防护帽',
    handled_at: '2025-04-26 15:00:00',
  },
  {
    alert_id: 'ALT-20250426-007',
    alert_level: 'warning',
    alert_type: 'station_dashboard',
    alert_title: '工位空闲状态识别',
    alert_content: 'B1F仓储区多个工位识别为空闲状态，利用率低于预期',
    description: 'B1F仓储区多个工位识别为空闲状态，利用率低于预期',
    device_id: 'dev-003',
    device_name: '机器狗-B001',
    occurred_at: '2025-04-26 22:50:00',
    alert_location: 'B栋1F仓储区-货架A区',
    location: 'B栋1F仓储区-货架A区',
    image_url: null,
    status: 'pending',
    handler: null,
    handled_by: null,
    handle_note: null,
    handled_at: null,
  },
  {
    alert_id: 'ALT-20250426-008',
    alert_level: 'info',
    alert_type: 'fragile_label',
    alert_title: '标签脱落检测',
    alert_content: '在A3F标签检测区检测到1例标签边缘脱落，已自动标记',
    description: '在A3F标签检测区检测到1例标签边缘脱落，已自动标记',
    device_id: 'dev-001',
    device_name: '机器狗-A001',
    occurred_at: '2025-04-26 22:55:00',
    alert_location: 'A栋3F生产车间-标签检测区P03',
    location: 'A栋3F生产车间-标签检测区P03',
    image_url: null,
    status: 'processing',
    handler: '赵工',
    handled_by: '赵工',
    handle_note: '已安排补打标签',
    handled_at: '2025-04-26 23:00:00',
  },
];

// ==================== 仪表盘统计数据 ====================
export const dashboardStats = {
  totalDevices: 6,
  onlineDevices: 4,
  onlineRate: 66.7,
  runningTasks: 1,
  pendingTasks: 1,
  completedTasksToday: 2,
  taskCompletionRate: 85.7,
  unhandledAlerts: 3,
  criticalAlerts: 1,
  alertRate: -12.5,
};

export const taskTrendData = [
  { date: '04-21', completed: 5, failed: 0, total: 5 },
  { date: '04-22', completed: 8, failed: 1, total: 9 },
  { date: '04-23', completed: 6, failed: 0, total: 6 },
  { date: '04-24', completed: 7, failed: 1, total: 8 },
  { date: '04-25', completed: 4, failed: 1, total: 5 },
  { date: '04-26', completed: 9, failed: 0, total: 9 },
  { date: '04-27', completed: 2, failed: 0, total: 3 },
];

export const alertTrendData = [
  { date: '04-21', critical: 0, warning: 2, info: 3 },
  { date: '04-22', critical: 1, warning: 1, info: 2 },
  { date: '04-23', critical: 0, warning: 3, info: 1 },
  { date: '04-24', critical: 1, warning: 2, info: 4 },
  { date: '04-25', critical: 1, warning: 1, info: 2 },
  { date: '04-26', critical: 0, warning: 2, info: 3 },
  { date: '04-27', critical: 1, warning: 2, info: 2 },
];

export const deviceStatusDistribution = [
  { name: '运行中', value: 1, color: '#22c55e' },
  { name: '在线', value: 2, color: '#3b82f6' },
  { name: '充电中', value: 1, color: '#f97316' },
  { name: '故障', value: 1, color: '#ef4444' },
  { name: '休眠', value: 1, color: '#6366f1' },
  { name: '离线', value: 1, color: '#9ca3af' },
];

export const taskTypeDistribution = [
  { name: '日常巡检', value: 3, color: '#3b82f6' },
  { name: '专项检测', value: 1, color: '#8b5cf6' },
  { name: '实时监控', value: 0, color: '#06b6d4' },
  { name: '紧急任务', value: 1, color: '#ef4444' },
];

// ==================== 辅助函数 ====================
export const statusLabels: Record<string, string> = {
  online: '在线',
  offline: '离线',
  fault: '故障',
  sleeping: '休眠',
  charging: '充电中',
  running: '运行中',
  paused: '已暂停',
  training: '训练中',
  pending: '待执行',
  draft: '草稿',
  active: '使用中',
  published: '已发布',
  archived: '已归档',
  completed: '已完成',
  in_progress: '执行中',
  cancelled: '已取消',
  failed: '失败',
  unhandled: '未处理',
  processing: '处理中',
  resolved: '已解决',
};

export const statusColors: Record<string, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  fault: 'bg-red-500',
  sleeping: 'bg-indigo-500',
  charging: 'bg-orange-500',
  running: 'bg-green-500',
  paused: 'bg-yellow-500',
  training: 'bg-purple-500',
  pending: 'bg-yellow-500',
  draft: 'bg-gray-400',
  active: 'bg-green-500',
  published: 'bg-green-500',
  archived: 'bg-gray-300',
  completed: 'bg-green-500',
  in_progress: 'bg-blue-500',
  cancelled: 'bg-gray-400',
  failed: 'bg-red-500',
  unhandled: 'bg-red-500',
  processing: 'bg-orange-500',
  resolved: 'bg-green-500',
};

export const algorithmTypeLabels: Record<string, string> = {
  hair_exposure: '头发外露检测',
  fragile_label: '易碎标签缺陷检测',
  station_dashboard: '工位不良看板识别',
};

export const mapTypeLabels: Record<string, string> = {
  factory: '工厂',
  workshop: '车间',
  warehouse: '仓库',
};

export const alertLevelLabels: Record<string, string> = {
  critical: '严重',
  warning: '警告',
  info: '提示',
};

export const alertLevelColors: Record<string, string> = {
  critical: 'bg-red-500',
  warning: 'bg-orange-500',
  info: 'bg-blue-400',
};

export const taskTypeLabels: Record<string, string> = {
  patrol: '日常巡检',
  inspection: '专项检测',
  monitoring: '实时监控',
  emergency: '紧急任务',
};

export const deviceTypeLabels: Record<string, string> = {
  robot_dog: '机器狗',
  mechanical_arm: '机械臂',
  camera: '摄像头',
  sensor: '传感器',
  light: '补光灯',
};
