'use client';

import { useState } from 'react';
import {
  Cpu,
  Search,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  MapPin,
  MoreVertical,
  Eye,
  Edit3,
  Trash2,
  Zap,
  AlertTriangle,
  Activity,
  RotateCcw,
  Settings2,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  devices as initialDevices,
  statusLabels,
  deviceTypeLabels,
  type Device,
} from '@/lib/mock-data';

const statusBadgeClass: Record<string, string> = {
  online: 'bg-green-100 text-green-700 border-green-200',
  offline: 'bg-gray-100 text-gray-600 border-gray-200',
  fault: 'bg-red-100 text-red-700 border-red-200',
  sleeping: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  charging: 'bg-orange-100 text-orange-700 border-orange-200',
  running: 'bg-green-100 text-green-700 border-green-200',
  paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const statusDotClass: Record<string, string> = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  fault: 'bg-red-500 animate-pulse',
  sleeping: 'bg-indigo-500',
  charging: 'bg-orange-500',
  running: 'bg-green-500 animate-pulse',
  paused: 'bg-yellow-500',
};

function getBatteryColor(level: number): string {
  if (level > 60) return 'text-green-600';
  if (level > 30) return 'text-orange-600';
  return 'text-red-600';
}

function getSignalColor(signal: number): string {
  if (signal > 70) return 'text-green-600';
  if (signal > 40) return 'text-orange-600';
  return 'text-red-600';
}

const statusCards = [
  { label: '全部', status: 'all', color: 'bg-slate-600' },
  { label: '运行中', status: 'running', color: 'bg-green-500' },
  { label: '充电中', status: 'charging', color: 'bg-orange-500' },
  { label: '休眠', status: 'sleeping', color: 'bg-indigo-500' },
  { label: '故障', status: 'fault', color: 'bg-red-500' },
  { label: '离线', status: 'offline', color: 'bg-gray-400' },
] as const;

