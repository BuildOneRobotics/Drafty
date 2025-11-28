const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GIST_ID = process.env.GIST_ID

export async function saveToGist(data: any) {
  if (!GIST_ID || typeof GIST_ID !== 'string' || !/^[a-f0-9]+$/.test(GIST_ID)) {
    throw new Error('Invalid GIST_ID')
  }
  const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        'drafty-data.json': {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  })
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }
  return response.json()
}

export async function loadFromGist() {
  if (!GIST_ID || typeof GIST_ID !== 'string' || !/^[a-f0-9]+$/.test(GIST_ID)) {
    throw new Error('Invalid GIST_ID')
  }
  const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  })
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }
  const gist = await response.json()
  const content = gist.files['drafty-data.json']?.content
  return content ? JSON.parse(content) : { users: {}, notes: {}, whiteboards: {}, notebooks: {}, flashcardFolders: [], files: [] }
}

export async function deleteFromGist(fileName: string) {
  if (!GIST_ID || typeof GIST_ID !== 'string' || !/^[a-f0-9]+$/.test(GIST_ID)) {
    throw new Error('Invalid GIST_ID')
  }
  const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        [fileName]: null,
      },
    }),
  })
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }
  return response.json()
}
