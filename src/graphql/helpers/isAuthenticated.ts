import { AuthenticationError } from 'apollo-server-micro'

const isAuthenticated = (root, args, context, info) => {
  if (!context.isAdmin) {
    return new AuthenticationError('Not authenticated')
  }
}

export default isAuthenticated
