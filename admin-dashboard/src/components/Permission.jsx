import { useAuth } from "../hooks/useAuth"

export default function PermissionGate({
  roles,
  children
}) {
  const { user } = useAuth()

  if (!roles.includes(user?.role))
    return null

  return children
}