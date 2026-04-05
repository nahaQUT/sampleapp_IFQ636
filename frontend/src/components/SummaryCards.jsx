const cardStyleMap = {
  'Total Habits': {
    icon: '📋',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    border: 'border-blue-100',
    valueText: 'text-blue-700',
  },
  'Completed Today': {
    icon: '✅',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
    border: 'border-emerald-100',
    valueText: 'text-emerald-700',
  },
  'Current Streak': {
    icon: '🔥',
    iconBg: 'bg-orange-100',
    iconText: 'text-orange-600',
    border: 'border-orange-100',
    valueText: 'text-orange-700',
  },
  'Completion Rate': {
    icon: '📈',
    iconBg: 'bg-violet-100',
    iconText: 'text-violet-600',
    border: 'border-violet-100',
    valueText: 'text-violet-700',
  },
};

const SummaryCards = ({ cards = [] }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const styles = cardStyleMap[card.label] || {
          icon: '📌',
          iconBg: 'bg-slate-100',
          iconText: 'text-slate-600',
          border: 'border-slate-200',
          valueText: 'text-slate-900',
        };

        return (
          <div
            key={card.label}
            className={`rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${styles.border}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-500">{card.label}</p>
                <h2 className={`mt-3 text-3xl font-bold ${styles.valueText}`}>{card.value}</h2>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl ${styles.iconBg} ${styles.iconText}`}
              >
                <span>{styles.icon}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;