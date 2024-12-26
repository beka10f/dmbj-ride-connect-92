import { Card } from "@/components/ui/card";

const Admin = () => {
  const metrics = [
    { title: "Total Drivers", value: "25", change: "+3 this month" },
    { title: "Pending Applications", value: "8", change: "5 new this week" },
    { title: "Ride Requests", value: "150", change: "+15% vs last month" },
    { title: "Completed Rides", value: "1,234", change: "+8% this month" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8 text-primary">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <Card key={metric.title} className="p-6">
            <h3 className="text-lg font-medium text-gray-600">{metric.title}</h3>
            <p className="text-3xl font-bold text-primary mt-2">{metric.value}</p>
            <p className="text-sm text-gray-500 mt-2">{metric.change}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Admin;