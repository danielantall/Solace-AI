from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime, date
from enum import Enum



class Habit(BaseModel):
    id: Optional[str]
    user_id: str
    name: str
    description: str
    target: int
    created_at: date = Field(default_factory=date.today)

    class Config:
       orm_mode = True

class Journal(BaseModel):
   id: Optional[int]
   content: str
   user_id: str
   created_at: datetime = Field(default_factory=datetime.now)
   class Config:
       orm_mode = True

class HabitCompletion(BaseModel):
    id: Optional[int]
    habit_id: int
    completed: bool
    Date: date = Field(default_factory=date.today)


class CheckIn(BaseModel):
    id: Optional[int]
    user_id: str
    title: str
    description: str
    time: str
    completed: bool
    active: bool
