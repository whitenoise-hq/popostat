import { QueryClient, focusManager } from '@tanstack/react-query'
import { AppState } from 'react-native'
import type { AppStateStatus } from 'react-native'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === 'active')
}

AppState.addEventListener('change', onAppStateChange)