'use client';

import { useState } from 'react';
import {
  Brain,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  Eye,
  Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  algorithms,
  algorithmTypeLabels,
  statusLabels,
  type Algorithm,
} from '@/lib/mock-data';

const statusBadgeClass: Record<string, string> = {
  online: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  offline: 'bg-gray-100 text-gray-600 border-gray-200',
  training: 'bg-purple-100 text-purple-700 border-purple-200',
};

const typeIconBg: Record<string, string> = {
  hair_exposure: 'bg-blue-50',
  fragile_label: 'bg-amber-50',
  station_dashboard: 'bg-emerald-50',
};

const typeIconColor: Record<string, string> = {
  hair_exposure: 'text-blue-600',
  fragile_label: 'text-amber-600',
  station_dashboard: 'text-emerald-600',
};

export default function AlgorithmsPage() {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [enabledMap, setEnabledMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    algorithms.forEach((algo) => {
      map[algo.algorithm_id] = algo.status === 'online';
    });
    return map;
  });
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<Algorithm | null>(null);

  const filteredAlgorithms = algorithms.filter((algo) => {
    return typeFilter === 'all' || algo.algorithm_type === typeFilter;
  });

  const handleToggle = (algoId: string) => {
    setEnabledMap((prev) => ({
      ...prev,
      [algoId]: !prev[algoId],
    }));
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">算法管理</h1>
        <p className="text-sm text-muted-foreground mt-1">管理机器狗视觉检测算法模型与版本</p>
      </div>

      {/* 类型筛选 */}
      <div className="flex items-center gap-3">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="算法类型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部类型</SelectItem>
            <SelectItem value="hair_exposure">头发外露检测</SelectItem>
            <SelectItem value="fragile_label">易碎标签缺陷检测</SelectItem>
            <SelectItem value="station_dashboard">工位不良看板识别</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          共 {filteredAlgorithms.length} 个算法
        </span>
      </div>

      {/* 算法卡片列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAlgorithms.map((algo) => {
          const isEnabled = enabledMap[algo.algorithm_id];
          return (
            <Card
              key={algo.algorithm_id}
              className={`hover:shadow-md transition-all cursor-pointer ${
                !isEnabled ? 'opacity-60' : ''
              }`}
              onClick={() => setSelectedAlgorithm(algo)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${typeIconBg[algo.algorithm_type]}`}>
                      <Brain className={`h-5 w-5 ${typeIconColor[algo.algorithm_type]}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{algo.algorithm_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {algorithmTypeLabels[algo.algorithm_type]} | {algo.algorithm_version}
                      </p>
                    </div>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => handleToggle(algo.algorithm_id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                {/* 识别内容 */}
                <div className="flex items-start gap-2">
                  <Eye className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">识别内容</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{algo.recognition_content}</p>
                  </div>
                </div>
                {/* 适用场景 */}
                <div className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">适用场景</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{algo.applicable_scenarios}</p>
                  </div>
                </div>
                {/* 状态与设备 */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <Badge className={`text-xs ${statusBadgeClass[algo.status]}`}>
                    {algo.status === 'online' && <CheckCircle2 className="h-3 w-3 mr-1" />}
                    {algo.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                    {algo.status === 'offline' && <XCircle className="h-3 w-3 mr-1" />}
                    {algo.status === 'training' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                    {statusLabels[algo.status]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {algo.associated_devices} 台设备
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 算法详情弹窗 */}
      <Dialog open={!!selectedAlgorithm} onOpenChange={() => setSelectedAlgorithm(null)}>
        <DialogContent className="max-w-lg">
          {selectedAlgorithm && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAlgorithm.algorithm_name}</DialogTitle>
                <DialogDescription>
                  {algorithmTypeLabels[selectedAlgorithm.algorithm_type]} | {selectedAlgorithm.algorithm_version}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Eye className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">识别内容</p>
                      <p className="text-sm text-slate-700">{selectedAlgorithm.recognition_content}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">适用场景</p>
                      <p className="text-sm text-slate-700">{selectedAlgorithm.applicable_scenarios}</p>
                    </div>
                  </div>
                </div>
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">启用状态</span>
                    <span className={enabledMap[selectedAlgorithm.algorithm_id] ? 'text-green-600 font-medium' : 'text-slate-500'}>
                      {enabledMap[selectedAlgorithm.algorithm_id] ? '已启用' : '已关闭'}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">更新时间</span>
                    <span>{selectedAlgorithm.updated_at}</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
