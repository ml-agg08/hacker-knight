import React from 'react';

function RepoSuggestions({ repos }) {
  return (
    <div className="RepoSuggestions">
      <h2>Recommended Repositories</h2>
      <ul>
        {repos.map((repo) => (
          <li key={repo.id}>
            <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
              {repo.name}
            </a> - {repo.description || 'No description available'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RepoSuggestions;
