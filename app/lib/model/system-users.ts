import type { User } from '@/app/lib/types'

export const SYSTEM_USERS: User[] = [
  {
    id: 'user_classics',
    username: 'classics',
    displayName: 'Classics',
    imageUrl: '/avatars/classic.jpg',
  },
  {
    id: 'user_modern_classics',
    username: 'modern_classics',
    displayName: 'Modern Classics',
    imageUrl: '/avatars/modern-classics.jpg',
  },
  {
    id: 'user_smugglerscove',
    username: 'smugglers_cove',
    displayName: 'smugglers_cove',
    imageUrl: '/avatars/smugglers-cove.jpg',
  },
  {
    id: 'user_deathcowelcomehome',
    username: 'deathco_welcome_home',
    displayName: 'deathco',
    imageUrl: '/avatars/deathco-welcome-home.jpg',
  },
]
