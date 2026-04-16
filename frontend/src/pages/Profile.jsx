import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import PageHeader from '../components/PageHeader';
import FormActions from '../components/FormActions';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    university: '',
    address: '',
  });

  const [passwordData, setPasswordData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setLoadingProfile(true);
      setProfileError('');

      try {
        const response = await axiosInstance.get('/auth/profile');

        setProfileData({
          name: response.data.name || '',
          email: response.data.email || '',
          university: response.data.university || '',
          address: response.data.address || '',
        });
      } catch (err) {
        setProfileError(err.response?.data?.message || 'Failed to fetch profile.');
      } finally {
        setLoadingProfile(false);
      }
    };

    if (user?.token) {
      fetchProfile();
    }
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMessage('');
    setProfileError('');
    setLoadingProfile(true);

    try {
      const response = await axiosInstance.put('/auth/profile', profileData);
      updateUser(response.data);

      setProfileData({
        name: response.data.name || '',
        email: response.data.email || '',
        university: response.data.university || '',
        address: response.data.address || '',
      });

      setProfileMessage('Profile updated successfully');
    } catch (err) {
      setProfileError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (!passwordData.password || !passwordData.confirmPassword) {
      setPasswordError('Please fill in both password fields');
      return;
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setLoadingPassword(true);

    try {
      const response = await axiosInstance.put('/auth/profile', {
        password: passwordData.password,
      });

      updateUser(response.data);
      setPasswordMessage('Password updated successfully');
      setPasswordData({
        password: '',
        confirmPassword: '',
      });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-6">
        <PageHeader
          title="Profile Settings"
          subtitle="Update your profile details or change your password separately."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleProfileSubmit}
            className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Update Profile</h2>
              <p className="mt-1 text-sm text-slate-500">
                Edit your personal account information.
              </p>
            </div>

            {profileMessage ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {profileMessage}
              </div>
            ) : null}

            {profileError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {profileError}
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Username</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
                required
              />
            </div>

            <FormActions
              submitLabel={loadingProfile ? 'Updating...' : 'Update Profile'}
              onCancel={() => navigate(-1)}
            />
          </form>

          <form
            onSubmit={handlePasswordSubmit}
            className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Change Password</h2>
              <p className="mt-1 text-sm text-slate-500">
                Update your password without changing other profile details.
              </p>
            </div>

            {passwordMessage ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {passwordMessage}
              </div>
            ) : null}

            {passwordError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {passwordError}
              </div>
            ) : null}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={passwordData.password}
                onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-emerald-500"
              />
            </div>

            <FormActions
              submitLabel={loadingPassword ? 'Updating...' : 'Update Password'}
              onCancel={() => navigate(-1)}
            />
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;