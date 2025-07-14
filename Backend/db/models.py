from datetime import date
from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import mapped_column, Mapped, relationship, DeclarativeBase
from typing import List


class Base(DeclarativeBase):
   pass 


class JournalModel(Base):
   __tablename__ = "journal"

   id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
   content: Mapped[str] = mapped_column(nullable=False)
   user_id: Mapped[str] = mapped_column(nullable=False)
   created_at: Mapped[str] = mapped_column(nullable=False)

class HabitModel(Base):
   __tablename__ = "habit"

   id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True, index=True)
   user_id: Mapped[str] = mapped_column(nullable=False)
   name: Mapped[str] = mapped_column(nullable=False)
   description: Mapped[str] = mapped_column(nullable=False)
   target: Mapped[int] = mapped_column(nullable=False)
   created_at: Mapped[date] = mapped_column( nullable=False)
   completions: Mapped[List["HabitCompletionModel"]] = relationship(
        "HabitCompletionModel", back_populates="habit"
    )

class HabitCompletionModel(Base):
   __tablename__ = "habit_completion"
   __table_args__ = (
       UniqueConstraint("habit_id", "Date", name="uix_habit_date"),
   )

   id: Mapped[int] = mapped_column(autoincrement=True, primary_key=True, index=True)
   habit_id: Mapped[int] = mapped_column(ForeignKey("habit.id"))
   completed: Mapped[bool] = mapped_column(nullable=False, default=False)
   Date: Mapped[date] = mapped_column(nullable=False)
   habit: Mapped["HabitModel"] = relationship(
        "HabitModel", back_populates="completions"
    )

class CheckInModel(Base):
    __tablename__ = "checkins"
    id: Mapped[int] = mapped_column(primary_key=True, index=True, autoincrement=True)
    user_id: Mapped[str] = mapped_column(nullable=False, index=True)
    title: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)
    time: Mapped[str] = mapped_column(nullable=False)
    completed: Mapped[bool] = mapped_column(nullable=False, default=False)
    active: Mapped[bool] = mapped_column(nullable=False, default=True)
