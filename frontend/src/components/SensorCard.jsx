export default function SensorCard({ title, value, unit, icon, color, subtitle }) {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <div style={styles.icon}>{icon}</div>
      <div>
        <p style={styles.title}>{title}</p>
        <p style={{ ...styles.value, color }}>{value !== null && value !== undefined ? value : '—'} <span style={styles.unit}>{unit}</span></p>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff', borderRadius: '10px', padding: '20px',
    display: 'flex', alignItems: 'center', gap: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)', flex: '1', minWidth: '160px',
  },
  icon: { fontSize: '32px' },
  title: { margin: 0, fontSize: '12px', color: '#666', textTransform: 'uppercase', letterSpacing: '0.5px' },
  value: { margin: '4px 0 0', fontSize: '26px', fontWeight: 700 },
  unit: { fontSize: '14px', fontWeight: 400, color: '#888' },
  subtitle: { margin: '2px 0 0', fontSize: '11px', color: '#999' },
};