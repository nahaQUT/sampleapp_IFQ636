import React from 'react';

const PodcastCard = ({ podcast, onEdit, onDelete, isAdmin }) => {
  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.title}>{podcast.title}</h3>
          <span style={styles.category}>
            {podcast.category?.categoryName || 'Uncategorized'}
          </span>
        </div>
        <span style={styles.duration}>{podcast.duration}</span>
      </div>

      <p style={styles.description}>{podcast.description}</p>

      {/* Audio Player */}
      <div style={styles.playerContainer}>
        <audio
          controls
          src={podcast.audioUrl}
          style={styles.audioPlayer}
        >
          Your browser does not support the audio element.
        </audio>
      </div>

      <div style={styles.footer}>
        <span style={styles.date}>
          {new Date(podcast.createdAt).toLocaleDateString('en-AU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          })}
        </span>

        {/* Admin only buttons */}
        {isAdmin && (
          <div style={styles.actions}>
            <button
              onClick={() => onEdit(podcast)}
              style={styles.editBtn}
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(podcast._id)}
              style={styles.deleteBtn}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    border: '1px solid #f0f0f0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 6px 0',
  },
  category: {
    background: '#ede9fe',
    color: '#6c63ff',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  duration: {
    fontSize: '13px',
    color: '#888',
    whiteSpace: 'nowrap',
  },
  description: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    margin: '0',
  },
  playerContainer: {
    background: '#f9f9f9',
    borderRadius: '8px',
    padding: '12px',
  },
  audioPlayer: {
    width: '100%',
    height: '40px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
  },
  date: {
    fontSize: '12px',
    color: '#aaa',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  editBtn: {
    padding: '6px 16px',
    background: '#6c63ff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '6px 16px',
    background: '#ff4d4d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
};

export default PodcastCard;