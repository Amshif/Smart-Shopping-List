from fastapi import APIRouter, FastAPI, Depends
from fastapi.exceptions import HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from app.config import  Settings,APP_CONFIG
from app.shared.dependencies import get_settings



from app.exception_handler import request_validation_exception_handler
from app.exception_handler import http_exception_handler, unhandled_exception_handler
from app.middleware import log_request_middleware
from app.routers import items


origins = [
    "http://localhost:8080",
    "https://www.harshad.shop",
    "https://harshad.shop",
    "http://www.harshad.shop",
]
app = FastAPI(**APP_CONFIG)

app.middleware("http")(log_request_middleware)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_exception_handler(RequestValidationError, request_validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)



@app.get('/', tags=['root'])
async def root() -> dict:
    '''' Root path get function
    :return: {'msg': 'SMART SHOPPING LIST API'}
    '''
    return {'msg': 'SMART SHOPPING LIST API'}

# @app.get('/db', tags=['root'])
# async def get_db(
#         settings: Settings = Depends(get_settings)
#     ) -> dict:
#     return { 'db': settings.db_engine }

api_v1_router = APIRouter(prefix="/api")


api_v1_router.include_router(items.router)

app.include_router(api_v1_router)

handler = Mangum(app, lifespan="off") 

