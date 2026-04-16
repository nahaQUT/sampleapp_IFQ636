import BrandLogo from './BrandLogo';

const AuthLayout = ({ title, subtitle, admin = false, children, footer }) => {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
          <div
            className={`hidden lg:flex flex-col justify-between p-10 text-white ${
              admin
                ? 'bg-gradient-to-br from-cyan-500 via-sky-500 to-indigo-600'
                : 'bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500'
            }`}
          >
            <div>
              <div className="inline-flex rounded-2xl bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur">
                Habit Mate
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                {admin ? 'Manage your habit system with clarity.' : 'Build better habits, one day at a time.'}
              </h2>
              <p className="max-w-md text-base text-white/90">
                {admin
                  ? 'Monitor users, habits, and categories through a clean and simple dashboard.'
                  : 'Track your daily routine, stay consistent, and grow your streak with Habit Mate.'}
              </p>
            </div>

            <div className="text-sm text-white/80">
              {admin ? 'Admin access only' : 'Personal habit tracking platform'}
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-10">
            <div className="w-full max-w-md space-y-8">
              <BrandLogo admin={admin} />

              <div>
                <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
                <p className="mt-2 text-slate-500">{subtitle}</p>
              </div>

              {children}

              {footer ? <div>{footer}</div> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;