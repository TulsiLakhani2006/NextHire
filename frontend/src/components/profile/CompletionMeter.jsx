import React from 'react';

const getColor = (percent) => {
  if (percent === 100) return '#22c55e';   // green  — complete
  if (percent >= 60)   return '#f59e0b';   // amber  — good progress
  if (percent >= 20)   return '#f97316';   // orange — started
  return '#ef4444';                        // red    — empty
};

const getLabel = (percent) => {
  if (percent === 100) return '🎉 Profile complete!';
  if (percent >= 80)   return 'Upload your resume to finish';
  if (percent >= 60)   return 'Add work experience';
  if (percent >= 40)   return 'Add your education';
  if (percent >= 20)   return 'Add your skills next';
  return 'Add a headline to get started';
};

const CompletionMeter = ({ percent }) => {
  const color = getColor(percent);
  const isComplete = percent === 100;

  return (
    <div className={`completion-meter ${isComplete ? 'meter-complete' : ''}`}>
      <div className="completion-header">
        <span>Profile Completion</span>
        <span className="completion-pct" style={{ color }}>
          {percent}%
        </span>
      </div>

      {/* Track */}
      <div className="meter-track">
        <div
          className="meter-fill"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
            boxShadow: isComplete ? `0 0 8px ${color}` : 'none',
          }}
        />
      </div>

      {/* Step markers */}
      <div className="meter-markers">
        {[20, 40, 60, 80, 100].map(mark => (
          <div
            key={mark}
            className={`meter-mark ${percent >= mark ? 'reached' : ''}`}
            style={{ left: `${mark}%`, borderColor: percent >= mark ? color : undefined }}
          />
        ))}
      </div>

      {/* Hint text */}
      <p className="completion-hint" style={{ color: isComplete ? color : undefined }}>
        {getLabel(percent)}
      </p>
    </div>
  );
};

export default CompletionMeter;