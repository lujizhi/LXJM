'use client';

import Image from 'next/image';

const DASHBOARD_IMAGE_URL =
  'https://code.coze.cn/api/sandbox/coze_coding/file/proxy?expire_time=-1&file_path=assets%2F%E6%95%B0%E6%8D%AE%E7%9C%8B%E6%9D%BF.png&nonce=7efbc8d2-4115-4af9-a78e-76aae1f453a5&project_id=7633343045928501298&sign=8495a6ccbae99d5295947ed7f16cdb1e684a0a7f255d352b8832e068d71f4402';

export default function DashboardPage() {
  return (
    <div className="-m-6 relative w-[calc(100%+3rem)] h-[calc(100%+3rem)] bg-slate-950">
      <Image
        src={DASHBOARD_IMAGE_URL}
        alt="数据看板"
        fill
        className="object-contain"
        priority
        unoptimized
      />
    </div>
  );
}
