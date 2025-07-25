from fastapi import FastAPI, UploadFile, File, Form, Path
import csv
import shutil
app = FastAPI()

@app.get("/")
def health_check():
    return {"status": "ok", "test": 12345}


from fastapi.middleware.cors import CORSMiddleware

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, ServiceRequest, Customer, Vehicle
import os

# SQLite connection URL
DATABASE_URL = "sqlite:///./adwita_agros.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)




# Add test data if database is empty
from sqlalchemy.orm import Session
def add_test_data():
    db = SessionLocal()
    if db.query(ServiceRequest).count() == 0:
        # Add a customer
        customer = Customer(name="Ravi Kumar", contact_number="9876543210", email="ravi@example.com", address="Village 1")
        db.add(customer)
        db.commit()
        db.refresh(customer)
        # Add a vehicle
        import datetime
        vehicle = Vehicle(customer_id=customer.id, chassis_number="CHS1234567", engine_number="ENG987654", purchase_date=datetime.date(2024, 1, 15))
        db.add(vehicle)
        db.commit()
        db.refresh(vehicle)
        # Add a service request with all required fields
        sr = ServiceRequest(
            ticket_number="SR-00000001",
            vehicle_id=vehicle.id,
            customer_id=customer.id,
            request_type="Oilchange/Service",
            request_status="pending",
            warranty_status="valid",
            description="Routine oil change needed.",
            location="Village 1",
            alternate_contact="9876543211",
            created_at=datetime.datetime(2025, 7, 1, 10, 0, 0),
            updated_at=datetime.datetime(2025, 7, 1, 10, 0, 0),
            service_date=datetime.datetime(2025, 7, 1, 10, 0, 0),
            claim_number="CLM-12345",
            hours=1200,
            engine_number="ENG987654",
            chassis_number="CHS1234567"
        )
        db.add(sr)
        db.commit()
        db.refresh(sr)
        # Add a spare part usage
        part_usage = sr.spare_parts_used
        spu = ServiceRequest.spare_parts_used.property.mapper.class_(
            service_request_id=sr.id,
            part_code="PC-001",
            part_name="Oil Filter",
            quantity_used=1,
            who_gave_parts="Adwitha",
            old_parts_location="warehouse",
            manufacturer_replacement_status="replaced"
        )
        db.add(spu)
        db.commit()
        db.close()

add_test_data()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:3000"] for more security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {"status": "ok"}

# --- CRUD Endpoints ---
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from models import Customer, Vehicle, ServiceRequest
from pydantic import BaseModel
from typing import List, Optional
import datetime

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Pydantic Schemas ---
class CustomerCreate(BaseModel):
    name: str
    contact_number: str
    email: Optional[str] = None
    address: Optional[str] = None

class CustomerOut(CustomerCreate):
    id: int
    class Config:
        orm_mode = True

class VehicleCreate(BaseModel):
    customer_id: int
    chassis_number: str
    engine_number: Optional[str] = None
    purchase_date: Optional[datetime.date] = None

class VehicleOut(VehicleCreate):
    id: int
    class Config:
        orm_mode = True

class ServiceRequestCreate(BaseModel):
    vehicle_id: int
    customer_id: int
    request_type: str
    description: Optional[str] = None
    location: Optional[str] = None
    alternate_contact: Optional[str] = None

class ServiceRequestOut(ServiceRequestCreate):
    id: int
    ticket_number: str
    request_status: Optional[str] = None
    warranty_status: Optional[str] = None
    created_at: Optional[datetime.datetime] = None
    updated_at: Optional[datetime.datetime] = None
    class Config:
        orm_mode = True

# --- Customer Endpoints ---
@app.post("/customers/", response_model=CustomerOut)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    db_customer = Customer(**customer.dict())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer

@app.get("/customers/", response_model=List[CustomerOut])
def list_customers(db: Session = Depends(get_db)):
    return db.query(Customer).all()

# --- Vehicle Endpoints ---
@app.post("/vehicles/", response_model=VehicleOut)
def create_vehicle(vehicle: VehicleCreate, db: Session = Depends(get_db)):
    db_vehicle = Vehicle(**vehicle.dict())
    db.add(db_vehicle)
    db.commit()
    db.refresh(db_vehicle)
    return db_vehicle

@app.get("/vehicles/", response_model=List[VehicleOut])
def list_vehicles(db: Session = Depends(get_db)):
    return db.query(Vehicle).all()

# --- ServiceRequest Endpoints ---
import random, string
def generate_ticket_number():
    return 'SR-' + ''.join(random.choices(string.digits, k=8))

