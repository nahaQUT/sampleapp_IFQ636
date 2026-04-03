import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

const AdminUsers = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="User Monitoring"
          subtitle="View and monitor all registered users in the system."
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">User list will be added in Step 4.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AdminUsers;