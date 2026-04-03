import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

const Habits = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Habit Management"
          subtitle="Create, edit, complete, and manage your habits."
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">Habit CRUD UI will be added in Step 3.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Habits;