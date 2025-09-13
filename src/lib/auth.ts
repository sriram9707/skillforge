import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from './db'

export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await currentUser()
  if (!user) return null

  let dbUser = await db.user.findUnique({
    where: { id: userId },
    include: {
      skills: true
    }
  })

  if (!dbUser) {
    dbUser = await db.user.create({
      data: {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress ?? '',
        name: `${user.firstName} ${user.lastName}`.trim() || 'User',
        avatar: user.imageUrl,
        dreamCompanies: '',
        careerGoals: ''
      },
      include: {
        skills: true
      }
    })
  }

  return dbUser
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}