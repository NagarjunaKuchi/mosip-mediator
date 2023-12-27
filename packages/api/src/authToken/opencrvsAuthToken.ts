import { resolve } from 'url'
import fetch from 'node-fetch'
import { logger } from '@api/logger'
import { AUTH_URL, CLIENT_ID, CLIENT_SECRET } from '@api/constants'

export async function verifyOpencrvsAuthToken(token: string): Promise<boolean> {
  if (!AUTH_URL) {
    return true
  }
  const valid = await fetch(resolve(AUTH_URL, 'verifyToken'), {
    method: 'POST',
    body: `token=${token}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
    .then(response => {
      return response.json()
    })
    .catch(error => {
      logger.error(`failed verifying token: ${error.message}`)
      return undefined
    })
  if (!valid && !valid['valid']) {
    return false
  } else {
    return valid['valid']
  }
}

export async function getOpencrvsAuthToken(): Promise<string> {
  const createToken = await fetch(
    resolve(AUTH_URL, 'token'),
    {
      method: 'POST',
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
    .then(response => {
      return response.json()
    })
    .catch(error => {
      return Promise.reject(new Error(` request failed: ${error.message}`))
    })
  logger.info(
    `This is the authToken request response: ${JSON.stringify(createToken)}`
  )
  if ('access_token' in createToken) {
    return createToken.access_token
  } else {
    return ''
  }
}
