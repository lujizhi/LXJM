"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, User } from "lucide-react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const {
        login
    } = useAuth();

    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !password.trim()) {
            setError("请输入账号和密码");
            return;
        }

        setLoading(true);

        setTimeout(() => {
            const success = login(username, password);

            if (success) {
                router.push("/");
            } else {
                setError("账号或密码错误");
            }

            setLoading(false);
        }, 500);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center">
            {}
            <Image
                src="https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E7%99%BB%E5%BD%95%E9%A1%B5%E8%83%8C%E6%99%AF.png&nonce=acc66cb4-bbb4-4577-978c-eb4b656d6405&project_id=7633343045928501298&sign=bb3c76f8ae17cfb0db95ca872e89e39b7d4b5981b35cf3f1a00cee4c823eaa28"
                alt="背景"
                fill
                className="object-cover"
                priority />
            {}
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative w-full max-w-md px-6">
                {}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-600/30">
                        <CpuIcon className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-1">LXJM</h1>
                    <p className="text-blue-300/70 text-sm">具身智能机器狗巡检平台</p>
                </div>
                {}
                <div
                    className="bg-white/[0.07] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-lg font-semibold text-white mb-6">账号登录</h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {}
                        <div className="space-y-2">
                            <label className="text-sm text-slate-300 font-medium">账号</label>
                            <div className="relative">
                                <User
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    value={username}
                                    onChange={e => setUsername(e.target.value)}
                                    placeholder="请输入账号"
                                    className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20" />
                            </div>
                        </div>
                        {}
                        <div className="space-y-2">
                            <label className="text-sm text-slate-300 font-medium">密码</label>
                            <div className="relative">
                                <Lock
                                    className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="请输入密码"
                                    className="pl-10 pr-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300">
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>
                        {}
                        {error && <div
                            className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                            {error}
                        </div>}
                        {}
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg shadow-blue-600/30">
                            {loading ? "登录中..." : "登 录"}
                        </Button>
                    </form>
                </div>
                {}
                <p className="text-center text-slate-500 text-xs mt-6">© 2025 LXJM · 具身智能机器狗巡检平台
                            </p>
            </div>
        </div>
    );
}

function CpuIcon(
    {
        className
    }: {
        className?: string;
    }
) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" />
            <path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" />
        </svg>
    );
}