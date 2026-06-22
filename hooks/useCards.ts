import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Card } from '../types/card'

const CARDS_KEY = ['cards']

export function useCards() {
  return useQuery({
    queryKey: CARDS_KEY,
    queryFn: async (): Promise<Card[]> => {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as Card[]
    },
  })
}

export function useCard(id: string) {
  return useQuery({
    queryKey: ['cards', id],
    queryFn: async (): Promise<Card> => {
      const { data, error } = await supabase
        .from('cards')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Card
    },
    enabled: !!id,
  })
}

export function useDeleteCard() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cards')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CARDS_KEY })
    },
  })
}
