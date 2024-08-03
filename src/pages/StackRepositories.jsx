import React, { useState } from 'react';
import axios from 'axios';

function StackRepositories() {
  const [stackInput, setStackInput] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [level, setLevel] = useState(0); // Default level is 0 (beginner)

  // Function to estimate repository complexity based on level
  const isLevelAppropriate = (repo) => {
    const thresholds = {
      0: { loc: 10000, issues: 50, pr: 15, minStars: 0 }, // Beginner
      1: { loc: 50000, issues: 100, pr: 30, minStars: 10 }, // Intermediate
      2: { loc: 100000, issues: 200, pr: 50, minStars: 50 }, // Hard
    };

    const { loc, issues, pr, minStars } = thresholds[level] || thresholds[0];

    return (
      (repo.size || 0) <= loc &&
      (repo.open_issues_count || 0) <= issues &&
      (repo.pulls || 0) <= pr &&
      (repo.stargazers_count || 0) >= minStars
    );
  };

  const fetchStackRepositories = async () => {
    try {
      const response = await axios.get(`https://api.github.com/search/repositories?q=topic:${stackInput}+language:javascript&sort=stars&order=desc`);
      const allRepos = response.data.items;

      // Filter repositories based on the selected level
      const filteredRepos = allRepos.filter(isLevelAppropriate);

      setRepositories(filteredRepos);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-4 text-white">See Where You’re Heading Next!</h2>
      <input
        type="text"
        className="border border-gray-600 p-2 rounded-lg mb-2 w-full"
        placeholder="Enter a technology stack"
        value={stackInput}
        onChange={(e) => setStackInput(e.target.value)}
      />
      <select
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
        className="border border-gray-600 p-2 rounded-lg mb-2 w-full"
      >
        <option value={0}>Beginner</option>
        <option value={1}>Intermediate</option>
        <option value={2}>Hard</option>
      </select>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mb-4"
        onClick={fetchStackRepositories}
      >
        Search
      </button>
      <div>
        {repositories.map((repo) => (
          <div key={repo.id} className="border border-gray-600 p-4 rounded-lg mb-4 text-left text-white">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {repo.name}
            </a>
            <p>{repo.description || 'No description available'}</p>
            <p>Stars: {repo.stargazers_count}</p>
            <p>Forks: {repo.forks_count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StackRepositories;
