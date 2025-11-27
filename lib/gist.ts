const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const GIST_ID = process.env.GIST_ID

export async function saveToGist(data: any) {
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
  return response.json()
}

export async function loadFromGist() {
  const response = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  })
  const gist = await response.json()
  const content = gist.files['drafty-data.json']?.content
  return content ? JSON.parse(content) : { users: {}, notes: {} }
}
