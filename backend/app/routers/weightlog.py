from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from app.schemas.weightlog import WeightlogCreate,WeightlogResponse
from app.security import get_current_user
from app.models import WeightLog,User
from app.database import get_db
from typing import List

weight_log_router=APIRouter(prefix="/weightlog",tags=["WeightLog"])

@weight_log_router.post("/",response_model=WeightlogResponse)
def create_weightlog(weightlog:WeightlogCreate,current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    new_weight_log=WeightLog(
        user_id=current_user.id,
        weight=weightlog.weight
    )
    
    db.add(new_weight_log)
    db.commit()
    db.refresh(new_weight_log)
    
    return new_weight_log

@weight_log_router.get("/",response_model=List[WeightlogResponse])
def all_weightlogs(current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    weight_logs=db.query(WeightLog).filter(WeightLog.user_id==current_user.id).all()
    
    return weight_logs

@weight_log_router.delete("/{id}")
def delete_weight_log(id:int,current_user:User=Depends(get_current_user),db:Session=Depends(get_db)):
    weight_log=db.query(WeightLog).filter(WeightLog.id==id,WeightLog.user_id==current_user.id).first()
    
    if weight_log is None:
        raise HTTPException(status_code=404,detail="Weight Log Not found")
    
    db.delete(weight_log)
    db.commit()
    
    return {
        "message":"Weight Log Deleted Successfully"
    }
    

