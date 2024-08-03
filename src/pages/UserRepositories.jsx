import React, { useState } from 'react';
import axios from 'axios';

function UserRepositories() {
  const [username, setUsername] = useState('');
  const [stacks, setStacks] = useState('');
  const [repos, setRepos] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [repoStats, setRepoStats] = useState({ totalRepos: 0, stackUpdates: {} });

  const fetchUserRepositories = async () => {
    try {
      const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos?per_page=100`);
      setRepos(reposResponse.data);
      setRepoStats((prevStats) => ({ ...prevStats, totalRepos: reposResponse.data.length }));
      filterRepositoriesByStacks(reposResponse.data);
    } catch (error) {
      console.error('Error fetching user repositories:', error);
    }
  };

  const calculateStackPercentage = async (repo, stack) => {
    try {
      const languagesResponse = await axios.get(repo.languages_url);
      const totalBytes = Object.values(languagesResponse.data).reduce((acc, value) => acc + value, 0);
      const stackBytes = languagesResponse.data[stack] || 0;
      const percentage = (stackBytes / totalBytes) * 100;
      return percentage.toFixed(2);
    } catch (error) {
      console.error(`Error fetching languages for repo ${repo.name}:`, error);
      return 0;
    }
  };

  const fetchCommits = async (repo) => {
    try {
      const commitsResponse = await axios.get(`${repo.commits_url.replace('{/sha}', '')}?per_page=1`);
      return commitsResponse.data.length;
    } catch (error) {
      console.error(`Error fetching commits for repo ${repo.name}:`, error);
      return 0;
    }
  };

  const filterRepositoriesByStacks = async (repos) => {
    const stackList = stacks.split(',').map(stack => stack.trim()).filter(stack => stack);
    const filtered = [];
    const stackUpdates = {};

    for (const stack of stackList) {
      stackUpdates[stack] = { reposCount: 0, totalCommits: 0 };
    }

    for (const repo of repos) {
      for (const stack of stackList) {
        const percentage = await calculateStackPercentage(repo, stack);
        if (percentage > 0) {
          const commitsCount = await fetchCommits(repo);
          stackUpdates[stack].reposCount += 1;
          stackUpdates[stack].totalCommits += commitsCount;

          filtered.push({
            ...repo,
            stack,
            stackPercentage: percentage,
            commitsCount
          });
          break; // Once a stack is found, stop checking other stacks
        }
      }
    }

    setFilteredRepos(filtered);
    setRepoStats((prevStats) => ({ ...prevStats, stackUpdates }));
  };

  const handleFetchData = async () => {
    if (username && stacks) {
      await fetchUserRepositories();
    }
  };

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">See How You’re Crushing It!</h2>
      <input
        type="text"
        className="border border-gray-600 p-2 rounded-lg mb-2"
        placeholder="GitHub Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="text"
        className="border border-gray-600 p-2 rounded-lg mb-2"
        placeholder="Stacks (e.g., JavaScript, Python)"
        value={stacks}
        onChange={(e) => setStacks(e.target.value)}
      />
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mb-4"
        onClick={handleFetchData}
      >
        Fetch User Repos
      </button>
      <div>
        <h3 className="text-xl font-bold mb-2">Total Repositories: {repoStats.totalRepos}</h3>
        {filteredRepos.map((repo) => (
          <div key={repo.id} className="border border-gray-600 p-4 rounded-lg mb-4">
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
              {repo.name}
            </a>
            <p>{repo.description || 'No description available'}</p>
            <p>{repo.stack} Usage: {repo.stackPercentage}%</p>
            <p>Commits: {repo.commitsCount}</p>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Repository Stats</h2>
        {Object.keys(repoStats.stackUpdates).map(stack => (
          <div key={stack} className="mb-4">
            <h3 className="text-lg font-bold">{stack.charAt(0).toUpperCase() + stack.slice(1)} Stack</h3>
            <p>Repositories Count: {repoStats.stackUpdates[stack].reposCount}</p>
            <p>Total Commits: {repoStats.stackUpdates[stack].totalCommits}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserRepositories;
