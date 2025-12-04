'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Stats {
  users: number;
  posts: number;
  premiumPosts: number;
  orders: number;
  revenue: number;
  totalWallet: number;
  codes: number;
  codeUsages: number;
}

interface PostByDate {
  date: string;
  count: number;
}

interface TopUser {
  name: string;
  posts: number;
  wallet: number;
  purchased: number;
}

interface Props {
  stats: Stats;
  postsByDate: PostByDate[];
  topUsers: TopUser[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AnalyticsClient({ stats, postsByDate, topUsers }: Props) {
  const pieData = [
    { name: 'Bài miễn phí', value: stats.posts - stats.premiumPosts },
    { name: 'Bài Premium', value: stats.premiumPosts },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Phân tích hệ thống</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Stat title="Người dùng" value={stats.users} />
        <Stat title="Tổng bài viết" value={stats.posts} />
        <Stat title="Bài viết Premium" value={stats.premiumPosts} />
        <Stat title="Đơn hàng" value={stats.orders} />
        <Stat title="Doanh thu" value={`${stats.revenue.toLocaleString()}đ`} />
        <Stat title="Tổng số dư ví" value={`${stats.totalWallet.toLocaleString()}đ`} />
        <Stat title="Mã Redeem" value={stats.codes} />
        <Stat title="Lượt dùng mã" value={stats.codeUsages} />
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Biểu đồ bài viết theo ngày */}
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-lg font-semibold mb-4">Bài viết 30 ngày gần đây</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={postsByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} name="Số bài viết" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Biểu đồ phân loại bài viết */}
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-lg font-semibold mb-4">Phân loại bài viết</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry: any) => `${entry.name}: ${(entry.percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 người dùng */}
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-lg font-semibold mb-4">Top 5 người dùng (theo số bài viết)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topUsers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="posts" fill="#8884d8" name="Số bài viết" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ví và Mua hàng */}
        <div className="rounded-lg border bg-card p-4">
          <h2 className="text-lg font-semibold mb-4">Số dư ví & Đã mua (Top 5)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topUsers}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="wallet" fill="#00C49F" name="Số dư ví" />
              <Bar dataKey="purchased" fill="#FF8042" name="Đã mua" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: number | string }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
