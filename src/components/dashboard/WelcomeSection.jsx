import { useUser } from '@clerk/nextjs'

export default function WelcomeSection() {
  const { user } = useUser()
  const currentHour = new Date().getHours()
  
  let greeting = 'Good evening'
  if (currentHour < 12) {
    greeting = 'Good morning'
  } else if (currentHour < 18) {
    greeting = 'Good afternoon'
  }

  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold tracking-tight">
        {greeting}, {user?.firstName || 'there'}! 👋
      </h1>
      <p className="text-muted-foreground">
        Here's what's happening with your shop today.
      </p>
    </div>
  )
} 