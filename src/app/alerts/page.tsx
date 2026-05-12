'use client';

import { useState } from 'react';
import {
  Bell,
  Search,
  AlertTriangle,
  AlertOctagon,
  Info,
  Eye,
  ZoomIn,
  Settings,
  Volume2,
  ChevronDown,
  ChevronUp,
  Filter,
  X,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import {
  alerts as initialAlerts,
  algorithms,
  devices,
  statusLabels,
  algorithmTypeLabels,
  type Alert,
} from '@/lib/mock-data';

const alertLevelConfig: Record<string, { icon: React.ElementType; color: string; badge: string; bg: string }> = {
  critical: { icon: AlertOctagon, color: 'text-red-600', badge: 'bg-red-100 text-red-700 border-red-200', bg: 'bg-red-50 border-red-200' },
  high: { icon: AlertTriangle, color: 'text-orange-600', badge: 'bg-orange-100 text-orange-700 border-orange-200', bg: 'bg-orange-50 border-orange-200' },
  warning: { icon: AlertTriangle, color: 'text-yellow-600', badge: 'bg-yellow-100 text-yellow-700 border-yellow-200', bg: 'bg-yellow-50 border-yellow-200' },
  info: { icon: Info, color: 'text-blue-600', badge: 'bg-blue-100 text-blue-700 border-blue-200', bg: 'bg-blue-50 border-blue-200' },
};

const alertLevelLabels: Record<string, string> = {
  critical: '紧急',
  high: '高',
  warning: '中',
  info: '低',
};

const alertTypeLabels: Record<string, string> = {
  hair_exposure: '头发裸露检测',
  fragile_label: '易碎标签检测',
  station_dashboard: '工位看板检测',
  foreign_object: '异物检测',
  equipment_abnormal: '设备异常检测',
};

const alertStatusLabels: Record<string, string> = {
  pending: '待处理',
  processing: '处理中',
  resolved: '已处理',
  ignored: '已忽略',
};

const alertStatusBadge: Record<string, string> = {
  pending: 'bg-red-100 text-red-700 border-red-200',
  processing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
  ignored: 'bg-gray-100 text-gray-600 border-gray-200',
};

const sampleImages = [
  'https://picsum.photos/seed/alert1/400/300',
  'https://picsum.photos/seed/alert2/400/300',
  'https://picsum.photos/seed/alert3/400/300',
  'https://picsum.photos/seed/alert4/400/300',
  'https://picsum.photos/seed/alert5/400/300',
  'https://picsum.photos/seed/alert6/400/300',
];

interface AlertRule {
  rule_id: string;
  algorithm_id: string;
  algorithm_name: string;
  enabled: boolean;
  voice_content: string;
  voice_volume: number;
}

const defaultRules: AlertRule[] = algorithms
  .filter((a) => a.status === 'online')
  .map((a) => ({
    rule_id: `rule-${a.algorithm_id}`,
    algorithm_id: a.algorithm_id,
    algorithm_name: a.algorithm_name,
    enabled: true,
    voice_content: getDefaultMessage(a.algorithm_type),
    voice_volume: 80,
  }));

function getDefaultMessage(type: string): string {
  const messages: Record<string, string> = {
    hair_exposure: '注意：检测到头发裸露，请立即佩戴防护帽！',
    fragile_label: '注意：检测到易碎标签异常，请检查标签状态！',
    station_dashboard: '注意：工位看板数据异常，请检查工位状态！',
  };
  return messages[type] || '检测到异常，请及时处理！';
}

export default function AlertsPage() {
  const [alertList] = useState<Alert[]>(initialAlerts);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [algorithmFilter, setAlgorithmFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Alert rules state
  const [alertRules, setAlertRules] = useState<AlertRule[]>(defaultRules);
  const [ruleDialogOpen, setRuleDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AlertRule | null>(null);

  const filteredAlerts = alertList.filter((alert) => {
    const matchesSearch =
      alert.alert_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.device_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.alert_type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || alert.alert_level === levelFilter;
    const matchesType = typeFilter === 'all' || alert.alert_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    const matchesAlgorithm = algorithmFilter === 'all' || alert.alert_type === algorithmFilter || algorithms.some(a => a.algorithm_type === algorithmFilter && a.algorithm_type === alert.alert_type);
    return matchesSearch && matchesLevel && matchesType && matchesStatus && matchesAlgorithm;
  });

  const handlePreviewImage = (url: string) => {
    setPreviewImageUrl(url);
    setImagePreviewOpen(true);
  };

  const handleToggleRule = (ruleId: string) => {
    setAlertRules((prev) =>
      prev.map((r) => r.rule_id === ruleId ? { ...r, enabled: !r.enabled } : r)
    );
  };

  const handleSaveRule = () => {
    setRuleDialogOpen(false);
    setEditingRule(null);
  };

  const stats = {
    total: alertList.length,
    critical: alertList.filter((a) => a.alert_level === 'critical').length,
    high: alertList.filter((a) => a.alert_level === 'high').length,
    pending: alertList.filter((a) => a.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">告警管理</h1>
          <p className="text-sm text-muted-foreground mt-1">算法识别告警监控与处理</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={() => setRuleDialogOpen(true)}>
          <Settings className="h-4 w-4" />
          告警规则设置
        </Button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">总告警</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="p-2 rounded-lg bg-slate-50"><Bell className="h-5 w-5 text-slate-600" /></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">紧急</p>
              <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
            </div>
            <div className="p-2 rounded-lg bg-red-50"><AlertOctagon className="h-5 w-5 text-red-600" /></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">高级</p>
              <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
            </div>
            <div className="p-2 rounded-lg bg-orange-50"><AlertTriangle className="h-5 w-5 text-orange-600" /></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">待处理</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-2 rounded-lg bg-yellow-50"><Info className="h-5 w-5 text-yellow-600" /></div>
          </div>
        </Card>
      </div>

      {/* 搜索与筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索告警ID、设备名称或告警类型..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-3.5 w-3.5" />
              筛选
              {showFilters ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </Button>
          </div>
          {showFilters && (
            <div className="flex items-center gap-3 mt-3 pt-3 border-t flex-wrap">
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="告警级别" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部级别</SelectItem>
                  <SelectItem value="critical">紧急</SelectItem>
                  <SelectItem value="high">高</SelectItem>
                  <SelectItem value="warning">中</SelectItem>
                  <SelectItem value="info">低</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[160px]"><SelectValue placeholder="告警类型" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部类型</SelectItem>
                  <SelectItem value="hair_exposure">头发裸露检测</SelectItem>
                  <SelectItem value="fragile_label">易碎标签检测</SelectItem>
                  <SelectItem value="station_dashboard">工位看板检测</SelectItem>
                  <SelectItem value="foreign_object">异物检测</SelectItem>
                  <SelectItem value="equipment_abnormal">设备异常检测</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]"><SelectValue placeholder="处理状态" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部状态</SelectItem>
                  <SelectItem value="pending">待处理</SelectItem>
                  <SelectItem value="processing">处理中</SelectItem>
                  <SelectItem value="resolved">已处理</SelectItem>
                  <SelectItem value="ignored">已忽略</SelectItem>
                </SelectContent>
              </Select>
              <Select value={algorithmFilter} onValueChange={setAlgorithmFilter}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="算法名称" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部算法</SelectItem>
                  {Array.from(new Map(algorithms.map(a => [a.algorithm_type, a])).values()).map((a) => (
                    <SelectItem key={a.algorithm_type} value={a.algorithm_type}>{a.algorithm_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="ghost" size="sm" onClick={() => { setLevelFilter('all'); setTypeFilter('all'); setStatusFilter('all'); setAlgorithmFilter('all'); setSearchQuery(''); }}>
                <X className="h-3.5 w-3.5 mr-1" /> 重置
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 告警列表 */}
      <div className="space-y-2">
        {filteredAlerts.map((alert, idx) => {
          const levelConfig = alertLevelConfig[alert.alert_level];
          const LevelIcon = levelConfig.icon;
          const imageUrl = alert.image_url || sampleImages[idx % sampleImages.length];
          return (
            <Card
              key={alert.alert_id}
              className={`hover:shadow-md transition-shadow cursor-pointer border-l-4 ${levelConfig.bg}`}
              onClick={() => setSelectedAlert(alert)}
            >
              <CardContent className="p-4">
                <div className="flex gap-4">
                  {/* 告警图片缩略图 */}
                  <div
                    className="w-24 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 relative group"
                    onClick={(e) => { e.stopPropagation(); handlePreviewImage(imageUrl); }}
                  >
                    <img src={imageUrl} alt="告警图片" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="h-5 w-5 text-white" />
                    </div>
                  </div>

                  {/* 告警信息 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <LevelIcon className={`h-4 w-4 ${levelConfig.color}`} />
                      <Badge className={`text-xs ${levelConfig.badge}`}>{alertLevelLabels[alert.alert_level]}</Badge>
                      <Badge className={`text-xs ${alertStatusBadge[alert.status]}`}>{alertStatusLabels[alert.status]}</Badge>
                      <Badge variant="outline" className="text-xs">{alertTypeLabels[alert.alert_type] || alert.alert_type}</Badge>
                    </div>
                    <p className="text-sm font-medium truncate">{alert.alert_content}</p>
                    <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                      <span>告警ID: {alert.alert_id}</span>
                      <span>设备: {alert.device_name}</span>
                      <span>位置: {alert.alert_location}</span>
                      <span>{alert.occurred_at}</span>
                    </div>
                  </div>

                  {/* 操作 */}
                  <div className="flex items-center">
                    <Button variant="ghost" size="sm" className="gap-1" onClick={(e) => { e.stopPropagation(); setSelectedAlert(alert); }}>
                      <Eye className="h-3.5 w-3.5" /> 详情
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {filteredAlerts.length === 0 && (
          <Card className="p-8 text-center">
            <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-sm text-muted-foreground">暂无告警数据</p>
          </Card>
        )}
      </div>

      {/* 告警详情弹窗 */}
      <Dialog open={!!selectedAlert} onOpenChange={() => setSelectedAlert(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAlert && (() => {
            const levelConfig = alertLevelConfig[selectedAlert.alert_level];
            const LevelIcon = levelConfig.icon;
            const imageUrl = selectedAlert.image_url || sampleImages[alertList.indexOf(selectedAlert) % sampleImages.length];
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <LevelIcon className={`h-5 w-5 ${levelConfig.color}`} />
                    告警详情
                  </DialogTitle>
                  <DialogDescription>{selectedAlert.alert_id}</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  {/* 告警图片 */}
                  <div
                    className="relative rounded-lg overflow-hidden cursor-pointer group h-56 bg-slate-100"
                    onClick={() => handlePreviewImage(imageUrl)}
                  >
                    <img src={imageUrl} alt="告警图片" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="text-center text-white">
                        <ZoomIn className="h-8 w-8 mx-auto mb-1" />
                        <p className="text-sm">点击放大查看</p>
                      </div>
                    </div>
                  </div>

                  {/* 基本信息 */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">告警级别</span>
                      <Badge className={`text-xs ${levelConfig.badge}`}>{alertLevelLabels[selectedAlert.alert_level]}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">处理状态</span>
                      <Badge className={`text-xs ${alertStatusBadge[selectedAlert.status]}`}>{alertStatusLabels[selectedAlert.status]}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">告警类型</span>
                      <span>{alertTypeLabels[selectedAlert.alert_type] || selectedAlert.alert_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">告警时间</span>
                      <span>{selectedAlert.occurred_at}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">告警位置</span>
                      <span>{selectedAlert.alert_location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">关联设备</span>
                      <span>{selectedAlert.device_name}</span>
                    </div>
                  </div>

                  <Separator />

                  {/* 告警描述 */}
                  <div>
                    <p className="text-sm font-medium mb-1">告警描述</p>
                    <p className="text-sm text-muted-foreground">{selectedAlert.alert_content}</p>
                  </div>

                  {/* 处理记录 */}
                  {selectedAlert.handler && (
                    <div>
                      <p className="text-sm font-medium mb-1">处理记录</p>
                      <div className="bg-slate-50 rounded-lg p-3 text-sm">
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>处理人: {selectedAlert.handler}</span>
                          <span>{selectedAlert.handled_at}</span>
                        </div>
                        <p className="text-muted-foreground">{selectedAlert.handle_note || '已处理'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>

      {/* 图片放大查看弹窗 */}
      <Dialog open={imagePreviewOpen} onOpenChange={setImagePreviewOpen}>
        <DialogContent className="max-w-3xl p-2">
          <DialogHeader>
            <DialogTitle className="sr-only">告警图片放大查看</DialogTitle>
            <DialogDescription className="sr-only">告警识别图片大图预览</DialogDescription>
          </DialogHeader>
          <div className="relative">
            <img src={previewImageUrl} alt="告警图片大图" className="w-full rounded-lg" />
          </div>
        </DialogContent>
      </Dialog>

      {/* 告警规则设置弹窗 */}
      <Dialog open={ruleDialogOpen} onOpenChange={setRuleDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              告警规则设置
            </DialogTitle>
            <DialogDescription>
              设置算法识别成功后自动播报预设语音内容，通过喊话器设备输出
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
              <p className="font-medium mb-1">语音播报说明</p>
              <p className="text-xs">当算法识别成功后，系统将自动通过喊话器设备播报预设的语音内容。可为每个算法自定义播报内容，也可以关闭某个算法的语音播报。</p>
            </div>

            {alertRules.map((rule) => (
              <Card key={rule.rule_id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${rule.enabled ? 'bg-blue-50' : 'bg-gray-50'}`}>
                      <Volume2 className={`h-5 w-5 ${rule.enabled ? 'text-blue-600' : 'text-gray-400'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{rule.algorithm_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {algorithms.find((a) => a.algorithm_id === rule.algorithm_id)?.recognition_content || '算法识别'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{rule.enabled ? '已启用' : '已关闭'}</span>
                    <Switch checked={rule.enabled} onCheckedChange={() => handleToggleRule(rule.rule_id)} />
                  </div>
                </div>

                {rule.enabled && (
                  <div className="mt-3 pt-3 border-t space-y-2">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">播报语音内容</p>
                      <div className="flex gap-2">
                        <Textarea
                          value={rule.voice_content}
                          onChange={(e) =>
                            setAlertRules((prev) =>
                              prev.map((r) => r.rule_id === rule.rule_id ? { ...r, voice_content: e.target.value } : r)
                            )
                          }
                          className="min-h-[60px] text-sm"
                          placeholder="请输入语音播报内容"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-muted-foreground">语音音量</p>
                        <span className="text-xs text-muted-foreground">{rule.voice_volume}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Volume2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        <Slider
                          value={[rule.voice_volume]}
                          onValueChange={(v) =>
                            setAlertRules((prev) =>
                              prev.map((r) => r.rule_id === rule.rule_id ? { ...r, voice_volume: v[0] } : r)
                            )
                          }
                          max={100}
                          step={1}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRuleDialogOpen(false)}>取消</Button>
            <Button onClick={handleSaveRule}>保存设置</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
