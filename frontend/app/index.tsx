import { Redirect } from 'expo-router'
//import { useAuth } from '@/src/hooks/useAuth'  // à créer plus tard

export default function Index() {
  //const { user } = useAuth()

  //if (user) return <Redirect href="/(tabs)/profile" />
  return <Redirect href="/welcome" />
}
