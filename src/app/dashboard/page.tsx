'use client'

import React, { useState, useEffect } from 'react'
import { useUser, SignOutButton } from '@clerk/nextjs'
import Link from 'next/link'

interface UserProfile {
  id: string
  name: string
  email: string
  currentRole?: string
  experience: string
  dreamCompanies: string
  careerGoals: string
  reputation: number
  skills: UserSkill[]
  submissions: Submission[]
}

interface UserSkill {
  id: string
  skillName: string
  category: string
  currentLevel: number
  confidenceScore: number
  proofsCompleted: number
}

interface Submission {
  id: string
  status: string
  finalScore?: number
  submittedAt: string
  proof: {
    title: string
    category: string
    difficulty: string
  }
}

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserProfile()
    }
  }, [isLoaded, user])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data.user)
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const getExperienceColor = (experience: string) => {
    switch (experience) {
      case 'BEGINNER': return 'text-green-400 bg-green-400/10'
      case 'JUNIOR': return 'text-blue-400 bg-blue-400/10'
      case 'MID': return 'text-yellow-400 bg-yellow-400/10'
      case 'SENIOR': return 'text-orange-400 bg-orange-400/10'
      case 'STAFF': return 'text-red-400 bg-red-400/10'
      case 'PRINCIPAL': return 'text-purple-400 bg-purple-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'FRONTEND': return '🎨'
      case 'BACKEND': return '⚙️'
      case 'FULLSTACK': return '🚀'
      case 'DEVOPS': return '☁️'
      case 'DESIGN': return '✨'
      case 'DATA': return '📊'
      default: return '💻'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'text-green-400 bg-green-400/10'
      case 'UNDER_REVIEW': return 'text-yellow-400 bg-yellow-400/10'
      case 'SUBMITTED': return 'text-blue-400 bg-blue-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading your dashboard...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Please sign in</h1>
          <Link href="/onboarding" className="text-purple-400 hover:text-purple-300">
            Go to onboarding
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

      {/* Header */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-white/80 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-4xl font-bold text-white">Dashboard</h1>
                <p className="text-white/80">Welcome back, {user.firstName || 'Developer'}!</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/challenges"
                className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Browse Challenges
              </Link>
              <SignOutButton>
                <button className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Reputation</p>
                  <p className="text-2xl font-bold text-white">{userProfile?.reputation || 0}</p>
                </div>
                <div className="text-2xl">⭐</div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Challenges</p>
                  <p className="text-2xl font-bold text-white">{userProfile?.submissions?.length || 0}</p>
                </div>
                <div className="text-2xl">🚀</div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Skills</p>
                  <p className="text-2xl font-bold text-white">{userProfile?.skills?.length || 0}</p>
                </div>
                <div className="text-2xl">💡</div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/60 text-sm">Experience</p>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium mt-1 ${getExperienceColor(userProfile?.experience || 'BEGINNER')}`}>
                    {userProfile?.experience || 'BEGINNER'}
                  </div>
                </div>
                <div className="text-2xl">📈</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Section */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Your Profile</h2>

              {userProfile ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-white/60 text-sm">Current Role</p>
                    <p className="text-white font-medium">{userProfile.currentRole || 'Not specified'}</p>
                  </div>

                  <div>
                    <p className="text-white/60 text-sm">Dream Companies</p>
                    <p className="text-white">{userProfile.dreamCompanies}</p>
                  </div>

                  <div>
                    <p className="text-white/60 text-sm">Career Goals</p>
                    <p className="text-white/80 text-sm">{userProfile.careerGoals}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">👋</div>
                  <p className="text-white/80 mb-4">Complete your profile to get started</p>
                  <Link
                    href="/onboarding"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Complete Onboarding
                  </Link>
                </div>
              )}
            </div>

            {/* Skills Progress */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Your Skills</h2>

              {userProfile?.skills && userProfile.skills.length > 0 ? (
                <div className="space-y-4">
                  {userProfile.skills.map((skill) => (
                    <div key={skill.id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCategoryIcon(skill.category)}</span>
                          <span className="text-white font-medium">{skill.skillName}</span>
                        </div>
                        <span className="text-white/60 text-sm">{skill.proofsCompleted} proofs</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Level</span>
                          <span className="text-white">{skill.currentLevel}/10</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                            style={{ width: `${skill.currentLevel * 10}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-sm">
                          <span className="text-white/60">Confidence</span>
                          <span className="text-white">{skill.confidenceScore}%</span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-green-400 to-emerald-400 h-2 rounded-full"
                            style={{ width: `${skill.confidenceScore}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-4">🎯</div>
                  <p className="text-white/80 mb-4">No skills tracked yet</p>
                  <Link
                    href="/challenges"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Start a Challenge
                  </Link>
                </div>
              )}
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Recent Activity</h2>

              {userProfile?.submissions && userProfile.submissions.length > 0 ? (
                <div className="space-y-4">
                  {userProfile.submissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="bg-white/5 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{getCategoryIcon(submission.proof.category)}</span>
                          <div>
                            <p className="text-white font-medium">{submission.proof.title}</p>
                            <p className="text-white/60 text-sm">
                              {new Date(submission.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {submission.finalScore && (
                            <span className="text-white font-medium">{submission.finalScore}/100</span>
                          )}
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                            {submission.status}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-xl font-bold text-white mb-2">No activity yet</h3>
                  <p className="text-white/60 mb-6">
                    Start your journey by completing your first challenge
                  </p>
                  <Link
                    href="/challenges"
                    className="inline-block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
                  >
                    Browse Challenges
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
