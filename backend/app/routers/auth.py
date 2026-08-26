from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)

from app.database import get_db

from sqlalchemy.orm import Session

from app.schemas.user import (
    UserCreate,
    UserResponse,
    UserLogin,
    UserUpdate,
)

from app.models import User

from app.security import (
    hash_password,
    verify_password,
    create_access_token,
    get_current_user,
)

from fastapi.security import OAuth2PasswordRequestForm


auth_router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# =========================================================
# REGISTER
# =========================================================

@auth_router.post(
    "/register",
    response_model=UserResponse,
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db),
):

    existing_user = (
        db.query(User)
        .filter(
            User.email == user.email
        )
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=409,
            detail="Email already Registered",
        )


    hashed_password = hash_password(
        user.password
    )


    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        age=user.age,
        height=user.height,
        gender=user.gender,
        goal=user.goal,
    )


    db.add(new_user)
    db.commit()
    db.refresh(new_user)


    return new_user


# =========================================================
# LOGIN
# =========================================================

@auth_router.post("/login")
def verify_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):

    existing_user = (
        db.query(User)
        .filter(
            User.email == form_data.username
        )
        .first()
    )


    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials",
        )


    if not verify_password(
        form_data.password,
        existing_user.hashed_password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Credentials",
        )


    access_token = create_access_token(
        existing_user.id
    )


    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


# =========================================================
# CURRENT USER
# =========================================================

@auth_router.get("/me")
def get_me(
    current_user: User = Depends(
        get_current_user
    ),
):

    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "age": current_user.age,
        "height": current_user.height,
        "gender": current_user.gender,
        "goal": current_user.goal,
    }


# =========================================================
# UPDATE PROFILE
# =========================================================

@auth_router.put("/me")
def update_me(
    user_data: UserUpdate,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    # -----------------------------------------------------
    # Validate gender
    # -----------------------------------------------------

    valid_genders = {
        "MALE",
        "FEMALE",
        "OTHER",
    }

    if user_data.gender not in valid_genders:
        raise HTTPException(
            status_code=400,
            detail="Invalid gender.",
        )


    # -----------------------------------------------------
    # Validate goal
    # -----------------------------------------------------

    valid_goals = {
        "HYPERTROPHY",
        "FAT_LOSS",
        "STRENGTH",
        "ENDURANCE",
        "NOT_SURE",
    }

    if (
        user_data.goal is not None
        and user_data.goal not in valid_goals
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid goal.",
        )


    # -----------------------------------------------------
    # Update user
    # -----------------------------------------------------

    current_user.name = user_data.name
    current_user.age = user_data.age
    current_user.height = user_data.height
    current_user.gender = user_data.gender
    current_user.goal = user_data.goal


    db.commit()
    db.refresh(current_user)


    return {
        "message": "Profile updated successfully.",
        "user": {
            "id": current_user.id,
            "name": current_user.name,
            "email": current_user.email,
            "age": current_user.age,
            "height": current_user.height,
            "gender": current_user.gender,
            "goal": current_user.goal,
        },
    }