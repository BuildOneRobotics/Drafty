const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GIST_ID = process.env.GIST_ID

function getFileName(userId: string) {
  return `drafty-${userId}.json`
}

export async function saveToGist(data: any, userId?: string) {
  const fileName = userId ? getFileName(userId) : 'drafty-data.json'
  const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    method: 'PATCH',
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      files: {
        [fileName]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    }),
  })
  return response.json()
}

export async function loadFromGist(userId?: string) {
  const fileName = userId ? getFileName(userId) : 'drafty-data.json'
  const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  })
  const gist = await response.json()
  const content = gist.files[fileName]?.content
  return content ? JSON.parse(content) : { users: {}, notes: {}, whiteboards: {}, notebooks: {}, flashcardFolders: [], files: [] }
}

export async function deleteFromGist(fileName: string) {
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
  return response.json()
}
