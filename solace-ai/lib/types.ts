
export type habit = {
    id: string
    user_id: string,
    name: string,
    description: string,
    streak: number,
    target: number,
    created_at: Date,
    isComplete: boolean
}

export type journal = {
    id: string,
    content: string,
    user_id: string,
    created_at: Date,
}

export type journalEntry = {
  id: string
  date: Date
  summary: string
  insights: string[]
  audioUrl: string
}