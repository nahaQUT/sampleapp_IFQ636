import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';

const Categories = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <PageHeader
          title="Category Management"
          subtitle="Create and manage habit categories for the system."
        />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-slate-500">Category CRUD will be added in Step 5.</p>
        </div>
      </div>
    </Layout>
  );
};

export default Categories;