export default function DevicesPage() {
  const [deviceList, setDeviceList] = useState<Device[]>(initialDevices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<Device | null>(null);
  const [editName, setEditName] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteDevice, setDeleteDevice] = useState<Device | null>(null);
  const [armPoseDialogOpen, setArmPoseDialogOpen] = useState(false);
  const [armPoseDevice, setArmPoseDevice] = useState<Device | null>(null);
  const [armDefaultPose, setArmDefaultPose] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  const filteredDevices = deviceList.filter((device) => {
    const matchesSearch =
      device.device_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      device.device_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditDevice = (device: Device) => {
    setEditDevice(device);
    setEditName(device.device_name);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editDevice && editName.trim()) {
      setDeviceList((prev) =>
        prev.map((d) =>
          d.device_id === editDevice.device_id ? { ...d, device_name: editName.trim() } : d
        )
      );
      setEditDialogOpen(false);
      setEditDevice(null);
      setEditName('');
    }
  };

  const handleDeleteDevice = () => {
    if (deleteDevice) {
      setDeviceList((prev) => prev.filter((d) => d.device_id !== deleteDevice.device_id));
      setDeleteDialogOpen(false);
      setDeleteDevice(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">设备管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理机器狗及附属设备的注册、状态监控与运维</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" onClick={() => { setArmPoseDevice(null); setArmDefaultPose([0, 0, 0, 0, 0, 0, 0]); setArmPoseDialogOpen(true); }}>
            <Settings2 className="h-4 w-4" />
            机械臂默认姿态
          </Button>
        </div>
      </div>

      {/* 设备状态概览卡片 */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {statusCards.map((item) => (
          <Card
            key={item.label}
            className={`cursor-pointer hover:shadow-md transition-shadow ${
              statusFilter === item.status ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setStatusFilter(item.status)}
          >
            <CardContent className="p-3 text-center">
              <div className={`h-2 w-2 rounded-full ${item.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold">
                {item.status === 'all'
                  ? deviceList.length
                  : deviceList.filter((d) => d.status === item.status).length}
              </p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 搜索与筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索设备名称或编码..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="设备状态" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="running">运行中</SelectItem>
                <SelectItem value="charging">充电中</SelectItem>
                <SelectItem value="sleeping">休眠</SelectItem>
                <SelectItem value="fault">故障</SelectItem>
                <SelectItem value="offline">离线</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 设备卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDevices.map((device) => (
          <Card
            key={device.device_id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedDevice(device)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-lg font-bold">
                      🐕
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${statusDotClass[device.status]}`}
                    />
                  </div>
                  <h3 className="font-medium text-sm">{device.device_name}</h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedDevice(device); }}>
                      <Eye className="h-4 w-4 mr-2" />
                      查看详情
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditDevice(device); }}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      编辑设备
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); setDeleteDevice(device); setDeleteDialogOpen(true); }}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      删除设备
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-xs text-muted-foreground font-mono mt-0.5">{device.device_code}</p>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${statusBadgeClass[device.status]}`}>
                    {statusLabels[device.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{device.model}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Battery className={`h-3.5 w-3.5 ${getBatteryColor(device.battery_level)}`} />
                      <span>电量</span>
                    </div>
                    <span className={getBatteryColor(device.battery_level)}>{device.battery_level}%</span>
                  </div>
                  <Progress value={device.battery_level} className="h-1.5" />
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Signal className={`h-3.5 w-3.5 ${getSignalColor(device.network_signal)}`} />
                    <span>{device.network_signal}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{device.current_location.x}, {device.current_location.y}</span>
                  </div>
                </div>
                {device.accessories.length > 0 && (
                  <div className="flex items-center gap-1 flex-wrap">
                    {device.accessories.map((acc) => (
                      <Badge key={acc.accessory_id} variant="outline" className="text-[10px] py-0">
                        {acc.accessory_name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 设备详情弹窗 */}
      <Dialog open={!!selectedDevice} onOpenChange={() => setSelectedDevice(null)}>
        <DialogContent className="max-w-2xl">
          {selectedDevice && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white">
                      🐕
                    </div>
                    <div
                      className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${statusDotClass[selectedDevice.status]}`}
                    />
                  </div>
                  <span>{selectedDevice.device_name}</span>
                  <p className="text-sm font-normal text-muted-foreground">{selectedDevice.device_code}</p>
                </DialogTitle>
                <DialogDescription>设备详情与状态监控</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="info" className="mt-2">
                <TabsList>
                  <TabsTrigger value="info">设备信息</TabsTrigger>
                  <TabsTrigger value="status">实时状态</TabsTrigger>
                  <TabsTrigger value="accessories">附属设备</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-3 mt-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">设备类型</span><span>{deviceTypeLabels[selectedDevice.device_type]}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">设备型号</span><span>{selectedDevice.model}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">序列号</span><span className="font-mono text-xs">{selectedDevice.serial_number}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">固件版本</span><span className="font-mono">{selectedDevice.firmware_version}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">创建时间</span><span>{selectedDevice.created_at}</span></div>
                  </div>
                </TabsContent>
                <TabsContent value="status" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2"><Battery className={`h-4 w-4 ${getBatteryColor(selectedDevice.battery_level)}`} /><span className="text-sm text-muted-foreground">电量</span></div>
                      <p className={`text-2xl font-bold ${getBatteryColor(selectedDevice.battery_level)}`}>{selectedDevice.battery_level}%</p>
                      <Progress value={selectedDevice.battery_level} className="h-2 mt-2" />
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2"><Signal className={`h-4 w-4 ${getSignalColor(selectedDevice.network_signal)}`} /><span className="text-sm text-muted-foreground">信号强度</span></div>
                      <p className={`text-2xl font-bold ${getSignalColor(selectedDevice.network_signal)}`}>{selectedDevice.network_signal}%</p>
                      <Progress value={selectedDevice.network_signal} className="h-2 mt-2" />
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2"><MapPin className="h-4 w-4 text-blue-500" /><span className="text-sm text-muted-foreground">当前位置</span></div>
                      <p className="text-lg font-mono">({selectedDevice.current_location.x}, {selectedDevice.current_location.y})</p>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-2"><Activity className="h-4 w-4 text-green-500" /><span className="text-sm text-muted-foreground">最后通信</span></div>
                      <p className="text-sm">{selectedDevice.last_communication}</p>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="accessories" className="mt-4">
                  {selectedDevice.accessories.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">暂无附属设备</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDevice.accessories.map((acc) => (
                        <Card key={acc.accessory_id} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-sm">
                                {acc.accessory_type === 'camera' ? '📷' : acc.accessory_type === 'mechanical_arm' ? '🦾' : acc.accessory_type === 'sensor' ? '📡' : '💡'}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{acc.accessory_name}</p>
                                <p className="text-xs text-muted-foreground">{acc.model}</p>
                              </div>
                            </div>
                            <Badge className={`text-xs ${statusBadgeClass[acc.status] || ''}`}>
                              {statusLabels[acc.status]}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 编辑设备弹窗 */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>编辑设备</DialogTitle>
            <DialogDescription>修改机器狗名称</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <p className="text-sm font-medium">设备名称</p>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="请输入设备名称"
              />
            </div>
            {editDevice && (
              <p className="text-xs text-muted-foreground">设备编码: {editDevice.device_code}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveEdit} disabled={!editName.trim()}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>确认删除</DialogTitle>
            <DialogDescription>
              确定要删除设备「{deleteDevice?.device_name}」吗？此操作不可撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>取消</Button>
            <Button variant="destructive" onClick={handleDeleteDevice}>确认删除</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 机械臂默认姿态设置弹窗 */}
      <Dialog open={armPoseDialogOpen} onOpenChange={setArmPoseDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>机械臂默认姿态设置</DialogTitle>
            <DialogDescription>选择设备并设置机械臂默认姿态</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">选择设备</Label>
              <Select value={armPoseDevice?.device_id || ''} onValueChange={(v: string) => {
                const dev = deviceList.find((d) => d.device_id === v) || null;
                setArmPoseDevice(dev);
                setArmDefaultPose([0, 0, 0, 0, 0, 0, 0]);
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="请选择设备" />
                </SelectTrigger>
                <SelectContent>
                  {deviceList.map((d) => (
                    <SelectItem key={d.device_id} value={d.device_id}>{d.device_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="aspect-video bg-slate-900 rounded flex items-center justify-center">
              <div className="text-slate-500 text-xs">机械臂视频画面</div>
            </div>
            <Button size="sm" variant="outline" className="w-full" onClick={() => {
              setArmDefaultPose([15, -30, 45, 0, -20, 10, 0]);
            }}>
              <RotateCcw className="h-3 w-3 mr-1" /> 获取当前姿态
            </Button>
            <div className="space-y-2">
              {(['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7'] as const).map((label, i: number) => (
                <div key={label} className="flex items-center gap-3">
                  <Label className="text-xs w-6 shrink-0">{label}</Label>
                  <Slider
                    className="flex-1"
                    min={-180}
                    max={180}
                    step={1}
                    value={[armDefaultPose[i]]}
                    onValueChange={([v]: [number]) => {
                      const newPose = [...armDefaultPose];
                      newPose[i] = v;
                      setArmDefaultPose(newPose);
                    }}
                  />
                  <Input
                    type="number"
                    className="w-16 h-7 text-xs text-center"
                    value={armDefaultPose[i]}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const newPose = [...armDefaultPose];
                      newPose[i] = Number(e.target.value);
                      setArmDefaultPose(newPose);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArmPoseDialogOpen(false)}>取消</Button>
            <Button onClick={() => setArmPoseDialogOpen(false)} disabled={!armPoseDevice}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
