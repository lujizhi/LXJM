'use client';

import { useState, useRef } from 'react';
import {
  ListChecks,
  Plus,
  Search,
  Play,
  Pause,
  Square,
  XCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  MoreVertical,
  Download,
  RefreshCw,
  MapPin,
  Video,
  Monitor,
  Map,
  Trash2,
  RotateCcw,
  Image as ImageIcon,
  Navigation,
  Home,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  tasks as initialTasks,
  devices,
  maps,
  statusLabels,
  taskTypeLabels,
  type Task,
  type TaskStep,
} from '@/lib/mock-data';

const taskStatusBadge: Record<string, string> = {
  pending: 'bg-gray-100 text-gray-600 border-gray-200',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  paused: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
  failed: 'bg-red-100 text-red-700 border-red-200',
};

const stepStatusIcon: Record<string, React.ElementType> = {
  completed: CheckCircle2,
  in_progress: RefreshCw,
  pending: Clock,
  failed: XCircle,
};

const stepStatusColor: Record<string, string> = {
  completed: 'text-green-600',
  in_progress: 'text-blue-600',
  pending: 'text-gray-400',
  failed: 'text-red-600',
};

const scheduleTypeLabels: Record<string, string> = {
  immediate: '立即执行',
  scheduled: '定时执行',
  periodic: '周期执行',
};

const pointTypeLabels: Record<string, string> = {
  patrol: '巡检点',
  charging: '充电点',
};

// Placeholder arm photo URLs for demo
const placeholderPhotos = [
  'https://placehold.co/400x300/1e293b/94a3b8?text=Arm+Pose+1',
  'https://placehold.co/400x300/1e293b/94a3b8?text=Arm+Pose+2',
  'https://placehold.co/400x300/1e293b/94a3b8?text=Arm+Pose+3',
];

