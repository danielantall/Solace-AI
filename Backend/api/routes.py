from sqlite3 import IntegrityError
from fastapi import APIRouter, Depends, HTTPException
from Backend.api.auth import get_current_user_id
from api.schemas import CheckIn, HabitCompletion, Journal, Habit, JournalCreate
from db.database import get_db
from sqlalchemy.orm import Session
from db.models import CheckInModel, JournalModel, HabitModel, HabitCompletionModel
from sqlalchemy import text
from datetime import datetime, date, timedelta
from typing import Optional
from .perplexity_chat_endpoint import router as ai_router

Router = APIRouter()
# Journal Routes
@Router.post("/addjournal/", response_model=Journal)
def add_journal(journal: Journal, db: Session = Depends(get_db)):
   new_journal = JournalModel(**journal.dict())
   db.add(new_journal)
   db.commit()
   db.refresh(new_journal)
   return new_journal

@Router.get("/journals/", response_model=list[Journal])
def get_journals_by_user(user_id: str, db: Session = Depends(get_db)):
   return db.execute(text(f"SELECT * FROM journal WHERE user_id = '{user_id}'")).all()

# Habit Routes
@Router.post("/addHabit", response_model=Habit)
def add_habit(habit: Habit, db: Session = Depends(get_db)):
   new_habit = HabitModel(**habit.dict())
   db.add(new_habit)
   db.commit()
   db.refresh(new_habit)
   return new_habit

@Router.get("/habits", response_model=list[Habit])
def get_habits_by_user(user_id: str, db: Session = Depends(get_db)):
   return db.query(HabitModel).filter_by(user_id = user_id).all()

@Router.get("/completeHabit", response_model=bool)
def completeHabit(date: Optional[date], habitId: int, db: Session = Depends(get_db)):
   habit = db.query(HabitModel).filter_by(id = habitId).first()
   if habit is None:
      raise HTTPException(status_code=404, detail="Habit does not exist")
   if date is None:
      hc = HabitCompletion(id=None, habit_id=habitId, completed=True)
   else:
      hc = HabitCompletion(id=None, habit_id=habitId, completed=True, Date=date)
   try:
        newCompletion = HabitCompletionModel(**hc.dict())
        db.add(newCompletion)
        db.commit()
        db.refresh(newCompletion)
        return True
   except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Completion for this habit and date already exists.")
   except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@Router.get("/habit/days", response_model=list[bool])
def getDays(habitId: int, db: Session = Depends(get_db)):
   one_week_ago_date = (datetime.today() - timedelta(days=7)).date()
   query = db.query(HabitCompletionModel).filter(HabitCompletionModel.habit_id == habitId, HabitCompletionModel.Date>one_week_ago_date).all()
   result = []
   dayquery = [d.Date for d in query]
   for i in range(1,8):
      day = one_week_ago_date + timedelta(days=i)
      if day in dayquery:
         result.append(True)
         dayquery.remove(day)
      else:
         result.append(False)
   return result

@Router.post("/checkins/", response_model=CheckIn)
def create_checkin(checkin: CheckIn, db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    db_checkin = CheckInModel(**checkin.dict(), user_id=user_id)
    db.add(db_checkin)
    db.commit()
    db.refresh(db_checkin)
    return db_checkin

@Router.get("/checkins/", response_model=list[CheckIn])
def get_checkins(db: Session = Depends(get_db), user_id: str = Depends(get_current_user_id)):
    return db.query(CheckInModel).filter_by(user_id=user_id).all()

Router.include_router(ai_router)
