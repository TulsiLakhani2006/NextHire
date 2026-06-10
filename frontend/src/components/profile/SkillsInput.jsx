import React, { useState } from 'react';

// Master skill taxonomy for autocomplete
const SKILL_SUGGESTIONS = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js',
  'Python', 'Java', 'Spring Boot', 'MongoDB', 'PostgreSQL', 'MySQL',
  'Docker', 'Kubernetes', 'AWS', 'Git', 'REST APIs', 'GraphQL',
  'HTML', 'CSS', 'Tailwind CSS', 'Redux', 'Jest', 'Microservices',
  'Machine Learning', 'Data Analysis', 'SQL', 'Linux', 'CI/CD',
];

const SkillsInput = ({ skills = [], onChange }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    if (val.length > 0) {
      setSuggestions(
        SKILL_SUGGESTIONS.filter(s =>
          s.toLowerCase().includes(val.toLowerCase()) && !skills.includes(s)
        ).slice(0, 6)
      );
    } else {
      setSuggestions([]);
    }
  };

  const addSkill = (skill) => {
    if (skill && !skills.includes(skill)) {
      onChange([...skills, skill]);
    }
    setInput('');
    setSuggestions([]);
  };

  const removeSkill = (skill) => {
    onChange(skills.filter(s => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      addSkill(input.trim());
    }
  };

  return (
    <div className="skills-input-container">
      <div className="skills-tags">
        {skills.map(skill => (
          <span key={skill} className="skill-tag">
            {skill}
            <button onClick={() => removeSkill(skill)} className="remove-skill">×</button>
          </span>
        ))}
      </div>
      <div className="autocomplete-wrapper">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a skill and press Enter..."
          className="skill-input"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map(s => (
              <li key={s} onClick={() => addSkill(s)} className="suggestion-item">{s}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SkillsInput;