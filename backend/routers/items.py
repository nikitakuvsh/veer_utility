from fastapi import APIRouter, Depends, Form, HTTPException, status
from typing import List
from sqlalchemy.orm import Session
import json
from .. import crud, schemas, database

router = APIRouter(prefix="/items", tags=["Items"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.ItemRead)
async def create_item(
    title: str = Form(...),
    price: float = Form(...),
    description: str = Form(""),
    gender: str = Form("unisex"),
    images: str = Form(...),
    db: Session = Depends(get_db)
):
    try:
        images_list = json.loads(images)
    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="Invalid images JSON")

    if not images_list:
        raise HTTPException(status_code=400, detail="No image URLs provided")

    item_data = schemas.ItemCreate(
        title=title, price=price, description=description, gender=gender
    )
    return crud.create_item(db, item_data, images_list)

@router.get("/", response_model=List[schemas.ItemRead])
def read_items(db: Session = Depends(get_db)):
    return crud.get_items(db)

@router.delete("/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    crud.delete_item(db, item_id)
    return None
