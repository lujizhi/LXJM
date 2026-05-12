'use client';

import { useState, useCallback, useRef } from 'react';
import {
  Dialog, DialogContent, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Map as MapIcon, Plus, Pencil, Trash2, Search, ChevronUp, ChevronDown,
  Upload, Download, X, RotateCcw, Copy, RefreshCw, Save, LogOut, Eye,
} from 'lucide-react';
import { mapList as initialMapList, devices, algorithms, type MapItem, type MapPoint, type MapLine, type MapArea, type ArmPose } from '@/lib/mock-data';

export default function MapsPage() {
  const [mapList, setMapList] = useState<MapItem[]>(initialMapList);
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingMap, setEditingMap] = useState<MapItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MapItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameTarget, setRenameTarget] = useState<MapItem | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState("");
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [importDeviceId, setImportDeviceId] = useState("");
  const [copyTarget, setCopyTarget] = useState<MapItem | null>(null);
  const [copyDialogOpen, setCopyDialogOpen] = useState(false);
  const [copyName, setCopyName] = useState("");
  const [copyDeviceId, setCopyDeviceId] = useState("");
  const [syncDialogOpen, setSyncDialogOpen] = useState(false);
  const [syncDevice, setSyncDevice] = useState("");
  const [syncDeviceMaps, setSyncDeviceMaps] = useState<{
    id: string; name: string; size: string; points: number; lines: number; areas: number;
  }[]>([]);
  const [syncSelectedMapIds, setSyncSelectedMapIds] = useState<string[]>([]);
  const [syncMapNames, setSyncMapNames] = useState<Record<string, string>>({});
  const [editorTab, setEditorTab] = useState("points");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pointSearch, setPointSearch] = useState("");
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(null);
  const [addPointDialog, setAddPointDialog] = useState(false);
  const [editPointDialog, setEditPointDialog] = useState(false);
  const [deletePointDialog, setDeletePointDialog] = useState(false);
  const [pointForm, setPointForm] = useState<Partial<MapPoint>>({});
  const [syncSourcePointId, setSyncSourcePointId] = useState("");
  const [lineSearch, setLineSearch] = useState("");
  const [selectedLine, setSelectedLine] = useState<MapLine | null>(null);
  const [addLineDialog, setAddLineDialog] = useState(false);
  const [editLineDialog, setEditLineDialog] = useState(false);
  const [lineForm, setLineForm] = useState<Partial<MapLine>>({});
  const [areaSearch, setAreaSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState<MapArea | null>(null);
  const [addAreaDialog, setAddAreaDialog] = useState(false);
  const [editAreaDialog, setEditAreaDialog] = useState(false);
  const [areaForm, setAreaForm] = useState<Partial<MapArea>>({});
  const [editingPoseName, setEditingPoseName] = useState<string | null>(null);
  const [poseNameValue, setPoseNameValue] = useState("");
  const [addingPointOnMap, setAddingPointOnMap] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);

  const filteredMaps = mapList.filter(map => {
    return statusFilter === "all" || map.map_status === statusFilter;
  });

  const updateEditingMap = useCallback((updater: (m: MapItem) => MapItem) => {
    setEditingMap(prev => {
      if (!prev) return null;
      const updated = updater(prev);
      setMapList(list => list.map(m => m.map_id === prev.map_id ? updated : m));
      setHasUnsavedChanges(true);
      return updated;
    });
  }, []);

  const handleExportMap = (map: MapItem) => {
    const data = JSON.stringify(map, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${map.map_name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDeleteMap = () => {
    if (deleteTarget) {
      setMapList(prev => prev.filter(m => m.map_id !== deleteTarget.map_id));
      setDeleteTarget(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleRenameMap = () => {
    if (renameTarget && renameValue.trim()) {
      setMapList(prev => prev.map(m => m.map_id === renameTarget.map_id ? { ...m, map_name: renameValue.trim() } : m));
      setRenameTarget(null);
      setRenameDialogOpen(false);
      setRenameValue("");
    }
  };

  const handleCopyMap = () => {
    if (copyTarget) {
      const newMap: MapItem = JSON.parse(JSON.stringify(copyTarget));
      newMap.map_id = `map-${Date.now()}`;
      newMap.map_name = copyName.trim() || `${copyTarget.map_name}-副本`;
      newMap.device_id = copyDeviceId || copyTarget.device_id;
      newMap.map_status = 'draft';
      setMapList(prev => [...prev, newMap]);
      setCopyTarget(null);
      setCopyDialogOpen(false);
      setCopyName("");
      setCopyDeviceId("");
    }
  };

  const handleSyncSelectDevice = (deviceId: string) => {
    setSyncDevice(deviceId);
    setSyncSelectedMapIds([]);
    setSyncMapNames({});
    if (!deviceId) { setSyncDeviceMaps([]); return; }
    setSyncDeviceMaps([
      { id: 'dog-map-1', name: '注塑车间巡检地图', size: '60m×40m', points: 12, lines: 3, areas: 4 },
      { id: 'dog-map-2', name: 'CNC加工区地图', size: '50m×35m', points: 8, lines: 2, areas: 3 },
      { id: 'dog-map-3', name: '仓储区巡检地图', size: '80m×50m', points: 15, lines: 4, areas: 5 },
      { id: 'dog-map-4', name: '装配产线地图', size: '45m×30m', points: 10, lines: 2, areas: 3 },
      { id: 'dog-map-5', name: '成品检验区地图', size: '55m×40m', points: 9, lines: 2, areas: 2 },
    ]);
  };

  const handleSyncConfirm = () => {
    syncSelectedMapIds.forEach(mapId => {
      const dogMap = syncDeviceMaps.find(m => m.id === mapId);
      if (dogMap) {
        const customName = syncMapNames[mapId]?.trim() || dogMap.name;
        const newMap: MapItem = {
          map_id: `map-sync-${Date.now()}-${mapId}`,
          map_name: customName,
          map_type: 'workshop',
          map_size: dogMap.size,
          map_status: 'draft',
          device_id: syncDevice,
          points: [],
          lines: [],
          areas: [],
          arm_poses: [],
        };
        setMapList(prev => [...prev, newMap]);
      }
    });
    setSyncDialogOpen(false);
    setSyncDevice("");
    setSyncDeviceMaps([]);
    setSyncSelectedMapIds([]);
    setSyncMapNames({});
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newMap: MapItem = {
        map_id: `map-imp-${Date.now()}`,
        map_name: file.name.replace(/\.\w+$/, ''),
        map_type: 'workshop',
        map_size: '自定义',
        map_status: 'draft',
        device_id: importDeviceId || undefined,
        points: [],
        lines: [],
        areas: [],
        arm_poses: [],
      };
      setMapList(prev => [...prev, newMap]);
      setImportDialogOpen(false);
      setImportDeviceId("");
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExitEditor = () => {
    if (hasUnsavedChanges) {
      setExitConfirmOpen(true);
    } else {
      setEditingMap(null);
    }
  };

  const handleSaveAndExit = () => {
    setHasUnsavedChanges(false);
    setEditingMap(null);
    setExitConfirmOpen(false);
  };

  const handleConfirmExit = () => {
    setHasUnsavedChanges(false);
    setEditingMap(null);
    setExitConfirmOpen(false);
  };

  // ===== Point handlers =====
  const openAddPoint = () => {
    setPointForm({
      point_name: `点位${(editingMap?.points.length || 0) + 1}`,
      point_type: 'patrol',
      x: 100, y: 100, yaw: 0,
      is_device: false,
      arm_config: { mode: 'preset', enabled: true, preset_poses: [], custom_poses: [], speed: 50 },
      voice_content: '',
      voice_volume: 80,
    });
    setSyncSourcePointId("");
    setAddPointDialog(true);
  };

  const openEditPoint = (p: MapPoint) => {
    setPointForm({ ...p });
    setSyncSourcePointId("");
    setEditPointDialog(true);
  };

  const handleAddPoint = () => {
    if (!pointForm.point_name?.trim() || !editingMap) return;
    const newPoint: MapPoint = {
      point_id: `mp-${Date.now()}`,
      point_name: pointForm.point_name.trim(),
      point_type: pointForm.point_type as MapPoint['point_type'],
      x: pointForm.x || 0,
      y: pointForm.y || 0,
      yaw: pointForm.yaw || 0,
      is_device: pointForm.is_device || false,
      arm_config: pointForm.arm_config || { mode: 'preset', enabled: true, preset_poses: [], custom_poses: [], speed: 50 },
      voice_content: pointForm.voice_content || '',
      voice_volume: pointForm.voice_volume ?? 80,
    };
    updateEditingMap(m => ({ ...m, points: [...m.points, newPoint] }));
    setAddPointDialog(false);
    setAddingPointOnMap(false);
  };

  const handleUpdatePoint = () => {
    if (!pointForm.point_name?.trim() || !editingMap) return;
    updateEditingMap(m => ({
      ...m,
      points: m.points.map(p => p.point_id === pointForm.point_id ? {
        ...p,
        point_name: pointForm.point_name!.trim(),
        point_type: pointForm.point_type as MapPoint['point_type'],
        x: pointForm.x ?? p.x,
        y: pointForm.y ?? p.y,
        yaw: pointForm.yaw ?? p.yaw ?? 0,
        is_device: pointForm.is_device ?? p.is_device,
        arm_config: pointForm.arm_config ?? p.arm_config,
        voice_content: pointForm.voice_content ?? p.voice_content,
        voice_volume: pointForm.voice_volume ?? p.voice_volume,
      } : p),
    }));
    setEditPointDialog(false);
  };

  const handleDeletePoint = () => {
    if (selectedPoint && editingMap) {
      updateEditingMap(m => ({ ...m, points: m.points.filter(p => p.point_id !== selectedPoint.point_id) }));
      setSelectedPoint(null);
      setDeletePointDialog(false);
    }
  };

  const handleSyncPointPose = () => {
    if (!syncSourcePointId || !editingMap) return;
    const source = editingMap.points.find(p => p.point_id === syncSourcePointId);
    if (source) {
      setPointForm(prev => ({
        ...prev,
        arm_config: JSON.parse(JSON.stringify(source.arm_config)),
      }));
    }
  };

  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!addingPointOnMap || !editingMap) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const x = Math.round(((e.clientX - rect.left) / rect.width) * vb.width);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * vb.height);
    setPointForm(prev => ({ ...prev, x, y }));
  };

  // ===== Line handlers =====
  const openAddLine = () => {
    setLineForm({ line_name: `线路${(editingMap?.lines.length || 0) + 1}`, point_ids: [] });
    setAddLineDialog(true);
  };

  const handleAddLine = () => {
    if (!lineForm.line_name?.trim() || !editingMap) return;
    const newLine: MapLine = {
      line_id: `ml-${Date.now()}`,
      line_name: lineForm.line_name.trim(),
      point_ids: lineForm.point_ids || [],
      line_type: 'patrol',
    };
    updateEditingMap(m => ({ ...m, lines: [...m.lines, newLine] }));
    setAddLineDialog(false);
  };

  // ===== Area handlers =====
  const openAddArea = (type: MapArea['area_type']) => {
    setAreaForm({ area_name: `区域${(editingMap?.areas.length || 0) + 1}`, area_type: type, vertices: [{ x: 50, y: 50 }, { x: 150, y: 50 }, { x: 150, y: 150 }, { x: 50, y: 150 }] });
    if (type === 'restricted') { setAreaForm(prev => ({ ...prev, speed_limit: 0.5, posture: 'slow' })); }
    setAddAreaDialog(true);
  };

  const handleAddArea = () => {
    if (!areaForm.area_name?.trim() || !editingMap) return;
    const newArea: MapArea = {
      area_id: `ma-${Date.now()}`,
      area_name: areaForm.area_name.trim(),
      area_type: areaForm.area_type as MapArea['area_type'],
      vertices: areaForm.vertices || [],
      description: areaForm.description || '',
      ...(areaForm.area_type === 'restricted' ? { speed_limit: areaForm.speed_limit, posture: areaForm.posture } : {}),
    };
    updateEditingMap(m => ({ ...m, areas: [...m.areas, newArea] }));
    setAddAreaDialog(false);
  };

  // ===== Arm pose handlers =====
  const handleAddPose = () => {
    if (!editingMap) return;
    const newPose: ArmPose = {
      pose_id: `pose-${Date.now()}`,
      pose_name: `姿态${(editingMap.arm_poses.length || 0) + 1}`,
      joint_angles: [0, 0, 0, 0, 0, 0, 0],
      captured_at: new Date().toISOString(),
    };
    updateEditingMap(m => ({ ...m, arm_poses: [...m.arm_poses, newPose] }));
  };

  const handleDeletePose = (poseId: string) => {
    updateEditingMap(m => ({ ...m, arm_poses: m.arm_poses.filter(p => p.pose_id !== poseId) }));
  };

  const handleRenamePose = (poseId: string) => {
    if (!poseNameValue.trim()) return;
    updateEditingMap(m => ({
      ...m,
      arm_poses: m.arm_poses.map(p => p.pose_id === poseId ? { ...p, pose_name: poseNameValue.trim() } : p),
    }));
    setEditingPoseName(null);
  };

  const handleResetArmPoses = () => {
    updateEditingMap(m => ({
      ...m,
      arm_poses: m.arm_poses.map(p => ({ ...p, joint_angles: [0, 0, 0, 0, 0, 0, 0] })),
    }));
  };

  // ===== Filtering =====
  const filteredPoints = editingMap?.points.filter(p => !pointSearch || p.point_name.includes(pointSearch)) || [];
  const filteredLines = editingMap?.lines.filter(l => !lineSearch || l.line_name.includes(lineSearch)) || [];
  const filteredAreas = editingMap?.areas.filter(a => !areaSearch || a.area_name.includes(areaSearch)) || [];

  // ===== Render: Map List =====
  if (!editingMap) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">地图管理</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setImportDialogOpen(true)}>
              <Upload className="h-4 w-4 mr-1" /> 导入地图
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSyncDialogOpen(true)}>
              <RefreshCw className="h-4 w-4 mr-1" /> 同步
            </Button>
          </div>
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="筛选状态" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">全部状态</SelectItem>
            <SelectItem value="active">使用中</SelectItem>
            <SelectItem value="draft">草稿</SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredMaps.map(map => (
            <div key={map.map_id} className="border rounded-lg overflow-hidden bg-card hover:shadow-md transition-shadow">
              <div className="aspect-video bg-slate-100 relative flex items-center justify-center">
                <MapIcon className="h-12 w-12 text-slate-300" />
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-sm truncate">{map.map_name}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6">⋯</Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingMap(map)}>
                        <Eye className="h-4 w-4 mr-2" /> 进入编辑器
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setRenameTarget(map); setRenameValue(map.map_name); setRenameDialogOpen(true); }}>
                        <Pencil className="h-4 w-4 mr-2" /> 重命名
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setCopyTarget(map); setCopyName(`${map.map_name}-副本`); setCopyDeviceId(""); setCopyDialogOpen(true); }}>
                        <Copy className="h-4 w-4 mr-2" /> 复制地图
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExportMap(map)}>
                        <Download className="h-4 w-4 mr-2" /> 导出地图
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => { setDeleteTarget(map); setDeleteDialogOpen(true); }}>
                        <Trash2 className="h-4 w-4 mr-2" /> 删除地图
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div className="flex justify-between"><span>尺寸</span><span>{map.map_size}</span></div>
                  <div className="flex justify-between"><span>点位/线路</span><span>{map.points.length} / {map.lines.length}</span></div>
                </div>
                <Badge variant={map.map_status === 'active' ? 'default' : 'secondary'} className="text-xs">
                  {map.map_status === 'active' ? '使用中' : map.map_status === 'draft' ? '草稿' : '已归档'}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Import Dialog */}
        <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
          <DialogContent><DialogTitle>导入地图</DialogTitle><DialogDescription>上传 .pgm 格式地图文件</DialogDescription>
            <div className="space-y-4">
              <div><Label>选择文件 (.pgm)</Label><Input type="file" accept=".pgm" ref={fileInputRef} onChange={handleImportFile} /></div>
              <div><Label>关联机器狗设备</Label>
                <Select value={importDeviceId} onValueChange={setImportDeviceId}>
                  <SelectTrigger><SelectValue placeholder="选择设备" /></SelectTrigger>
                  <SelectContent>{devices.filter(d => d.device_type === 'robot_dog').map(d => <SelectItem key={d.device_id} value={d.device_id}>{d.device_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Sync Dialog */}
        <Dialog open={syncDialogOpen} onOpenChange={setSyncDialogOpen}>
          <DialogContent className="max-w-lg"><DialogTitle>同步地图</DialogTitle><DialogDescription>从机器狗设备同步地图数据</DialogDescription>
            <div className="space-y-4">
              <div><Label>选择机器狗设备</Label>
                <Select value={syncDevice} onValueChange={handleSyncSelectDevice}>
                  <SelectTrigger><SelectValue placeholder="选择设备" /></SelectTrigger>
                  <SelectContent>{devices.filter(d => d.device_type === 'robot_dog').map(d => <SelectItem key={d.device_id} value={d.device_id}>{d.device_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              {syncDevice && syncDeviceMaps.length > 0 && (
                <div className="space-y-2 max-h-60 overflow-y-auto border rounded p-2">
                  {syncDeviceMaps.map(m => (
                    <div key={m.id} className="flex items-start gap-2 p-2 rounded hover:bg-muted">
                      <Checkbox checked={syncSelectedMapIds.includes(m.id)} onCheckedChange={(checked: boolean) => {
                        setSyncSelectedMapIds(prev => checked ? [...prev, m.id] : prev.filter(id => id !== m.id));
                      }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">{m.name}</div>
                        <div className="text-xs text-muted-foreground">{m.size} · {m.points}点位 · {m.lines}线路 · {m.areas}区域</div>
                        {syncSelectedMapIds.includes(m.id) && (
                          <Input className="mt-1 h-7 text-xs" placeholder="自定义地图名称" value={syncMapNames[m.id] || m.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSyncMapNames(prev => ({ ...prev, [m.id]: e.target.value }))} />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {syncSelectedMapIds.length > 0 && <Button className="w-full" onClick={handleSyncConfirm}><RefreshCw className="h-4 w-4 mr-2" /> 同步 ({syncSelectedMapIds.length})</Button>}
            </div>
          </DialogContent>
        </Dialog>

        {/* Copy Dialog */}
        <Dialog open={copyDialogOpen} onOpenChange={setCopyDialogOpen}>
          <DialogContent><DialogTitle>复制地图</DialogTitle><DialogDescription>将完整复制原地图所有信息</DialogDescription>
            <div className="space-y-4">
              <div><Label>原地图</Label><div className="text-sm text-muted-foreground">{copyTarget?.map_name}</div></div>
              <div><Label>新地图名称</Label><Input value={copyName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCopyName(e.target.value)} /></div>
              <div><Label>关联机器狗设备</Label>
                <Select value={copyDeviceId} onValueChange={setCopyDeviceId}>
                  <SelectTrigger><SelectValue placeholder="选择设备" /></SelectTrigger>
                  <SelectContent>{devices.filter(d => d.device_type === 'robot_dog').map(d => <SelectItem key={d.device_id} value={d.device_id}>{d.device_name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleCopyMap}><Copy className="h-4 w-4 mr-2" /> 确认复制</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Rename Dialog */}
        <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
          <DialogContent><DialogTitle>重命名地图</DialogTitle><DialogDescription>修改地图名称</DialogDescription>
            <Input value={renameValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRenameValue(e.target.value)} />
            <Button onClick={handleRenameMap}>确认</Button>
          </DialogContent>
        </Dialog>

        {/* Delete Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader><AlertDialogTitle>确认删除</AlertDialogTitle><AlertDialogDescription>删除后无法恢复，相关任务需重新配置。确认删除地图「{deleteTarget?.map_name}」？</AlertDialogDescription></AlertDialogHeader>
            <AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction onClick={handleDeleteMap} className="bg-destructive text-destructive-foreground">删除</AlertDialogAction></AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ===== Render: Map Editor =====
  const isChargingPoint = pointForm.point_type === 'charging';

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-slate-900 text-white shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800" onClick={handleExitEditor}>
            <LogOut className="h-4 w-4 mr-1" /> 退出
          </Button>
          <span className="font-medium">{editingMap.map_name}</span>
          <span className="text-xs text-slate-400">{editingMap.map_size}</span>
          <span className="text-xs text-slate-400">{editingMap.points.length}点位 · {editingMap.lines.length}线路 · {editingMap.areas.length}区域</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-slate-800" onClick={() => setHasUnsavedChanges(false)}>
            <Save className="h-4 w-4 mr-1" /> 保存
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b bg-slate-50 shrink-0 flex-wrap">
        <Button size="sm" variant={addingPointOnMap ? 'default' : 'outline'} onClick={() => { setAddingPointOnMap(true); openAddPoint(); }}>
          <Plus className="h-3 w-3 mr-1" /> 添加点位
        </Button>
        <Button size="sm" variant="outline" onClick={openAddLine}><Plus className="h-3 w-3 mr-1" /> 添加线路</Button>
        <Separator orientation="vertical" className="h-6" />
        <Button size="sm" variant="outline" className="border-green-300 text-green-700" onClick={() => openAddArea('standard')}><Plus className="h-3 w-3 mr-1" /> 标准通行区</Button>
        <Button size="sm" variant="outline" className="border-orange-300 text-orange-700" onClick={() => openAddArea('restricted')}><Plus className="h-3 w-3 mr-1" /> 限制通行区</Button>
        <Button size="sm" variant="outline" className="border-red-300 text-red-700" onClick={() => openAddArea('forbidden')}><Plus className="h-3 w-3 mr-1" /> 禁止通行区</Button>
      </div>

      {/* Main content: Canvas + Right panel */}
      <div className="flex flex-1 min-h-0">
        {/* Canvas */}
        <div className="flex-1 bg-slate-950 relative overflow-hidden">
          <svg
            className="w-full h-full"
            viewBox="0 0 400 300"
            preserveAspectRatio="xMidYMid meet"
            onClick={handleMapClick}
            style={{ cursor: addingPointOnMap ? 'crosshair' : 'default' }}
          >
            {/* Grid */}
            {Array.from({ length: 21 }, (_, i) => (
              <line key={`gv${i}`} x1={i * 20} y1={0} x2={i * 20} y2={300} stroke="#1e293b" strokeWidth={0.5} />
            ))}
            {Array.from({ length: 16 }, (_, i) => (
              <line key={`gh${i}`} x1={0} y1={i * 20} x2={400} y2={i * 20} stroke="#1e293b" strokeWidth={0.5} />
            ))}

            {/* Areas */}
            {editingMap.areas.map(area => {
              const colors: Record<string, { fill: string; stroke: string }> = { standard: { fill: 'rgba(34,197,94,0.12)', stroke: '#22c55e' }, restricted: { fill: 'rgba(249,115,22,0.12)', stroke: '#f97316' }, forbidden: { fill: 'rgba(239,68,68,0.15)', stroke: '#ef4444' } };
              const c = colors[area.area_type] || colors.standard;
              const pts = area.vertices.map(v => `${v.x},${v.y}`).join(' ');
              return <polygon key={area.area_id} points={pts} fill={c.fill} stroke={c.stroke} strokeWidth={1.5} strokeDasharray={area.area_type === 'forbidden' ? '4,2' : 'none'} />;
            })}

            {/* Lines */}
            {editingMap.lines.map(line => {
              const linePoints = line.point_ids.map(pid => editingMap.points.find(p => p.point_id === pid)).filter((p): p is MapPoint => !!p);
              if (linePoints.length < 2) return null;
              const d = linePoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
              return <path key={line.line_id} d={d} fill="none" stroke="#4ade80" strokeWidth={2} strokeDasharray="6,3" />;
            })}

            {/* Points */}
            {editingMap.points.map(p => {
              const yawRad = ((p.yaw || 0) * Math.PI) / 180;
              const arrowLen = 8;
              const ax = p.x + Math.sin(yawRad) * arrowLen;
              const ay = p.y - Math.cos(yawRad) * arrowLen;
              const isPatrol = p.point_type === 'patrol';
              const isCharging = p.point_type === 'charging';
              const isDev = p.is_device;
              const pointColor = isDev ? '#94a3b8' : isCharging ? '#facc15' : '#3b82f6';
              const arrowColor = isDev ? '#cbd5e1' : isCharging ? '#fef08a' : '#93c5fd';
              return (
                <g key={p.point_id} className="cursor-pointer" onClick={(e: React.MouseEvent<SVGGElement>) => { e.stopPropagation(); setSelectedPoint(p); }}>
                  {isDev ? (
                    <rect x={p.x - 5} y={p.y - 5} width={10} height={10} fill={pointColor} stroke={arrowColor} strokeWidth={1} rx={1} />
                  ) : isCharging ? (
                    <circle cx={p.x} cy={p.y} r={6} fill={pointColor} stroke={arrowColor} strokeWidth={1.5} />
                  ) : (
                    <circle cx={p.x} cy={p.y} r={6} fill={pointColor} stroke={arrowColor} strokeWidth={1.5} />
                  )}
                  <line x1={p.x} y1={p.y} x2={ax} y2={ay} stroke={arrowColor} strokeWidth={2} />
                  <polygon points={`${ax},${ay} ${ax - Math.sin(yawRad - 0.5) * 4},${ay + Math.cos(yawRad - 0.5) * 4} ${ax - Math.sin(yawRad + 0.5) * 4},${ay + Math.cos(yawRad + 0.5) * 4}`} fill={arrowColor} />
                  <text x={p.x} y={p.y + 16} textAnchor="middle" fill="#94a3b8" fontSize={8}>{p.point_name}</text>
                </g>
              );
            })}

            {/* Current point being placed */}
            {addingPointOnMap && pointForm.x !== undefined && (
              <g>
                <circle cx={pointForm.x} cy={pointForm.y || 0} r={8} fill="none" stroke="#f59e0b" strokeWidth={2} strokeDasharray="3,2" />
                <line x1={pointForm.x} y1={pointForm.y || 0} x2={pointForm.x + Math.sin(((pointForm.yaw || 0) * Math.PI) / 180) * 12} y2={(pointForm.y || 0) - Math.cos(((pointForm.yaw || 0) * Math.PI) / 180) * 12} stroke="#f59e0b" strokeWidth={2} />
              </g>
            )}
          </svg>

          {/* Legend */}
          <div className="absolute bottom-3 left-3 bg-slate-900/80 text-white text-xs p-2 rounded space-y-1">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> 巡检点</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> 充电点</div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 bg-slate-400 inline-block" /> 设备点位</div>
            <div className="flex items-center gap-2"><span className="w-6 border-t-2 border-dashed border-green-400 inline-block" /> 巡检线路</div>
          </div>
        </div>

        {/* Right panel */}
        <div className="w-80 border-l bg-background flex flex-col shrink-0 overflow-hidden">
          <div className="flex border-b shrink-0">
            {[
              { key: 'points', label: '点位', color: 'text-blue-600' },
              { key: 'lines', label: '线路', color: 'text-green-600' },
              { key: 'areas', label: '区域', color: 'text-orange-600' },
              { key: 'arm', label: '机械臂', color: 'text-purple-600' },
            ].map(tab => (
              <button key={tab.key} className={`flex-1 py-2 text-xs font-medium border-b-2 transition-colors ${editorTab === tab.key ? `border-current ${tab.color}` : 'border-transparent text-muted-foreground hover:text-foreground'}`} onClick={() => setEditorTab(tab.key)}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {/* ===== Points Tab ===== */}
            {editorTab === 'points' && (
              <>
                <div className="flex gap-2">
                  <div className="relative flex-1"><Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" /><Input className="pl-7 h-8 text-xs" placeholder="搜索点位" value={pointSearch} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPointSearch(e.target.value)} /></div>
                </div>
                {filteredPoints.map(p => (
                  <div key={p.point_id} className={`p-2 border rounded text-xs cursor-pointer hover:bg-muted transition-colors ${selectedPoint?.point_id === p.point_id ? 'border-blue-500 bg-blue-50' : ''}`} onClick={() => setSelectedPoint(p)}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {p.is_device ? <span className="w-2 h-2 bg-slate-400 rounded-sm" /> : p.point_type === 'charging' ? <span className="w-2 h-2 bg-yellow-400 rounded-full" /> : <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                        <span className="font-medium">{p.point_name}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e: React.MouseEvent) => { e.stopPropagation(); openEditPoint(p); }}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setSelectedPoint(p); setDeletePointDialog(true); }}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                    <div className="text-muted-foreground mt-1">X:{p.x} Y:{p.y} Yaw:{p.yaw ?? 0}°</div>
                  </div>
                ))}
              </>
            )}

            {/* ===== Lines Tab ===== */}
            {editorTab === 'lines' && (
              <>
                <div className="flex gap-2">
                  <div className="relative flex-1"><Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" /><Input className="pl-7 h-8 text-xs" placeholder="搜索线路" value={lineSearch} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLineSearch(e.target.value)} /></div>
                </div>
                {filteredLines.map(l => (
                  <div key={l.line_id} className={`p-2 border rounded text-xs cursor-pointer hover:bg-muted ${selectedLine?.line_id === l.line_id ? 'border-green-500 bg-green-50' : ''}`} onClick={() => setSelectedLine(l)}>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{l.line_name}</span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setLineForm({ ...l }); setEditLineDialog(true); }}><Pencil className="h-3 w-3" /></Button>
                        <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={(e: React.MouseEvent) => { e.stopPropagation(); updateEditingMap(m => ({ ...m, lines: m.lines.filter(x => x.line_id !== l.line_id) })); }}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </div>
                    <div className="text-muted-foreground mt-1">{l.point_ids.length} 个点位</div>
                  </div>
                ))}
              </>
            )}

            {/* ===== Areas Tab ===== */}
            {editorTab === 'areas' && (
              <>
                <div className="flex gap-2">
                  <div className="relative flex-1"><Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" /><Input className="pl-7 h-8 text-xs" placeholder="搜索区域" value={areaSearch} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAreaSearch(e.target.value)} /></div>
                </div>
                {filteredAreas.map(a => {
                  const typeInfo: Record<string, { label: string; color: string }> = { standard: { label: '标准通行区', color: 'text-green-600' }, restricted: { label: '限制通行区', color: 'text-orange-600' }, forbidden: { label: '禁止通行区', color: 'text-red-600' } };
                  const info = typeInfo[a.area_type] || typeInfo.standard;
                  return (
                    <div key={a.area_id} className={`p-2 border rounded text-xs cursor-pointer hover:bg-muted ${selectedArea?.area_id === a.area_id ? 'border-orange-500 bg-orange-50' : ''}`} onClick={() => setSelectedArea(a)}>
                      <div className="flex items-center justify-between">
                        <div><span className="font-medium">{a.area_name}</span> <span className={`ml-1 ${info.color}`}>({info.label})</span></div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-5 w-5" onClick={(e: React.MouseEvent) => { e.stopPropagation(); setAreaForm({ ...a }); setEditAreaDialog(true); }}><Pencil className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={(e: React.MouseEvent) => { e.stopPropagation(); updateEditingMap(m => ({ ...m, areas: m.areas.filter(x => x.area_id !== a.area_id) })); }}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}

            {/* ===== Arm Tab ===== */}
            {editorTab === 'arm' && (
              <>
                <div className="flex gap-2 mb-2">
                  <Button size="sm" className="flex-1" onClick={handleAddPose}><Plus className="h-3 w-3 mr-1" /> 获取当前姿态</Button>
                  <Button size="sm" variant="outline" onClick={handleResetArmPoses}><RotateCcw className="h-3 w-3 mr-1" /> 复位</Button>
                </div>
                <div className="aspect-video bg-slate-900 rounded flex items-center justify-center mb-3">
                  <div className="text-slate-500 text-xs">机械臂视频画面</div>
                </div>
                {editingMap.arm_poses.map((pose) => (
                  <div key={pose.pose_id} className="p-2 border rounded text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      {editingPoseName === pose.pose_id ? (
                        <Input className="h-6 text-xs w-28" value={poseNameValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPoseNameValue(e.target.value)} onBlur={() => handleRenamePose(pose.pose_id)} onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && handleRenamePose(pose.pose_id)} autoFocus />
                      ) : (
                        <span className="font-medium cursor-pointer" onClick={() => { setEditingPoseName(pose.pose_id); setPoseNameValue(pose.pose_name); }}>{pose.pose_name}</span>
                      )}
                      <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive" onClick={() => handleDeletePose(pose.pose_id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center text-muted-foreground">
                      {pose.joint_angles.map((angle: number, ji: number) => (
                        <div key={ji}><div className="text-[9px]">J{ji + 1}</div><div className="font-mono">{angle}°</div></div>
                      ))}
                    </div>
                  </div>
                ))}
                {editingMap.arm_poses.length === 0 && <div className="text-xs text-muted-foreground text-center py-4">暂无姿态数据，点击"获取当前姿态"添加</div>}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ===== Point Add/Edit Dialog ===== */}
      <Dialog open={addPointDialog || editPointDialog} onOpenChange={(open: boolean) => { if (!open) { setAddPointDialog(false); setEditPointDialog(false); setAddingPointOnMap(false); } }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogTitle>{editPointDialog ? '编辑点位' : '添加点位'}</DialogTitle>
          <DialogDescription>设置点位信息、机械臂配置和语音配置</DialogDescription>
          <div className="space-y-4">
            {/* Basic info */}
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">点位名称</Label><Input className="h-8 text-xs" value={pointForm.point_name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPointForm(p => ({ ...p, point_name: e.target.value }))} /></div>
              <div><Label className="text-xs">点位类型</Label>
                <Select value={pointForm.point_type || 'patrol'} onValueChange={(v: string) => setPointForm(p => ({ ...p, point_type: v as MapPoint['point_type'] }))}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patrol">巡检点</SelectItem>
                    <SelectItem value="charging">充电点</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <div><Label className="text-xs">X 坐标</Label><Input type="number" className="h-8 text-xs" value={pointForm.x || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPointForm(p => ({ ...p, x: Number(e.target.value) }))} /></div>
              <div><Label className="text-xs">Y 坐标</Label><Input type="number" className="h-8 text-xs" value={pointForm.y || 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPointForm(p => ({ ...p, y: Number(e.target.value) }))} /></div>
              <div><Label className="text-xs">Yaw 角度</Label><Input type="number" className="h-8 text-xs" value={pointForm.yaw ?? 0} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPointForm(p => ({ ...p, yaw: Number(e.target.value) }))} /></div>
              <div className="flex items-end"><label className="flex items-center gap-1.5 text-xs"><input type="checkbox" checked={pointForm.is_device || false} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPointForm(p => ({ ...p, is_device: e.target.checked }))} /> 设备点位</label></div>
            </div>



            {!isChargingPoint && (
              <>
                {/* Arm config */}
                <Separator />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs font-semibold">机械臂配置</Label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1 text-xs"><Switch checked={pointForm.arm_config?.enabled ?? true} onCheckedChange={(checked: boolean) => setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, enabled: checked } }))} /> 执行姿态</label>
                    </div>
                  </div>

                  {/* Sync pose button */}
                  <div className="flex items-center gap-2 mb-3">
                    <Button size="sm" variant="outline" className="text-xs h-7" onClick={handleSyncPointPose} disabled={!syncSourcePointId}>
                      <Copy className="h-3 w-3 mr-1" /> 同步点位姿态
                    </Button>
                    <Select value={syncSourcePointId} onValueChange={setSyncSourcePointId}>
                      <SelectTrigger className="h-7 text-xs w-40"><SelectValue placeholder="选择源点位" /></SelectTrigger>
                      <SelectContent>{editingMap.points.filter(p => p.point_id !== pointForm.point_id).map(p => <SelectItem key={p.point_id} value={p.point_id}>{p.point_name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>

                  {/* Mode toggle */}
                  <div className="flex gap-2 mb-3">
                    <Button size="sm" variant={pointForm.arm_config?.mode === 'preset' ? 'default' : 'outline'} className="text-xs h-7" onClick={() => setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, mode: 'preset' as const, preset_poses: p.arm_config?.preset_poses || [], custom_poses: [] } }))}>预设姿态</Button>
                    <Button size="sm" variant={pointForm.arm_config?.mode === 'custom' ? 'default' : 'outline'} className="text-xs h-7" onClick={() => setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, mode: 'custom' as const, preset_poses: [], custom_poses: p.arm_config?.custom_poses || [] } }))}>自定义姿态</Button>
                  </div>

                  {/* Preset mode */}
                  {pointForm.arm_config?.mode === 'preset' && (
                    <div className="space-y-2">
                      {(pointForm.arm_config?.preset_poses || []).map((pose, idx: number) => (
                        <div key={idx} className="border rounded p-2 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground w-4">{idx + 1}</span>
                            <Select value={pose.pose_id} onValueChange={(v: string) => {
                              const newPoses = [...(pointForm.arm_config?.preset_poses || [])];
                              newPoses[idx] = { ...newPoses[idx], pose_id: v };
                              setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, preset_poses: newPoses } }));
                            }}>
                              <SelectTrigger className="h-7 text-xs flex-1"><SelectValue placeholder="选择姿态" /></SelectTrigger>
                              <SelectContent>{editingMap.arm_poses.map(ap => <SelectItem key={ap.pose_id} value={ap.pose_id}>{ap.pose_name}</SelectItem>)}</SelectContent>
                            </Select>
                            <Button size="icon" variant="ghost" className="h-6 w-6" disabled={idx === 0} onClick={() => {
                              const poses = [...(pointForm.arm_config?.preset_poses || [])];
                              [poses[idx], poses[idx - 1]] = [poses[idx - 1], poses[idx]];
                              setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, preset_poses: poses } }));
                            }}><ChevronUp className="h-3 w-3" /></Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6" disabled={idx === (pointForm.arm_config?.preset_poses?.length || 0) - 1} onClick={() => {
                              const poses = [...(pointForm.arm_config?.preset_poses || [])];
                              [poses[idx], poses[idx + 1]] = [poses[idx + 1], poses[idx]];
                              setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, preset_poses: poses } }));
                            }}><ChevronDown className="h-3 w-3" /></Button>
                            <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive" onClick={() => {
                              const poses = (pointForm.arm_config?.preset_poses || []).filter((_: { pose_id: string; algorithm_id?: string }, i: number) => i !== idx);
                              setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, preset_poses: poses } }));
                            }}><X className="h-3 w-3" /></Button>
                          </div>
                          <div className="flex items-center gap-2 pl-6">
                            <Label className="text-[10px] shrink-0 text-muted-foreground">关联算法</Label>
                            <Select value={pose.algorithm_id || '__none__'} onValueChange={(v: string) => {
                              const newPoses = [...(pointForm.arm_config?.preset_poses || [])];
                              newPoses[idx] = { ...newPoses[idx], algorithm_id: v === '__none__' ? undefined : v };
                              setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, preset_poses: newPoses } }));
                            }}>
                              <SelectTrigger className="h-6 text-[10px] flex-1"><SelectValue placeholder="选择算法" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">不关联算法</SelectItem>
                                {algorithms.filter(a => a.status === 'online').map(a => (
                                  <SelectItem key={a.algorithm_id} value={a.algorithm_id}>{a.algorithm_name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, preset_poses: [...(p.arm_config?.preset_poses || []), { pose_id: '' }] } }))}><Plus className="h-3 w-3 mr-1" /> 添加姿态</Button>
                    </div>
                  )}

                  {/* Custom mode */}
                  {pointForm.arm_config?.mode === 'custom' && (
                    <div className="space-y-3">
                      {(pointForm.arm_config?.custom_poses || []).map((pose, idx: number) => (
                        <div key={idx} className="border rounded p-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <Input className="h-6 text-xs w-28" value={pose.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                              const poses = [...(pointForm.arm_config?.custom_poses || [])];
                              poses[idx] = { ...poses[idx], name: e.target.value };
                              setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, custom_poses: poses } }));
                            }} />
                            <div className="flex gap-1">
                              <Button size="icon" variant="ghost" className="h-5 w-5" disabled={idx === 0} onClick={() => { const poses = [...(pointForm.arm_config?.custom_poses || [])]; [poses[idx], poses[idx - 1]] = [poses[idx - 1], poses[idx]]; setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, custom_poses: poses } })); }}><ChevronUp className="h-3 w-3" /></Button>
                              <Button size="icon" variant="ghost" className="h-5 w-5" disabled={idx === (pointForm.arm_config?.custom_poses?.length || 0) - 1} onClick={() => { const poses = [...(pointForm.arm_config?.custom_poses || [])]; [poses[idx], poses[idx + 1]] = [poses[idx + 1], poses[idx]]; setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, custom_poses: poses } })); }}><ChevronDown className="h-3 w-3" /></Button>
                              <Button size="icon" variant="ghost" className="h-5 w-5 text-destructive" onClick={() => { const poses = (pointForm.arm_config?.custom_poses || []).filter((_: { name: string; joint_angles: number[]; algorithm_id?: string }, i: number) => i !== idx); setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, custom_poses: poses } })); }}><X className="h-3 w-3" /></Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-x-3 gap-y-1">
                            {(['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7'] as const).map((label, ji: number) => (
                              <div key={label} className="flex items-center gap-1">
                                <span className="text-[10px] text-muted-foreground w-5">{label}</span>
                                <Slider className="flex-1" min={-180} max={180} step={1} value={[pose.joint_angles[ji] || 0]} onValueChange={([v]: [number]) => {
                                  const poses = [...(pointForm.arm_config?.custom_poses || [])];
                                  const angles = [...poses[idx].joint_angles];
                                  angles[ji] = v;
                                  poses[idx] = { ...poses[idx], joint_angles: angles };
                                  setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, custom_poses: poses } }));
                                }} />
                                <span className="text-[10px] w-8 text-right">{pose.joint_angles[ji] || 0}°</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-[10px] shrink-0 text-muted-foreground">关联算法</Label>
                            <Select value={pose.algorithm_id || '__none__'} onValueChange={(v: string) => {
                              const poses = [...(pointForm.arm_config?.custom_poses || [])];
                              poses[idx] = { ...poses[idx], algorithm_id: v === '__none__' ? undefined : v };
                              setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, custom_poses: poses } }));
                            }}>
                              <SelectTrigger className="h-6 text-[10px] flex-1"><SelectValue placeholder="选择算法" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="__none__">不关联算法</SelectItem>
                                {algorithms.filter(a => a.status === 'online').map(a => (
                                  <SelectItem key={a.algorithm_id} value={a.algorithm_id}>{a.algorithm_name}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      ))}
                      <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, custom_poses: [...(p.arm_config?.custom_poses || []), { name: `姿态${(p.arm_config?.custom_poses?.length || 0) + 1}`, joint_angles: [0, 0, 0, 0, 0, 0, 0] }] } }))}><Plus className="h-3 w-3 mr-1" /> 添加姿态</Button>
                    </div>
                  )}

                  {/* Speed */}
                  <div className="flex items-center gap-3 mt-3">
                    <Label className="text-xs shrink-0">运行速度</Label>
                    <Slider className="flex-1" min={1} max={100} step={1} value={[pointForm.arm_config?.speed || 50]} onValueChange={([v]: [number]) => setPointForm(p => ({ ...p, arm_config: { ...p.arm_config!, speed: v } }))} />
                    <span className="text-xs w-8 text-right">{pointForm.arm_config?.speed || 50}%</span>
                  </div>
                </div>

                {/* Voice config */}
                <Separator />
                <div>
                  <Label className="text-xs font-semibold">语音配置</Label>
                  <div className="mt-2 space-y-3">
                    <div><Label className="text-[10px]">播报内容</Label><Textarea className="h-16 text-xs" value={pointForm.voice_content || ''} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPointForm(p => ({ ...p, voice_content: e.target.value }))} /></div>
                    <div className="flex items-center gap-3">
                      <Label className="text-xs shrink-0">音量</Label>
                      <Slider className="flex-1" min={0} max={100} step={1} value={[pointForm.voice_volume ?? 80]} onValueChange={([v]: [number]) => setPointForm(p => ({ ...p, voice_volume: v }))} />
                      <span className="text-xs w-8 text-right">{pointForm.voice_volume ?? 80}%</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => { setAddPointDialog(false); setEditPointDialog(false); setAddingPointOnMap(false); }}>取消</Button>
            <Button size="sm" onClick={editPointDialog ? handleUpdatePoint : handleAddPoint}>{editPointDialog ? '保存' : '添加'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Point Dialog */}
      <AlertDialog open={deletePointDialog} onOpenChange={setDeletePointDialog}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>确认删除点位</AlertDialogTitle><AlertDialogDescription>删除后相关任务需重新配置。确认删除点位「{selectedPoint?.point_name}」？</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>取消</AlertDialogCancel><AlertDialogAction onClick={handleDeletePoint} className="bg-destructive text-destructive-foreground">删除</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Line Dialog */}
      <Dialog open={addLineDialog} onOpenChange={setAddLineDialog}>
        <DialogContent><DialogTitle>添加线路</DialogTitle><DialogDescription>选择点位组成巡检线路</DialogDescription>
          <div className="space-y-4">
            <div><Label>线路名称</Label><Input value={lineForm.line_name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLineForm(f => ({ ...f, line_name: e.target.value }))} /></div>
            <div><Label>选择点位（按顺序）</Label>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {editingMap.points.map(p => (
                  <label key={p.point_id} className="flex items-center gap-2 p-1 hover:bg-muted rounded cursor-pointer text-sm">
                    <input type="checkbox" checked={(lineForm.point_ids || []).includes(p.point_id)} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      const ids = [...(lineForm.point_ids || [])];
                      if (e.target.checked) ids.push(p.point_id);
                      else ids.splice(ids.indexOf(p.point_id), 1);
                      setLineForm(f => ({ ...f, point_ids: ids }));
                    }} />
                    {p.point_name}
                  </label>
                ))}
              </div>
            </div>
            {(lineForm.point_ids || []).length > 0 && (
              <div><Label>点位顺序</Label>
                <div className="space-y-1">{(lineForm.point_ids || []).map((pid: string, idx: number) => {
                  const pt = editingMap.points.find(p => p.point_id === pid);
                  return (
                    <div key={pid} className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{idx + 1}.</span>
                      <span>{pt?.point_name || pid}</span>
                      <Button size="icon" variant="ghost" className="h-5 w-5" disabled={idx === 0} onClick={() => { const ids = [...(lineForm.point_ids || [])]; [ids[idx], ids[idx - 1]] = [ids[idx - 1], ids[idx]]; setLineForm(f => ({ ...f, point_ids: ids })); }}><ChevronUp className="h-3 w-3" /></Button>
                      <Button size="icon" variant="ghost" className="h-5 w-5" disabled={idx === (lineForm.point_ids?.length || 0) - 1} onClick={() => { const ids = [...(lineForm.point_ids || [])]; [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]]; setLineForm(f => ({ ...f, point_ids: ids })); }}><ChevronDown className="h-3 w-3" /></Button>
                    </div>
                  );
                })}</div>
              </div>
            )}
            <Button onClick={handleAddLine}>添加线路</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Line Dialog */}
      <Dialog open={editLineDialog} onOpenChange={setEditLineDialog}>
        <DialogContent><DialogTitle>编辑线路</DialogTitle><DialogDescription>修改线路点位组成和顺序</DialogDescription>
          <div className="space-y-4">
            <div><Label>线路名称</Label><Input value={lineForm.line_name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLineForm(f => ({ ...f, line_name: e.target.value }))} /></div>
            <div><Label>点位顺序</Label>
              <div className="space-y-1">{(lineForm.point_ids || []).map((pid: string, idx: number) => {
                const pt = editingMap.points.find(p => p.point_id === pid);
                return (
                  <div key={pid} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">{idx + 1}.</span><span>{pt?.point_name || pid}</span>
                    <Button size="icon" variant="ghost" className="h-5 w-5" disabled={idx === 0} onClick={() => { const ids = [...(lineForm.point_ids || [])]; [ids[idx], ids[idx - 1]] = [ids[idx - 1], ids[idx]]; setLineForm(f => ({ ...f, point_ids: ids })); }}><ChevronUp className="h-3 w-3" /></Button>
                    <Button size="icon" variant="ghost" className="h-5 w-5" disabled={idx === (lineForm.point_ids?.length || 0) - 1} onClick={() => { const ids = [...(lineForm.point_ids || [])]; [ids[idx], ids[idx + 1]] = [ids[idx + 1], ids[idx]]; setLineForm(f => ({ ...f, point_ids: ids })); }}><ChevronDown className="h-3 w-3" /></Button>
                  </div>
                );
              })}</div>
            </div>
            <Button onClick={() => {
              if (lineForm.line_id) updateEditingMap(m => ({ ...m, lines: m.lines.map(l => l.line_id === lineForm.line_id ? { ...l, line_name: lineForm.line_name!, point_ids: lineForm.point_ids || [] } : l) }));
              setEditLineDialog(false);
            }}>保存</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Area Dialog */}
      <Dialog open={addAreaDialog || editAreaDialog} onOpenChange={(open: boolean) => { if (!open) { setAddAreaDialog(false); setEditAreaDialog(false); } }}>
        <DialogContent><DialogTitle>{editAreaDialog ? '编辑区域' : '添加区域'}</DialogTitle><DialogDescription>设置区域属性</DialogDescription>
          <div className="space-y-4">
            <div><Label>区域名称</Label><Input value={areaForm.area_name || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAreaForm(f => ({ ...f, area_name: e.target.value }))} /></div>
            <div><Label>区域类型</Label>
              <Select value={areaForm.area_type || 'standard'} onValueChange={(v: string) => setAreaForm(f => ({ ...f, area_type: v as MapArea['area_type'] }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">标准通行区</SelectItem>
                  <SelectItem value="restricted">限制通行区</SelectItem>
                  <SelectItem value="forbidden">禁止通行区</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {areaForm.area_type === 'restricted' && (
              <>
                <div><Label>限速 (m/s)</Label><Input type="number" step={0.1} value={areaForm.speed_limit || 0.5} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAreaForm(f => ({ ...f, speed_limit: Number(e.target.value) }))} /></div>
                <div><Label>通过姿态</Label>
                  <Select value={areaForm.posture || 'normal'} onValueChange={(v: string) => setAreaForm(f => ({ ...f, posture: v as 'normal' | 'slow' | 'crawl' }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="normal">正常</SelectItem><SelectItem value="slow">慢速</SelectItem><SelectItem value="crawl">匍匐</SelectItem></SelectContent>
                  </Select>
                </div>
              </>
            )}
            <div><Label>描述</Label><Input value={areaForm.description || ''} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAreaForm(f => ({ ...f, description: e.target.value }))} /></div>
            <Button onClick={() => {
              if (editAreaDialog && areaForm.area_id) {
                updateEditingMap(m => ({ ...m, areas: m.areas.map(a => a.area_id === areaForm.area_id ? { ...a, ...areaForm } as MapArea : a) }));
                setEditAreaDialog(false);
              } else { handleAddArea(); }
            }}>{editAreaDialog ? '保存' : '添加'}</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Exit Confirm Dialog */}
      <AlertDialog open={exitConfirmOpen} onOpenChange={setExitConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>未保存的更改</AlertDialogTitle>
            <AlertDialogDescription>您有未保存的更改，是否保存后再退出？</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExit} className="bg-destructive text-destructive-foreground">确认退出</AlertDialogAction>
            <AlertDialogAction onClick={handleSaveAndExit}>保存并退出</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
