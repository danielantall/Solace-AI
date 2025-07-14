from fastapi import APIRouter, Depends
from api.schemas import JournalCreate, Journal
from db.database import get_db
from sqlalchemy.orm import Session
from db.models import JournalModel


Router = APIRouter()


@Router.post("/addjournal/", response_model=Journal)
def add_journal(journal: Journal, db: Session = Depends(get_db)):
   new_journal = JournalModel(**journal.dict())
   db.add(new_journal)
   db.commit()
   db.refresh(new_journal)
   return new_journal