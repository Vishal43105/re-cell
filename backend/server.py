from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from fastapi.responses import StreamingResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import secrets
import io
import csv

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="Re-Cell Technology Solutions API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBasic()

# Admin credentials (in production, use proper auth)
ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "recell2024!")

# Resend configuration (optional)
RESEND_API_KEY = os.environ.get("RESEND_API_KEY")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "onboarding@resend.dev")
NOTIFICATION_EMAIL = "info@re-cell.ie"

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ============== Models ==============

class EnquiryCreate(BaseModel):
    name: str
    company: str
    email: EmailStr
    phone: Optional[str] = None
    region: str
    volume: str
    products: str
    grade: str
    message: str

class Enquiry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    company: str
    email: EmailStr
    phone: Optional[str] = None
    region: str
    volume: str
    products: str
    grade: str
    message: str
    status: str = "new"  # new, contacted, closed
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class EnquiryUpdate(BaseModel):
    status: Optional[str] = None

class FAQItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    question: str
    answer: str
    order: int = 0

class StockItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    product: str
    model: str
    grade: str
    quantity: int
    price_eur: float
    available: bool = True

# ============== Auth ==============

def verify_admin(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(credentials.username, ADMIN_USERNAME)
    correct_password = secrets.compare_digest(credentials.password, ADMIN_PASSWORD)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username

# ============== Email (Optional) ==============

async def send_notification_email(enquiry: Enquiry):
    """Send email notification for new enquiry (if Resend is configured)"""
    if not RESEND_API_KEY:
        logger.info("Resend not configured, skipping email notification")
        return
    
    try:
        import resend
        resend.api_key = RESEND_API_KEY
        
        html_content = f"""
        <h2>New Trade Enquiry</h2>
        <p><strong>Name:</strong> {enquiry.name}</p>
        <p><strong>Company:</strong> {enquiry.company}</p>
        <p><strong>Email:</strong> {enquiry.email}</p>
        <p><strong>Phone:</strong> {enquiry.phone or 'Not provided'}</p>
        <p><strong>Region:</strong> {enquiry.region}</p>
        <p><strong>Volume:</strong> {enquiry.volume}</p>
        <p><strong>Products:</strong> {enquiry.products}</p>
        <p><strong>Grade:</strong> {enquiry.grade}</p>
        <p><strong>Message:</strong></p>
        <p>{enquiry.message}</p>
        """
        
        params = {
            "from": SENDER_EMAIL,
            "to": [NOTIFICATION_EMAIL],
            "subject": f"New Trade Enquiry - {enquiry.company}",
            "html": html_content
        }
        
        await asyncio.to_thread(resend.Emails.send, params)
        logger.info(f"Email notification sent for enquiry {enquiry.id}")
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")

# ============== Public Routes ==============

@api_router.get("/")
async def root():
    return {"message": "Re-Cell Technology Solutions API"}

@api_router.post("/enquiries", response_model=Enquiry)
async def create_enquiry(input: EnquiryCreate):
    """Submit a new trade enquiry"""
    enquiry_dict = input.model_dump()
    enquiry_obj = Enquiry(**enquiry_dict)
    
    doc = enquiry_obj.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.enquiries.insert_one(doc)
    
    # Send email notification (non-blocking)
    asyncio.create_task(send_notification_email(enquiry_obj))
    
    return enquiry_obj

@api_router.get("/faq", response_model=List[FAQItem])
async def get_faq():
    """Get all FAQ items"""
    faqs = await db.faqs.find({}, {"_id": 0}).sort("order", 1).to_list(100)
    return faqs

@api_router.get("/stock-summary")
async def get_stock_summary():
    """Get public stock summary (categories only, no prices)"""
    return {
        "categories": [
            {"name": "iPhone", "grades": ["New", "Like New (Activated)", "A+"]},
            {"name": "iPad", "grades": ["New", "Like New (Activated)", "A+"]},
            {"name": "MacBook", "grades": ["New", "Like New (Activated)", "A+"]},
            {"name": "AirPods", "grades": ["New", "Like New (Activated)", "A+"]},
        ],
        "note": "Contact us for current availability and pricing"
    }

# ============== Admin Routes ==============

@api_router.get("/admin/enquiries", response_model=List[Enquiry])
async def get_enquiries(
    status: Optional[str] = Query(None),
    admin: str = Depends(verify_admin)
):
    """Get all enquiries (admin only)"""
    query = {}
    if status:
        query["status"] = status
    
    enquiries = await db.enquiries.find(query, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for enquiry in enquiries:
        if isinstance(enquiry.get('created_at'), str):
            enquiry['created_at'] = datetime.fromisoformat(enquiry['created_at'])
    
    return enquiries

@api_router.get("/admin/enquiries/{enquiry_id}", response_model=Enquiry)
async def get_enquiry(enquiry_id: str, admin: str = Depends(verify_admin)):
    """Get single enquiry (admin only)"""
    enquiry = await db.enquiries.find_one({"id": enquiry_id}, {"_id": 0})
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    
    if isinstance(enquiry.get('created_at'), str):
        enquiry['created_at'] = datetime.fromisoformat(enquiry['created_at'])
    
    return enquiry

@api_router.patch("/admin/enquiries/{enquiry_id}", response_model=Enquiry)
async def update_enquiry(
    enquiry_id: str,
    update: EnquiryUpdate,
    admin: str = Depends(verify_admin)
):
    """Update enquiry status (admin only)"""
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.enquiries.update_one(
        {"id": enquiry_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    
    enquiry = await db.enquiries.find_one({"id": enquiry_id}, {"_id": 0})
    if isinstance(enquiry.get('created_at'), str):
        enquiry['created_at'] = datetime.fromisoformat(enquiry['created_at'])
    
    return enquiry

@api_router.delete("/admin/enquiries/{enquiry_id}")
async def delete_enquiry(enquiry_id: str, admin: str = Depends(verify_admin)):
    """Delete enquiry (admin only)"""
    result = await db.enquiries.delete_one({"id": enquiry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"message": "Enquiry deleted"}

@api_router.get("/admin/enquiries/export/csv")
async def export_enquiries_csv(admin: str = Depends(verify_admin)):
    """Export all enquiries as CSV (admin only)"""
    enquiries = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(10000)
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Header
    writer.writerow(["ID", "Name", "Company", "Email", "Phone", "Region", "Volume", "Products", "Grade", "Message", "Status", "Created At"])
    
    # Data
    for e in enquiries:
        writer.writerow([
            e.get("id", ""),
            e.get("name", ""),
            e.get("company", ""),
            e.get("email", ""),
            e.get("phone", ""),
            e.get("region", ""),
            e.get("volume", ""),
            e.get("products", ""),
            e.get("grade", ""),
            e.get("message", ""),
            e.get("status", ""),
            e.get("created_at", "")
        ])
    
    output.seek(0)
    
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=enquiries.csv"}
    )

@api_router.get("/admin/stats")
async def get_admin_stats(admin: str = Depends(verify_admin)):
    """Get dashboard stats (admin only)"""
    total = await db.enquiries.count_documents({})
    new = await db.enquiries.count_documents({"status": "new"})
    contacted = await db.enquiries.count_documents({"status": "contacted"})
    closed = await db.enquiries.count_documents({"status": "closed"})
    
    return {
        "total": total,
        "new": new,
        "contacted": contacted,
        "closed": closed
    }

# ============== FAQ Admin Routes ==============

@api_router.post("/admin/faq", response_model=FAQItem)
async def create_faq(faq: FAQItem, admin: str = Depends(verify_admin)):
    """Create FAQ item (admin only)"""
    doc = faq.model_dump()
    await db.faqs.insert_one(doc)
    return faq

@api_router.delete("/admin/faq/{faq_id}")
async def delete_faq(faq_id: str, admin: str = Depends(verify_admin)):
    """Delete FAQ item (admin only)"""
    result = await db.faqs.delete_one({"id": faq_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="FAQ not found")
    return {"message": "FAQ deleted"}

# ============== Seed Data ==============

@api_router.post("/admin/seed-faq")
async def seed_faq(admin: str = Depends(verify_admin)):
    """Seed default FAQ items"""
    default_faqs = [
        {
            "id": str(uuid.uuid4()),
            "question": "What is the minimum order quantity?",
            "answer": "Our minimum order starts at 50 units. For first-time buyers, we recommend starting with a smaller batch to establish the working relationship.",
            "order": 1
        },
        {
            "id": str(uuid.uuid4()),
            "question": "What payment methods do you accept?",
            "answer": "We accept bank transfers (SEPA for EU, SWIFT for international), and can discuss other payment arrangements for established partners.",
            "order": 2
        },
        {
            "id": str(uuid.uuid4()),
            "question": "How does your grading system work?",
            "answer": "We use clear grading: New (factory sealed), Like New/Activated (opened but pristine, may have been activated), and A+ (excellent condition, minimal signs of use). All units are data cleared with IMEI recording.",
            "order": 3
        },
        {
            "id": str(uuid.uuid4()),
            "question": "Do you provide warranty?",
            "answer": "Warranty terms depend on the product grade and batch. Brand New and CPO come with manufacturer warranty. Pre-owned grades typically include a DOA (Dead on Arrival) protection period.",
            "order": 4
        },
        {
            "id": str(uuid.uuid4()),
            "question": "Can you ship internationally?",
            "answer": "Yes, we ship to Europe, UAE/GCC, USA, and other regions. We handle export documentation and can arrange DDP or DAP shipping based on your preference.",
            "order": 5
        },
        {
            "id": str(uuid.uuid4()),
            "question": "How quickly can you fulfill orders?",
            "answer": "Standard orders ship within 24-48 hours of payment confirmation. Larger orders may require 3-5 business days for processing and quality checks.",
            "order": 6
        }
    ]
    
    # Clear existing and insert new
    await db.faqs.delete_many({})
    await db.faqs.insert_many(default_faqs)
    
    return {"message": "FAQ seeded successfully", "count": len(default_faqs)}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
