export default function ProgressBar({ value }: { value: number }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div className="progress-track" aria-label={`Progress ${safeValue}%`}>
      <div className="progress-fill" style={{ width: `${safeValue}%` }} />
    </div>
  );
}
