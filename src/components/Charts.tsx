import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const barData = [
  { name: 'Jun', value: 10 },
  { name: 'Jul', value: 25 },
  { name: 'Agu', value: 18 },
  { name: 'Sep', value: 15 },
  { name: 'Okt', value: 5 },
  { name: 'Nov', value: 8 },
];

const pieData = [
  { name: 'Technical', value: 45, color: '#1e3a5f' },
  { name: 'Safety', value: 30, color: '#e67e22' },
  { name: 'Soft Skills', value: 15, color: '#1abc9c' },
  { name: 'Compliance', value: 10, color: '#bdc3c7' },
];

export function ActivityBarChart({ data }: { data?: any[] }) {
  const defaultData = [
    { name: 'Jun', value: 0 },
    { name: 'Jul', value: 0 },
    { name: 'Agu', value: 0 },
    { name: 'Sep', value: 0 },
    { name: 'Okt', value: 0 },
    { name: 'Nov', value: 0 },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px]">
      <h3 className="text-base font-bold text-slate-800 mb-6 font-sans">Jumlah Sertifikat Karyawan</h3>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data || defaultData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Bar dataKey="value" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DistributionPieChart({ data }: { data?: any[] }) {
  const defaultData = [
    { name: 'Technical', value: 0, color: '#1e3a5f' },
    { name: 'Safety', value: 0, color: '#e67e22' },
    { name: 'Soft Skills', value: 0, color: '#1abc9c' },
    { name: 'Compliance', value: 0, color: '#bdc3c7' },
  ];

  const chartData = data || defaultData;
  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-[400px] relative">
      <h3 className="text-base font-bold text-slate-800 mb-6 font-sans">Distribusi Sertifikat berdasarkan Kategori</h3>
      <ResponsiveContainer width="100%" height="80%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={0}
            dataKey="value"
          >
            {chartData.map((entry: any, index: number) => (
              <Cell key={`cell-${index}`} fill={entry.color || ['#1e3a5f', '#e67e22', '#1abc9c', '#bdc3c7'][index % 4]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            formatter={(value) => <span className="text-sm font-medium text-slate-600 ml-2">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-4">
        <span className="block text-2xl font-bold text-slate-800">{total}</span>
        <span className="block text-xs font-medium text-slate-400">Total</span>
      </div>
    </div>
  );
}
