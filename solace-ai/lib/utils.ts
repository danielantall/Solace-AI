import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axios from "axios"
import { habit, journal } from "./types"
import { json } from "stream/consumers"



const BACKEND = process.env.NEXT_PUBLIC_BACKEND

export interface Habit {
    id: number,
    name: string,
    description: string,
    streak: number,
    target: number,
    days: boolean[],
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getAllJournals(userId: string){
  try {
    const response = await axios.get(`${BACKEND}/api/journals/`, {
      params: { user_id: userId }
    })
    return response.data
  } catch (err) {
    console.error(err)
    return []
  }
}

export async function addJournal(content: string, userId: string){
  try{
    const response = await axios.post(`${BACKEND}/api/addjournal`, {user_id: userId, content: content})
    return response.data
  } catch(err){
    return err
  }
}

export async function addHabit(name: string, desc: string, targetStreak: number, userId: string){
  try{
    const response = await axios.post(`${BACKEND}/api/addHabit`, {
      user_id: userId,
      name: name,
      description: desc,
      target: targetStreak,
    })
    return response.data
  } catch(err){
    return err
  }
}

export async function getDays(habitId: number){
    try{
      const response = await axios.get(`${BACKEND}/api/habit/days?habitId=${habitId}`)
    return response.data
    } catch(err){
      return err
    }

}

export async function getHabits(id: string): Promise<Habit[]>{
  try{
    const response = await axios.get(`${BACKEND}/api/habits?user_id=${id}`)
    const returnlist: Habit[] = []
    for (let i = 0; i<response.data.length; i++){
      const days = await getDays(response.data[i].id)

      let streak = 0
      for (let j=6;j>=0; i-- ){
        if(days[j] ==true){
          streak ++;
        } else{
          break;
        }
      }

      returnlist.push(
        {
          id: response.data[i].id,
          description: response.data[i].description,
          name: response.data[i].name,
          target: response.data[i].target,
          days: days,
          streak: streak
        }
      )
    }
    return returnlist;
  }catch(err){
    throw err
  }
}