@app.post("/service-requests/", response_model=ServiceRequestOut)
def create_service_request(request: ServiceRequestCreate, db: Session = Depends(get_db)):
    ticket_number = generate_ticket_number()
    db_request = ServiceRequest(
        **request.dict(),
        ticket_number=ticket_number,
        request_status='pending',
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow()
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request


# Custom response to include part usage fields
from fastapi.responses import JSONResponse
from models import SparePartUsage
@app.get("/service-requests/")
def list_service_requests(db: Session = Depends(get_db)):
    results = []
    for sr in db.query(ServiceRequest).all():
        spu = sr.spare_parts_used[0] if sr.spare_parts_used else None
        def dt(val):
            return val.isoformat() if val else ""
        # Split photos and videos into arrays
        photo_list = [p for p in (sr.photos or '').split(',') if p]
        video_list = [v for v in (sr.videos or '').split(',') if v]
        results.append({
            "id": sr.id,
            "ticket_number": sr.ticket_number,
            "customer_id": sr.customer_id,
            "vehicle_id": sr.vehicle_id,
            "request_type": sr.request_type,
            "request_status": sr.request_status,
            "warranty_status": sr.warranty_status,
            "description": sr.description,
            "location": sr.location,
            "alternate_contact": sr.alternate_contact,
            "created_at": dt(sr.created_at),
            "updated_at": dt(sr.updated_at),
            "service_date": dt(sr.service_date),
            "claim_number": sr.claim_number,
            "hours": sr.hours,
            "engine_number": sr.engine_number,
            "chassis_number": sr.chassis_number,
            # Part usage fields
            "part_code": spu.part_code if spu else "",
            "part_name": spu.part_name if spu else "",
            "quantity": spu.quantity_used if spu else "",
            "who_gave_parts": spu.who_gave_parts if spu else "",
            "old_parts_location": spu.old_parts_location if spu else "",
            "manufacturer_replacement_status": spu.manufacturer_replacement_status if spu else "",
            # Media fields
            "photos": photo_list,
            "videos": video_list
        })
    print("First 5 service requests returned to frontend:")
    for row in results[:5]:
        print(row)
    return JSONResponse(content=results)


@app.post("/import-csv/")
async def import_csv(file: UploadFile = File(...)):
    db = SessionLocal()
    # Ensure a default customer and vehicle exist for legacy import
    default_customer = db.query(Customer).filter_by(name='Bulk Import Customer').first()
    if not default_customer:
        default_customer = Customer(name='Bulk Import Customer', contact_number='0000000000', email='bulkimport@example.com', address='Bulk Import')
        db.add(default_customer)
        db.commit()
        db.refresh(default_customer)
    default_vehicle = db.query(Vehicle).filter_by(chassis_number='BULKIMPORTCHASSIS').first()
    if not default_vehicle:
        default_vehicle = Vehicle(customer_id=default_customer.id, chassis_number='BULKIMPORTCHASSIS', engine_number='BULKIMPORTENGINE', purchase_date=None)
        db.add(default_vehicle)
        db.commit()
        db.refresh(default_vehicle)
    content = await file.read()
    try:
        decoded = content.decode('utf-8').splitlines()
    except UnicodeDecodeError:
        decoded = content.decode('latin-1').splitlines()
    reader = csv.DictReader(decoded)
    imported = 0
    errors = []
    first_row_keys_printed = False
    for idx, row in enumerate(reader, start=2):
        if not first_row_keys_printed:
            print('CSV first row keys:', list(row.keys()))
            first_row_keys_printed = True
        # Skip row if all relevant fields are empty
        if not any([
            row.get('CUSTOMER Name', '').strip(),
            row.get('Engine Number', '').strip(),
            row.get('Chasis Number', '').strip(),
            row.get('CLAIM NO', '').strip(),
            row.get('HOURS', '').strip(),
            row.get('PART CODE', '').strip(),
            row.get('PART NAME', '').strip(),
            row.get('QTY', '').strip(),
            row.get('WHO GIVE THE PARTS', '').strip(),
            row.get('OLD PARTS location', '').strip(),
            row.get('Part replacement my manufacturer', '').strip()
        ]):
            continue
        try:
            import random
            unique_suffix = f"{idx}{random.randint(1000,9999)}"
            import datetime
            # Parse date
            date_str = row.get('DATE', '').strip()
            service_date = None
            if date_str:
                for fmt in ("%Y-%m-%dT%H:%M:%S", "%Y/%m/%d", "%Y-%m-%d", "%d/%m/%Y"):
                    try:
                        service_date = datetime.datetime.strptime(date_str, fmt)
                        break
                    except Exception:
                        continue
            # Parse hours
            hours_val = row.get('HOURS')
            hours = None
            if hours_val and hours_val.strip():
                try:
                    num = float(hours_val)
                    hours = round(num)
                except Exception:
                    hours = None
            # Parse quantity
            qty_val = row.get('QTY')
            quantity_used = None
            if qty_val and qty_val.strip():
                try:
                    quantity_used = int(float(qty_val))
                except Exception:
                    quantity_used = None
            sr = ServiceRequest(
                ticket_number=f"SR-{unique_suffix}",
                customer_id=default_customer.id,
                vehicle_id=default_vehicle.id,
                request_type=row.get('REQUEST TYPE', '') or '',
                request_status=row.get('REQUEST STATUS', 'pending') or 'pending',
                warranty_status=row.get('WARRANTY STATUS', '') or '',
                description=row.get('CUSTOMER Name', '') or row.get('CUSTOMER', '') or row.get('CUSTOMER_NAME', '') or 'Imported',
                location=row.get('LOCATION', '') or '',
                alternate_contact=row.get('ALTERNATE CONTACT', '') or '',
                created_at=None,
                updated_at=None,
                service_date=service_date,
                claim_number=row.get('CLAIM NO', '') or '',
                hours=hours,
                engine_number=row.get('Engine Number', '') or row.get('ENGINE NUMBER', '') or '',
                chassis_number=row.get('Chasis Number', '') or row.get('CHASIS NUMBER', '') or '',
            )
            db.add(sr)
            db.flush()  # get sr.id
            spu = SparePartUsage(
                service_request_id=sr.id,
                part_code=row.get('PART CODE', '') or '',
                part_name=row.get('PART NAME', '') or '',
                quantity_used=quantity_used,
                who_gave_parts=row.get('WHO GIVE THE PARTS', '') or '',
                old_parts_location=row.get('OLD PARTS location', '') or '',
                manufacturer_replacement_status=row.get('Part replacement my manufacturer', '') or ''
            )
            db.add(spu)
            imported += 1
        except Exception as e:
            errors.append(f"Row {idx}: {str(e)}")
    db.commit()
    db.close()
    if errors:
        return {"imported": imported, "errors": errors}
    return {"imported": imported}


@app.post("/public-service-request/")
async def public_service_request(
    request_type: str = Form(...),
    name: str = Form(...),
    chassis_number: str = Form(...),
    location: Optional[str] = Form(None),
    alternate_contact: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    photo_chassis: Optional[UploadFile] = File(None),
    media_issue: Optional[List[UploadFile]] = File(None),
):
    db = SessionLocal()
    # Find or create customer
    customer = db.query(Customer).filter_by(name=name).first()
    if not customer:
        customer = Customer(name=name, contact_number=alternate_contact or '', email=None, address=location or '')
        db.add(customer)
        db.commit()
        db.refresh(customer)
    # Find or create vehicle
    vehicle = db.query(Vehicle).filter_by(chassis_number=chassis_number).first()
    if not vehicle:
        vehicle = Vehicle(customer_id=customer.id, chassis_number=chassis_number, engine_number=None, purchase_date=None)
        db.add(vehicle)
        db.commit()
        db.refresh(vehicle)
    # Warranty check
    import datetime
    warranty_status = 'unknown'
    if vehicle.purchase_date:
        warranty_period = datetime.timedelta(days=365)  # 1 year warranty
        if vehicle.purchase_date + warranty_period > datetime.date.today():
            warranty_status = 'valid'
        else:
            warranty_status = 'expired'
    else:
        warranty_status = 'unknown'
    # Handle file uploads
    import os
    if not os.path.exists('media'):
        os.makedirs('media')
    photo_chassis_path = None
    if photo_chassis:
        photo_chassis_path = f"media/chassis_{chassis_number}_{photo_chassis.filename}"
        with open(photo_chassis_path, "wb") as buffer:
            shutil.copyfileobj(photo_chassis.file, buffer)
    media_issue_paths = []
    if media_issue:
        for file in media_issue:
            file_path = f"media/issue_{chassis_number}_{file.filename}"
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            media_issue_paths.append(file_path)
    # Create service request
    ticket_number = generate_ticket_number()
    sr = ServiceRequest(
        ticket_number=ticket_number,
        vehicle_id=vehicle.id,
        customer_id=customer.id,
        request_type=request_type,
        request_status='pending',
        description=description,
        location=location,
        alternate_contact=alternate_contact,
        created_at=datetime.datetime.utcnow(),
        updated_at=datetime.datetime.utcnow(),
        chassis_number=chassis_number,
        photos=photo_chassis_path or '',
        videos=','.join(media_issue_paths) if media_issue_paths else '',
        warranty_status=warranty_status
    )
    db.add(sr)
    db.commit()
    db.refresh(sr)
    db.close()
    return JSONResponse(content={"success": True, "ticket_number": ticket_number, "warranty_status": warranty_status})

from models import Inventory
from pydantic import BaseModel

class InventoryItemIn(BaseModel):
    part_code: str
    part_name: str
    quantity: int
    location: str

class InventoryItemOut(InventoryItemIn):
    id: int
    class Config:
        orm_mode = True

@app.get("/inventory/", response_model=List[InventoryItemOut])
def list_inventory(db: Session = Depends(get_db)):
    return db.query(Inventory).all()

@app.post("/inventory/", response_model=InventoryItemOut)
def add_inventory(item: InventoryItemIn, db: Session = Depends(get_db)):
    db_item = Inventory(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.put("/inventory/{item_id}", response_model=InventoryItemOut)
def update_inventory(item_id: int = Path(...), item: InventoryItemIn = None, db: Session = Depends(get_db)):
    db_item = db.query(Inventory).filter_by(id=item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    for key, value in item.dict().items():
        setattr(db_item, key, value)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/inventory/{item_id}")
def delete_inventory(item_id: int = Path(...), db: Session = Depends(get_db)):
    db_item = db.query(Inventory).filter_by(id=item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"success": True}

from models import SparePartUsage

class SparePartUsageIn(BaseModel):
    part_code: str
    part_name: str
    quantity_used: int
    who_gave_parts: str = ''
    old_parts_location: str = ''
    manufacturer_replacement_status: str = ''

class SparePartUsageOut(SparePartUsageIn):
    id: int
    class Config:
        orm_mode = True

@app.get("/service-requests/{request_id}/parts", response_model=List[SparePartUsageOut])
def list_parts_used(request_id: int, db: Session = Depends(get_db)):
    return db.query(SparePartUsage).filter_by(service_request_id=request_id).all()

@app.post("/service-requests/{request_id}/parts", response_model=SparePartUsageOut)
def add_part_used(request_id: int, part: SparePartUsageIn, db: Session = Depends(get_db)):
    # Deduct from inventory
    inventory = db.query(Inventory).filter_by(part_code=part.part_code).first()
    if inventory and inventory.quantity >= part.quantity_used:
        inventory.quantity -= part.quantity_used
    elif inventory:
        raise HTTPException(status_code=400, detail="Not enough inventory for this part.")
    db_part = SparePartUsage(service_request_id=request_id, **part.dict())
    db.add(db_part)
    db.commit()
    db.refresh(db_part)
    return db_part

@app.put("/service-requests/{request_id}/parts/{part_usage_id}", response_model=SparePartUsageOut)
def update_part_used(request_id: int, part_usage_id: int, part: SparePartUsageIn, db: Session = Depends(get_db)):
    db_part = db.query(SparePartUsage).filter_by(id=part_usage_id, service_request_id=request_id).first()
    if not db_part:
        raise HTTPException(status_code=404, detail="Part usage not found")
    # Adjust inventory if quantity changes
    inventory = db.query(Inventory).filter_by(part_code=part.part_code).first()
    if inventory:
        diff = part.quantity_used - (db_part.quantity_used or 0)
        if inventory.quantity < diff:
            raise HTTPException(status_code=400, detail="Not enough inventory for this part.")
        inventory.quantity -= diff
    for key, value in part.dict().items():
        setattr(db_part, key, value)
    db.commit()
    db.refresh(db_part)
    return db_part

@app.delete("/service-requests/{request_id}/parts/{part_usage_id}")
def delete_part_used(request_id: int, part_usage_id: int, db: Session = Depends(get_db)):
    db_part = db.query(SparePartUsage).filter_by(id=part_usage_id, service_request_id=request_id).first()
    if not db_part:
        raise HTTPException(status_code=404, detail="Part usage not found")
    # Return quantity to inventory
    inventory = db.query(Inventory).filter_by(part_code=db_part.part_code).first()
    if inventory:
        inventory.quantity += db_part.quantity_used or 0
    db.delete(db_part)
    db.commit()
    return {"success": True}
