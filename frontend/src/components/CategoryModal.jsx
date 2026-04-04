import { useState } from 'react';

const BG_OPTIONS = ['#FFF3E0', '#FCE4EC', '#F3E5F5', '#E3F2FD', '#E8F5E9', '#FFF9C4', '#F3E5F5', '#E0F7FA'];

const CategoryModal = ({ isOpen, onClose, onAdd }) => {
  const [label, setLabel] = useState('');
  const [bg, setBg] = useState(BG_OPTIONS[0]);

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!label.trim()) return;

    onAdd({
      name: label.trim(),   
      bg,
      imageUrl: '/recycle.png',
    });

    setLabel('');
    setBg(BG_OPTIONS[0]);
    onClose();
  };

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.42)',
          zIndex: 999,
          backdropFilter: 'blur(2px)',
        }}
        onClick={onClose}
      />

      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#fff',
          borderRadius: 20,
          width: '92%',
          maxWidth: 440,
          zIndex: 1000,
          boxShadow: '0 24px 60px rgba(0,0,0,0.16)',
        }}
      >
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #eee' }}>
          <h2>Add Category</h2>
        </div>

        <div style={{ padding: '20px 24px' }}>
          <input
            type="text"
            placeholder="Category Name"
            value={label}
            onChange={e => setLabel(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 16 }}
          />

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {BG_OPTIONS.map(c => (
              <button
                key={c}
                onClick={() => setBg(c)}
                style={{
                  width: 34,
                  height: 34,
                  background: c,
                  border: bg === c ? '3px solid #286934' : '2px solid #ddd',
                }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, padding: 20 }}>
          <button onClick={onClose} style={{ flex: 1 }}>Cancel</button>
          <button onClick={handleAdd} style={{ flex: 2, background: '#286934', color: '#fff' }}>
            Add
          </button>
        </div>
      </div>
    </>
  );
};

export default CategoryModal;