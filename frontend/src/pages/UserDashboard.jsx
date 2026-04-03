import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

const UserDashboard = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="User Dashboard"
          subtitle="Track your habits and stay consistent every day."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Habits</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">0</h2>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Completed Today</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">0</h2>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Current Streak</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">0</h2>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Completion Rate</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">0%</h2>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Quick Overview</h3>
          <p className="mt-2 text-slate-500">
            Your recent habits and progress summary will be added in the next step.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;