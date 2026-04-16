const FormActions = ({ submitLabel = 'Save', onCancel }) => {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="submit"
        className="inline-flex justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-medium text-white hover:bg-slate-800"
      >
        {submitLabel}
      </button>

      <button
        type="button"
        onClick={onCancel}
        className="inline-flex justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Cancel
      </button>
    </div>
  );
};

export default FormActions;