export default function TasksPage() {
  const [taskList, setTaskList] = useState<Task[]>(initialTasks);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [mapFilter, setMapFilter] = useState<string>('all');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [pausedTasks, setPausedTasks] = useState<Record<string, boolean>>({});
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportTask, setReportTask] = useState<Task | null>(null);
  const [reportContent, setReportContent] = useState('');
  const [reportGenerating, setReportGenerating] = useState(false);
  const [executeDialogOpen, setExecuteDialogOpen] = useState(false);
  const [executeTask, setExecuteTask] = useState<Task | null>(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelTask, setCancelTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTask, setDeleteTask] = useState<Task | null>(null);
  const [photoPreviewOpen, setPhotoPreviewOpen] = useState(false);
  const [previewPhotos, setPreviewPhotos] = useState<string[]>([]);
  const [previewPhotoIndex, setPreviewPhotoIndex] = useState(0);
  const nowRef = useRef(Date.now());

  // New task form
  const [newDevice, setNewDevice] = useState('');
  const [newMap, setNewMap] = useState('');
  const [newTaskName, setNewTaskName] = useState('');
  const [newRouteType, setNewRouteType] = useState<'points' | 'path'>('points');
  const [newSelectedPoints, setNewSelectedPoints] = useState<string[]>([]);
  const [newSelectedLine, setNewSelectedLine] = useState('');
  const [newExecutionType, setNewExecutionType] = useState<'immediate' | 'periodic'>('immediate');
  const [newPeriodType, setNewPeriodType] = useState<'hours' | 'daily' | 'custom_date'>('hours');
  const [newPeriodHours, setNewPeriodHours] = useState(2);
  const [newDailyHour, setNewDailyHour] = useState(8);
  const [newDailyMinute, setNewDailyMinute] = useState(0);
  const [newCustomDate, setNewCustomDate] = useState('');
  const [newCustomTime, setNewCustomTime] = useState('08:00');
  const [newNavMode, setNewNavMode] = useState<'autonomous' | 'linear'>('autonomous');
  const [newCompletionAction, setNewCompletionAction] = useState<'return_charger' | 'wait_in_place'>('wait_in_place');

  // Unique map names from tasks for filter
  const taskMapNames = [...new Set(taskList.map(t => t.map_name))];

  const filteredTasks = taskList.filter((task) => {
    const matchesSearch =
      task.task_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.task_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesType = typeFilter === 'all' || task.task_type === typeFilter;
    const matchesMap = mapFilter === 'all' || task.map_name === mapFilter;
    return matchesSearch && matchesStatus && matchesType && matchesMap;
  });

  const selectedMapData = newMap ? maps.find((m) => m.map_id === newMap) : null;

  const handleTogglePause = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPausedTasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const handleExecute = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setExecuteTask(task);
    setExecuteDialogOpen(true);
  };

  const handleCancelTask = () => {
    if (cancelTask) {
      setTaskList((prev) =>
        prev.map((t) => t.task_id === cancelTask.task_id ? { ...t, status: 'cancelled' as const } : t)
      );
      setCancelDialogOpen(false);
      setCancelTask(null);
    }
  };

  const handleDeleteTask = () => {
    if (deleteTask) {
      setTaskList((prev) => prev.filter((t) => t.task_id !== deleteTask.task_id));
      setDeleteDialogOpen(false);
      setDeleteTask(null);
    }
  };

  const [reExecuteTask, setReExecuteTask] = useState<Task | null>(null);

  const handleReExecute = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setReExecuteTask(task);
  };

  const confirmReExecute = () => {
    if (!reExecuteTask) return;
    const newTask: Task = {
      ...reExecuteTask,
      task_id: `task-re-${Date.now()}`,
      status: 'pending',
      started_at: null,
      completed_at: null,
      progress: 0,
      steps: reExecuteTask.steps.map(s => ({ ...s, status: 'pending' as const, started_at: null, completed_at: null })),
    };
    setTaskList((prev) => [...prev, newTask]);
    setReExecuteTask(null);
  };

  const generateReport = (task: Task) => {
    setReportTask(task);
    setReportDialogOpen(true);
    setReportGenerating(true);
    setReportContent('');
    nowRef.current = Date.now();

    const lines = [
      `═══════════════════════════════════════`,
      `        巡检报告`,
      `═══════════════════════════════════════`,
      ``,
      `报告编号: RPT-${task.task_id.toUpperCase()}-${(task.task_id.length * 137).toString(36).toUpperCase()}`,
      `任务名称: ${task.task_name}`,
      `任务类型: ${taskTypeLabels[task.task_type]}`,
      `执行设备: ${task.device_name}`,
      `关联地图: ${task.map_name}`,
      `导航模式: ${task.navigation_mode === 'linear' ? '直线导航' : '自主导航'}`,
      `完成动作: ${task.completion_action === 'return_charger' ? '返回充电桩' : '原地等待'}`,
      `开始时间: ${task.started_at || '-'}`,
      `完成时间: ${task.completed_at || '-'}`,
      `执行进度: ${task.progress}%`,
      ``,
      `───────────────────────────────────────`,
      `  执行步骤详情`,
      `───────────────────────────────────────`,
      ``,
    ];

    task.steps.forEach((step, idx) => {
      lines.push(`${idx + 1}. ${step.point_name}`);
      lines.push(`   类型: ${pointTypeLabels[step.point_type] || step.point_type}`);
      lines.push(`   状态: ${statusLabels[step.status]}`);
      lines.push(`   操作: ${step.action}`);
      if (step.algorithm_name) lines.push(`   关联算法: ${step.algorithm_name}`);
      if (step.arm_photos && step.arm_photos.length > 0) lines.push(`   拍照数量: ${step.arm_photos.length}`);
      if (step.started_at) lines.push(`   开始: ${step.started_at}`);
      if (step.completed_at) lines.push(`   完成: ${step.completed_at}`);
      lines.push('');
    });

    const completedSteps = task.steps.filter((s) => s.status === 'completed').length;
    const failedSteps = task.steps.filter((s) => s.status === 'failed').length;
    lines.push(`───────────────────────────────────────`);
    lines.push(`  执行统计`);
    lines.push(`───────────────────────────────────────`);
    lines.push(`总步骤数: ${task.steps.length}`);
    lines.push(`已完成: ${completedSteps}`);
    lines.push(`失败: ${failedSteps}`);
    lines.push(`完成率: ${task.steps.length > 0 ? Math.round((completedSteps / task.steps.length) * 100) : 0}%`);
    lines.push('');
    lines.push(`═══════════════════════════════════════`);

    const fullText = lines.join('\n');
    let i = 0;
    const interval = setInterval(() => {
      i += 3;
      if (i >= fullText.length) {
        setReportContent(fullText);
        setReportGenerating(false);
        clearInterval(interval);
      } else {
        setReportContent(fullText.slice(0, i));
      }
    }, 10);
  };

  const downloadReport = () => {
    if (!reportTask || !reportContent) return;
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `巡检报告-${reportTask.task_name}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateTask = () => {
    if (!newTaskName || !newDevice || !newMap) return;
    const mapData = maps.find((m) => m.map_id === newMap);
    const deviceData = devices.find((d) => d.device_id === newDevice);

    let periodInterval: number | undefined;
    if (newExecutionType === 'periodic') {
      if (newPeriodType === 'hours') periodInterval = newPeriodHours;
      else if (newPeriodType === 'daily') periodInterval = -1; // sentinel for daily
    }

    const newTask: Task = {
      task_id: `task-${String(taskList.length + 1).padStart(3, '0')}-${newTaskName.slice(0, 2)}`,
      task_name: newTaskName,
      task_type: 'patrol',
      map_id: newMap,
      map_name: mapData?.map_name || '',
      device_id: newDevice,
      device_name: deviceData?.device_name || '',
      status: 'pending',
      schedule_type: newExecutionType === 'periodic' ? 'periodic' : 'immediate',
      period_interval: periodInterval,
      scheduled_time: null,
      navigation_mode: newNavMode,
      completion_action: newCompletionAction,
      created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
      started_at: null,
      completed_at: null,
      steps: newRouteType === 'points'
        ? newSelectedPoints.map((pid, idx) => {
            const pt = mapData?.points.find((p) => p.point_id === pid);
            return {
              step_id: `s-${idx + 1}`,
              point_name: pt?.point_name || pid,
              point_type: pt?.point_type || 'patrol',
              status: 'pending' as const,
              started_at: null,
              completed_at: null,
              algorithm_name: null,
              action: '拍照+巡检',
              arm_photos: [],
            };
          })
        : (() => {
            const line = mapData?.lines.find((l) => l.line_id === newSelectedLine);
            return (line?.point_ids || []).map((pid, idx) => {
              const pt = mapData?.points.find((p) => p.point_id === pid);
              return {
                step_id: `s-${idx + 1}`,
                point_name: pt?.point_name || pid,
                point_type: pt?.point_type || 'patrol',
                status: 'pending' as const,
                started_at: null,
                completed_at: null,
                algorithm_name: null,
                action: '拍照+巡检',
                arm_photos: [],
              };
            });
          })(),
      progress: 0,
      report_generated: false,
    };
    setTaskList((prev) => [...prev, newTask]);
    setCreateDialogOpen(false);
    resetCreateForm();
  };

  const resetCreateForm = () => {
    setNewDevice('');
    setNewMap('');
    setNewTaskName('');
    setNewRouteType('points');
    setNewSelectedPoints([]);
    setNewSelectedLine('');
    setNewExecutionType('immediate');
    setNewPeriodType('hours');
    setNewPeriodHours(2);
    setNewDailyHour(8);
    setNewDailyMinute(0);
    setNewCustomDate('');
    setNewCustomTime('08:00');
    setNewNavMode('autonomous');
    setNewCompletionAction('wait_in_place');
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">任务管理</h1>
          <p className="text-sm text-muted-foreground mt-1">管理巡检、监测任务的创建、执行与报告</p>
        </div>
        <Button className="gap-2" onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          新建任务
        </Button>
      </div>

      {/* 任务统计卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">执行中</p>
              <p className="text-2xl font-bold text-blue-600">{taskList.filter((t) => t.status === 'in_progress').length}</p>
            </div>
            <div className="p-2 rounded-lg bg-blue-50"><Play className="h-5 w-5 text-blue-600" /></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">待执行</p>
              <p className="text-2xl font-bold text-gray-600">{taskList.filter((t) => t.status === 'pending').length}</p>
            </div>
            <div className="p-2 rounded-lg bg-gray-50"><Clock className="h-5 w-5 text-gray-600" /></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">已完成</p>
              <p className="text-2xl font-bold text-green-600">{taskList.filter((t) => t.status === 'completed').length}</p>
            </div>
            <div className="p-2 rounded-lg bg-green-50"><CheckCircle2 className="h-5 w-5 text-green-600" /></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">失败</p>
              <p className="text-2xl font-bold text-red-600">{taskList.filter((t) => t.status === 'failed').length}</p>
            </div>
            <div className="p-2 rounded-lg bg-red-50"><AlertTriangle className="h-5 w-5 text-red-600" /></div>
          </div>
        </Card>
      </div>

      {/* 搜索与筛选 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜索任务名称或ID..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="任务状态" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部状态</SelectItem>
                <SelectItem value="in_progress">执行中</SelectItem>
                <SelectItem value="pending">待执行</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="paused">已暂停</SelectItem>
                <SelectItem value="failed">失败</SelectItem>
                <SelectItem value="cancelled">已取消</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[130px]"><SelectValue placeholder="任务类型" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部类型</SelectItem>
                <SelectItem value="patrol">日常巡检</SelectItem>
                <SelectItem value="inspection">专项检测</SelectItem>
                <SelectItem value="monitoring">实时监控</SelectItem>
                <SelectItem value="emergency">紧急任务</SelectItem>
              </SelectContent>
            </Select>
            <Select value={mapFilter} onValueChange={setMapFilter}>
              <SelectTrigger className="w-[150px]"><SelectValue placeholder="地图名称" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部地图</SelectItem>
                {taskMapNames.map(name => <SelectItem key={name} value={name}>{name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 任务列表 */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const isPaused = pausedTasks[task.task_id];
          return (
            <Card
              key={task.task_id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedTask(task)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-medium">{task.task_name}</h3>
                      <Badge className={`text-xs ${taskStatusBadge[task.status]}`}>
                        {statusLabels[task.status]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">{taskTypeLabels[task.task_type]}</Badge>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span>任务ID: {task.task_id}</span><span>|</span>
                      <span>设备: {task.device_name}</span><span>|</span>
                      <span>地图: {task.map_name}</span><span>|</span>
                      <span>{scheduleTypeLabels[task.schedule_type]}</span>
                      {task.navigation_mode && <><span>|</span><span>{task.navigation_mode === 'linear' ? '直线导航' : '自主导航'}</span></>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {task.status === 'in_progress' && (
                      <>
                        <Button variant="outline" size="sm" className="gap-1 h-8" onClick={(e) => handleTogglePause(task.task_id, e)}>
                          {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
                          {isPaused ? '继续' : '暂停'}
                        </Button>
                        <Button variant="destructive" size="sm" className="gap-1 h-8" onClick={(e) => { e.stopPropagation(); setCancelTask(task); setCancelDialogOpen(true); }}>
                          <XCircle className="h-3.5 w-3.5" />取消
                        </Button>
                      </>
                    )}
                    {task.status === 'pending' && (
                      <>
                        <Button size="sm" className="gap-1 h-8" onClick={(e) => handleExecute(task, e)}>
                          <Play className="h-3.5 w-3.5" />立即执行
                        </Button>
                        <Button variant="outline" size="sm" className="gap-1 h-8" onClick={(e) => { e.stopPropagation(); setCancelTask(task); setCancelDialogOpen(true); }}>
                          <XCircle className="h-3.5 w-3.5" />取消
                        </Button>
                      </>
                    )}
                    {task.status === 'completed' && (
                      <Button variant="outline" size="sm" className="gap-1 h-8" onClick={(e) => { e.stopPropagation(); generateReport(task); }}>
                        <FileText className="h-3.5 w-3.5" />报告
                      </Button>
                    )}
                    {/* More button */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => handleReExecute(task, e)}>
                          <RotateCcw className="h-4 w-4 mr-2" />再次执行
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={(e) => { e.stopPropagation(); setDeleteTask(task); setDeleteDialogOpen(true); }}>
                          <Trash2 className="h-4 w-4 mr-2" />删除任务
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {task.status === 'in_progress' && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">执行进度</span>
                      <span className="font-medium">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>
                )}
                {task.steps.length > 0 && (
                  <div className="flex items-center gap-1 mt-3">
                    {task.steps.map((step, idx) => (
                      <div key={step.step_id} className="flex items-center">
                        <div className={`h-2 rounded-full ${step.status === 'completed' ? 'bg-green-500 w-8' : step.status === 'in_progress' ? 'bg-blue-500 w-8 animate-pulse' : step.status === 'failed' ? 'bg-red-500 w-8' : 'bg-gray-200 w-8'}`} title={`${step.point_name} - ${statusLabels[step.status]}`} />
                        {idx < task.steps.length - 1 && <div className={`h-0.5 w-2 ${step.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'}`} />}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 任务详情弹窗 */}
      <Dialog open={!!selectedTask} onOpenChange={() => setSelectedTask(null)}>
        <DialogContent className="max-w-3xl">
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-blue-600" />
                  {selectedTask.task_name}
                </DialogTitle>
                <DialogDescription>{selectedTask.task_id} | {taskTypeLabels[selectedTask.task_type]}</DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="steps" className="mt-2">
                <TabsList>
                  <TabsTrigger value="steps">执行步骤</TabsTrigger>
                  <TabsTrigger value="info">任务信息</TabsTrigger>
                  <TabsTrigger value="control">控制操作</TabsTrigger>
                </TabsList>

                <TabsContent value="steps" className="mt-4">
                  <div className="space-y-3">
                    {selectedTask.steps.map((step, idx) => {
                      const StepIcon = stepStatusIcon[step.status];
                      const photos = step.arm_photos && step.arm_photos.length > 0 ? step.arm_photos : (step.status === 'completed' ? placeholderPhotos.slice(0, 2) : []);
                      return (
                        <div key={step.step_id} className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <StepIcon className={`h-5 w-5 ${stepStatusColor[step.status]} ${step.status === 'in_progress' ? 'animate-spin' : ''}`} />
                            {idx < selectedTask.steps.length - 1 && <div className="w-0.5 h-10 bg-gray-200 mt-1" />}
                          </div>
                          <div className="flex-1 pb-2">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">{step.point_name}</p>
                              <Badge className={`text-xs ${taskStatusBadge[step.status] || 'bg-gray-100 text-gray-500'}`}>
                                {step.status === 'pending' ? '待执行' : statusLabels[step.status]}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                              <span>{step.action}</span>
                              {step.algorithm_name && <><span>|</span><span>{step.algorithm_name}</span></>}
                            </div>
                            {/* Arm pose photos */}
                            {photos.length > 0 && (
                              <div className="flex gap-2 mt-2">
                                {photos.map((photo, pi) => (
                                  <div
                                    key={pi}
                                    className="w-16 h-12 rounded border bg-slate-100 overflow-hidden cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setPreviewPhotos(photos);
                                      setPreviewPhotoIndex(pi);
                                      setPhotoPreviewOpen(true);
                                    }}
                                  >
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                      <ImageIcon className="h-4 w-4" />
                                    </div>
                                  </div>
                                ))}
                                <button
                                  className="w-16 h-12 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-blue-400 hover:text-blue-400 transition-colors text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setPreviewPhotos(photos);
                                    setPreviewPhotoIndex(0);
                                    setPhotoPreviewOpen(true);
                                  }}
                                >
                                  预览
                                </button>
                              </div>
                            )}
                            {step.started_at && (
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <span>开始: {step.started_at}</span>
                                {step.completed_at && <span>完成: {step.completed_at}</span>}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                <TabsContent value="info" className="space-y-3 mt-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">任务类型</span><span>{taskTypeLabels[selectedTask.task_type]}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">执行方式</span><span>{scheduleTypeLabels[selectedTask.schedule_type]}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">执行设备</span><span>{selectedTask.device_name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">关联地图</span><span>{selectedTask.map_name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">导航模式</span><span>{selectedTask.navigation_mode === 'linear' ? '直线导航' : '自主导航'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">完成动作</span><span>{selectedTask.completion_action === 'return_charger' ? '返回充电桩' : '原地等待'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">创建时间</span><span>{selectedTask.created_at}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">开始时间</span><span>{selectedTask.started_at || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">完成时间</span><span>{selectedTask.completed_at || '-'}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">报告生成</span><span>{selectedTask.report_generated ? '是' : '否'}</span></div>
                  </div>
                  <Separator />
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">执行进度</p>
                    <div className="flex items-center gap-3">
                      <Progress value={selectedTask.progress} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{selectedTask.progress}%</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="control" className="mt-4">
                  <div className="flex gap-4 min-h-[350px]">
                    {/* 左侧：实时监控 */}
                    <div className="flex-1 flex flex-col gap-3">
                      <Card className="flex-1 p-4 flex flex-col">
                        <p className="text-sm font-medium mb-3 flex items-center gap-2"><Video className="h-4 w-4 text-blue-500" />实时视频画面</p>
                        <div className="flex-1 bg-slate-900 rounded-lg flex items-center justify-center">
                          <div className="text-center text-slate-500"><Video className="h-10 w-10 mx-auto mb-2 opacity-50" /><p className="text-xs">实时视频预览区域</p></div>
                        </div>
                      </Card>
                      <Card className="flex-1 p-4 flex flex-col">
                        <p className="text-sm font-medium mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-green-500" />地图追踪</p>
                        <div className="flex-1 bg-slate-50 rounded-lg flex items-center justify-center border">
                          <div className="text-center text-slate-400"><Map className="h-10 w-10 mx-auto mb-2 opacity-50" /><p className="text-xs">地图实时位置追踪</p></div>
                        </div>
                      </Card>
                    </div>

                    {/* 右侧：任务控制 */}
                    <div className="w-64 flex flex-col gap-3">
                      <Card className="p-4">
                        <p className="text-sm font-medium mb-3">任务控制</p>
                        <div className="space-y-2">
                          {selectedTask.status === 'in_progress' && (
                            <>
                              <Button variant="outline" className="gap-2 w-full" onClick={() => { const isPaused = pausedTasks[selectedTask.task_id]; setPausedTasks((prev) => ({ ...prev, [selectedTask.task_id]: !isPaused })); }}>
                                {pausedTasks[selectedTask.task_id] ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                                {pausedTasks[selectedTask.task_id] ? '继续执行' : '暂停任务'}
                              </Button>
                              <Button variant="destructive" className="gap-2 w-full" onClick={() => { setCancelTask(selectedTask); setCancelDialogOpen(true); }}>
                                <XCircle className="h-4 w-4" />取消任务
                              </Button>
                            </>
                          )}
                          {selectedTask.status === 'paused' && (
                            <>
                              <Button className="gap-2 w-full" onClick={() => setPausedTasks((prev) => ({ ...prev, [selectedTask.task_id]: false }))}>
                                <Play className="h-4 w-4" /> 继续执行
                              </Button>
                              <Button variant="destructive" className="gap-2 w-full" onClick={() => { setCancelTask(selectedTask); setCancelDialogOpen(true); }}>
                                <XCircle className="h-4 w-4" /> 取消任务
                              </Button>
                            </>
                          )}
                          {selectedTask.status === 'pending' && (
                            <>
                              <Button className="gap-2 w-full" onClick={() => { setExecuteTask(selectedTask); setExecuteDialogOpen(true); }}>
                                <Play className="h-4 w-4" /> 立即执行
                              </Button>
                              <Button variant="destructive" className="gap-2 w-full" onClick={() => { setCancelTask(selectedTask); setCancelDialogOpen(true); }}>
                                <XCircle className="h-4 w-4" /> 取消任务
                              </Button>
                            </>
                          )}
                          {selectedTask.status === 'completed' && (
                            <div className="text-center py-2">
                              <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground mb-3">任务已完成</p>
                              <Button variant="outline" className="gap-2 w-full" onClick={() => generateReport(selectedTask)}>
                                <FileText className="h-4 w-4" /> 查看报告
                              </Button>
                            </div>
                          )}
                          {selectedTask.status === 'cancelled' && (
                            <div className="text-center py-2">
                              <XCircle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">任务已取消</p>
                            </div>
                          )}
                          {selectedTask.status === 'failed' && (
                            <div className="text-center py-2">
                              <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">任务执行失败</p>
                            </div>
                          )}
                        </div>
                      </Card>
                      <Card className="p-4">
                        <p className="text-sm font-medium mb-2">设备状态</p>
                        <div className="space-y-2 text-xs">
                          <div className="flex justify-between"><span className="text-muted-foreground">设备</span><span>{selectedTask.device_name}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">地图</span><span>{selectedTask.map_name}</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">进度</span><span>{selectedTask.progress}%</span></div>
                          <div className="flex justify-between"><span className="text-muted-foreground">导航</span><span>{selectedTask.navigation_mode === 'linear' ? '直线导航' : '自主导航'}</span></div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 报告弹窗 */}
      <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-blue-600" />巡检报告</DialogTitle>
            <DialogDescription>{reportTask?.task_name}</DialogDescription>
          </DialogHeader>
          <div className="bg-slate-50 rounded-lg p-4 max-h-[400px] overflow-y-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap text-slate-700">{reportContent}</pre>
            {reportGenerating && <span className="animate-pulse text-blue-500">▌</span>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>关闭</Button>
            <Button className="gap-2" onClick={downloadReport} disabled={reportGenerating || !reportContent}><Download className="h-4 w-4" />导出报告</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 立即执行确认弹窗 */}
      <Dialog open={executeDialogOpen} onOpenChange={setExecuteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>执行确认</DialogTitle>
            <DialogDescription>确定要立即执行任务「{executeTask?.task_name}」吗？</DialogDescription>
          </DialogHeader>
          <div className="py-2 text-sm text-muted-foreground">
            <p>执行设备: {executeTask?.device_name}</p>
            <p>关联地图: {executeTask?.map_name}</p>
            <p>执行步骤: {executeTask?.steps.length} 个</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setExecuteDialogOpen(false)}>取消</Button>
            <Button className="gap-2" onClick={() => {
              if (executeTask) {
                setTaskList((prev) => prev.map((t) => t.task_id === executeTask.task_id ? { ...t, status: 'in_progress' as const, started_at: new Date().toISOString().replace('T', ' ').slice(0, 19) } : t));
              }
              setExecuteDialogOpen(false);
            }}>
              <Play className="h-4 w-4" />确认执行
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 取消确认弹窗 */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>确认取消</DialogTitle>
            <DialogDescription>确定要取消任务「{cancelTask?.task_name}」吗？此操作不可撤销。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>返回</Button>
            <Button variant="destructive" onClick={handleCancelTask}>确认取消</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除确认弹窗 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>确定要删除任务「{deleteTask?.task_name}」吗？此操作不可撤销。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteTask} className="bg-destructive text-destructive-foreground">删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Re-execute confirmation */}
      <AlertDialog open={!!reExecuteTask} onOpenChange={(open: boolean) => { if (!open) setReExecuteTask(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认再次执行</AlertDialogTitle>
            <AlertDialogDescription>确定要再次执行任务「{reExecuteTask?.task_name}」吗？将创建一个新的相同任务并开始执行。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReExecute}>确认执行</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 照片预览弹窗 */}
      <Dialog open={photoPreviewOpen} onOpenChange={setPhotoPreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>机械臂姿态照片</DialogTitle>
            <DialogDescription>照片 {previewPhotoIndex + 1} / {previewPhotos.length}</DialogDescription>
          </DialogHeader>
          <div className="bg-slate-900 rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center text-slate-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p className="text-xs">机械臂姿态照片预览</p>
              <p className="text-[10px] mt-1">照片 {previewPhotoIndex + 1}</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            <Button variant="outline" size="sm" disabled={previewPhotoIndex === 0} onClick={() => setPreviewPhotoIndex(i => i - 1)}>上一张</Button>
            <span className="text-xs text-muted-foreground">{previewPhotoIndex + 1} / {previewPhotos.length}</span>
            <Button variant="outline" size="sm" disabled={previewPhotoIndex >= previewPhotos.length - 1} onClick={() => setPreviewPhotoIndex(i => i + 1)}>下一张</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 新建任务弹窗 */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>新建任务</DialogTitle>
            <DialogDescription>选择设备、关联地图和路线来创建新任务</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
            <div className="space-y-2">
              <p className="text-sm font-medium">任务名称 <span className="text-red-500">*</span></p>
              <Input value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} placeholder="请输入任务名称" />
            </div>

            {/* Navigation mode */}
            <div className="space-y-2">
              <p className="text-sm font-medium">导航模式</p>
              <div className="flex gap-2">
                <Button variant={newNavMode === 'autonomous' ? 'default' : 'outline'} size="sm" onClick={() => setNewNavMode('autonomous')}>
                  <Navigation className="h-3 w-3 mr-1" /> 自主导航
                </Button>
                <Button variant={newNavMode === 'linear' ? 'default' : 'outline'} size="sm" onClick={() => setNewNavMode('linear')}>
                  直线导航
                </Button>
              </div>
            </div>

            {/* Completion action */}
            <div className="space-y-2">
              <p className="text-sm font-medium">完成动作</p>
              <div className="flex gap-2">
                <Button variant={newCompletionAction === 'wait_in_place' ? 'default' : 'outline'} size="sm" onClick={() => setNewCompletionAction('wait_in_place')}>
                  原地等待
                </Button>
                <Button variant={newCompletionAction === 'return_charger' ? 'default' : 'outline'} size="sm" onClick={() => setNewCompletionAction('return_charger')}>
                  <Home className="h-3 w-3 mr-1" /> 返回充电桩
                </Button>
              </div>
            </div>

            {/* Execution type */}
            <div className="space-y-2">
              <p className="text-sm font-medium">执行方式 <span className="text-red-500">*</span></p>
              <div className="flex gap-2">
                <Button variant={newExecutionType === 'immediate' ? 'default' : 'outline'} size="sm" onClick={() => setNewExecutionType('immediate')}>立即执行</Button>
                <Button variant={newExecutionType === 'periodic' ? 'default' : 'outline'} size="sm" onClick={() => setNewExecutionType('periodic')}>周期执行</Button>
              </div>
            </div>

            {/* Periodic options */}
            {newExecutionType === 'periodic' && (
              <div className="space-y-3">
                <p className="text-sm font-medium">执行周期 <span className="text-red-500">*</span></p>
                <div className="flex gap-2 items-center flex-wrap">
                  <Button variant={newPeriodType === 'hours' ? 'default' : 'outline'} size="sm" onClick={() => setNewPeriodType('hours')}>每X小时</Button>
                  <Button variant={newPeriodType === 'daily' ? 'default' : 'outline'} size="sm" onClick={() => setNewPeriodType('daily')}>每日</Button>
                  <Button variant={newPeriodType === 'custom_date' ? 'default' : 'outline'} size="sm" onClick={() => setNewPeriodType('custom_date')}>自选日期时间</Button>
                </div>
                {newPeriodType === 'hours' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">每</span>
                    <Input type="number" min={1} max={720} value={newPeriodHours} onChange={(e) => setNewPeriodHours(Number(e.target.value) || 1)} className="w-20" />
                    <span className="text-sm text-muted-foreground">小时执行一次</span>
                  </div>
                )}
                {newPeriodType === 'daily' && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">每日</span>
                    <Input type="number" min={0} max={23} value={newDailyHour} onChange={(e) => setNewDailyHour(Number(e.target.value) || 0)} className="w-16" />
                    <span className="text-sm text-muted-foreground">时</span>
                    <Input type="number" min={0} max={59} value={newDailyMinute} onChange={(e) => setNewDailyMinute(Number(e.target.value) || 0)} className="w-16" />
                    <span className="text-sm text-muted-foreground">分执行</span>
                  </div>
                )}
                {newPeriodType === 'custom_date' && (
                  <div className="flex items-center gap-2">
                    <Input type="date" value={newCustomDate} onChange={(e) => setNewCustomDate(e.target.value)} className="w-36" />
                    <Input type="time" value={newCustomTime} onChange={(e) => setNewCustomTime(e.target.value)} className="w-28" />
                  </div>
                )}
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">执行设备 <span className="text-red-500">*</span></p>
              <Select value={newDevice} onValueChange={setNewDevice}>
                <SelectTrigger><SelectValue placeholder="选择机器狗设备" /></SelectTrigger>
                <SelectContent>
                  {devices.filter((d) => d.device_type === 'robot_dog' && d.status !== 'offline' && d.status !== 'fault').map((d) => (
                    <SelectItem key={d.device_id} value={d.device_id}>{d.device_name} ({d.device_code}) - {statusLabels[d.status]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">关联地图 <span className="text-red-500">*</span></p>
              <Select value={newMap} onValueChange={(v) => { setNewMap(v); setNewSelectedPoints([]); setNewSelectedLine(''); }}>
                <SelectTrigger><SelectValue placeholder="选择关联地图" /></SelectTrigger>
                <SelectContent>
                  {maps.filter((m) => m.map_status === 'active').map((m) => (
                    <SelectItem key={m.map_id} value={m.map_id}>
                      {m.map_name} ({m.points.length}点位 / {m.lines.length}线路)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {/* Map preview */}
              {selectedMapData && (
                <div className="border rounded-lg p-2 bg-slate-50">
                  <p className="text-xs text-muted-foreground mb-1">地图预览</p>
                  <svg viewBox="0 0 500 300" className="w-full h-32 bg-white rounded border">
                    {selectedMapData.areas.map((area) => (
                      <polygon
                        key={area.area_id}
                        points={area.vertices.map((c: {x: number; y: number}) => `${c.x * 5},${c.y * 3}`).join(' ')}
                        fill={area.area_type === 'restricted' ? 'rgba(239,68,68,0.1)' : area.area_type === 'forbidden' ? 'rgba(239,68,68,0.2)' : 'rgba(59,130,246,0.05)'}
                        stroke={area.area_type === 'restricted' ? '#ef4444' : area.area_type === 'forbidden' ? '#dc2626' : '#3b82f6'}
                        strokeWidth="1"
                        strokeDasharray={area.area_type === 'forbidden' ? '4,2' : undefined}
                      />
                    ))}
                    {selectedMapData.lines.map((line) => {
                      const pts = line.point_ids.map((pid: string) => selectedMapData.points.find((p) => p.point_id === pid)).filter(Boolean);
                      if (pts.length < 2) return null;
                      return (
                        <polyline
                          key={line.line_id}
                          points={pts.map((p) => `${p!.x * 5},${p!.y * 3}`).join(' ')}
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="1.5"
                          strokeDasharray="4,2"
                        />
                      );
                    })}
                    {selectedMapData.points.map((pt) => {
                      const isSelected = newSelectedPoints.includes(pt.point_id);
                      return (
                        <g key={pt.point_id}>
                          <circle cx={pt.x * 5} cy={pt.y * 3} r={isSelected ? 5 : 4} fill={pt.point_type === 'charging' ? '#22c55e' : isSelected ? '#3b82f6' : '#64748b'} stroke="#fff" strokeWidth="1" />
                          {pt.yaw !== undefined && pt.yaw !== 0 && (
                            <line x1={pt.x * 5} y1={pt.y * 3} x2={pt.x * 5 + Math.sin((pt.yaw * Math.PI) / 180) * 10} y2={pt.y * 3 - Math.cos((pt.yaw * Math.PI) / 180) * 10} stroke={pt.point_type === 'charging' ? '#22c55e' : '#64748b'} strokeWidth="1.5" markerEnd="url(#arrowhead)" />
                          )}
                          <text x={pt.x * 5} y={pt.y * 3 + 12} textAnchor="middle" fontSize="6" fill="#64748b">{pt.point_name}</text>
                        </g>
                      );
                    })}
                    <defs>
                      <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto"><polygon points="0 0, 6 2, 0 4" fill="#64748b" /></marker>
                    </defs>
                  </svg>
                </div>
              )}
            </div>

            {/* Route type */}
            <div className="space-y-2">
              <p className="text-sm font-medium">路线方式</p>
              <div className="flex gap-2">
                <Button variant={newRouteType === 'points' ? 'default' : 'outline'} size="sm" onClick={() => setNewRouteType('points')}>选择点位</Button>
                <Button variant={newRouteType === 'path' ? 'default' : 'outline'} size="sm" onClick={() => setNewRouteType('path')}>选择路径</Button>
              </div>
            </div>

            {/* Show map points/paths after selecting map */}
            {newRouteType === 'points' && selectedMapData && (
              <div className="space-y-2">
                <p className="text-sm font-medium">地图点位 <span className="text-xs text-muted-foreground">(可多选)</span></p>
                <div className="space-y-1.5 max-h-[150px] overflow-y-auto border rounded-lg p-2">
                  {selectedMapData.points.map((pt) => (
                    <label key={pt.point_id} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer text-sm">
                      <input
                        type="checkbox"
                        checked={newSelectedPoints.includes(pt.point_id)}
                        onChange={(e) => {
                          if (e.target.checked) setNewSelectedPoints((prev) => [...prev, pt.point_id]);
                          else setNewSelectedPoints((prev) => prev.filter((id) => id !== pt.point_id));
                        }}
                        className="rounded"
                      />
                      <span>{pt.point_name}</span>
                      <Badge variant="outline" className="text-[10px] py-0 ml-auto">{pointTypeLabels[pt.point_type] || pt.point_type}</Badge>
                    </label>
                  ))}
                  {selectedMapData.points.length === 0 && <p className="text-xs text-muted-foreground text-center py-2">该地图暂无点位</p>}
                </div>
              </div>
            )}
            {newRouteType === 'path' && selectedMapData && (
              <div className="space-y-2">
                <p className="text-sm font-medium">地图路径</p>
                <Select value={newSelectedLine} onValueChange={setNewSelectedLine}>
                  <SelectTrigger><SelectValue placeholder="选择巡检路线" /></SelectTrigger>
                  <SelectContent>
                    {selectedMapData.lines.map((line) => (
                      <SelectItem key={line.line_id} value={line.line_id}>
                        {line.line_name} ({line.point_ids.length} 个点位)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {/* Show line point details */}
                {newSelectedLine && (() => {
                  const line = selectedMapData.lines.find(l => l.line_id === newSelectedLine);
                  if (!line) return null;
                  return (
                    <div className="border rounded p-2 space-y-1">
                      <p className="text-xs text-muted-foreground">路线包含点位：</p>
                      {line.point_ids.map((pid, i) => {
                        const pt = selectedMapData.points.find(p => p.point_id === pid);
                        return (
                          <div key={pid} className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground w-4">{i + 1}.</span>
                            <span>{pt?.point_name || pid}</span>
                            {pt && <Badge variant="outline" className="text-[9px] py-0">{pointTypeLabels[pt.point_type] || pt.point_type}</Badge>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setCreateDialogOpen(false); resetCreateForm(); }}>取消</Button>
            <Button onClick={handleCreateTask} disabled={!newTaskName || !newDevice || !newMap}>创建任务</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
