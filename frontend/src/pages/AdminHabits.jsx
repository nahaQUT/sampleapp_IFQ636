import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

const AdminHabits = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Habit Monitoring"
          subtitle="View all habits created by users across the system."
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">Global habit list will be added in Step 4.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminHabits;