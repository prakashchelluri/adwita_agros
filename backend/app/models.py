# Database schema for Adwita Agros Service Application
# Using SQLAlchemy ORM models (can be adapted for PostgreSQL/MySQL)

from sqlalchemy import Column, Integer, String, Date, ForeignKey, Boolean, Text, DateTime
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class Customer(Base):
    __tablename__ = 'customers'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    email = Column(String)
    address = Column(Text)
    vehicles = relationship('Vehicle', back_populates='customer')

class Vehicle(Base):
    __tablename__ = 'vehicles'
    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'))
    chassis_number = Column(String, unique=True, nullable=False)
    engine_number = Column(String)
    purchase_date = Column(Date)
    service_history = relationship('ServiceRequest', back_populates='vehicle')
    customer = relationship('Customer', back_populates='vehicles')


class ServiceRequest(Base):
    __tablename__ = 'service_requests'
    id = Column(Integer, primary_key=True)
    ticket_number = Column(String, unique=True, nullable=False)
    vehicle_id = Column(Integer, ForeignKey('vehicles.id'))
    customer_id = Column(Integer, ForeignKey('customers.id'))
    request_type = Column(String)
    request_status = Column(String)
    warranty_status = Column(String)
    description = Column(Text)
    location = Column(String)
    alternate_contact = Column(String)
    created_at = Column(DateTime)
    updated_at = Column(DateTime)
    service_date = Column(DateTime)  # Service DATE
    claim_number = Column(String)    # CLAIM NO
    hours = Column(Integer)          # HOURS
    engine_number = Column(String)   # ENGINE Number
    chassis_number = Column(String)  # CHASSIS NO
    photos = Column(Text)  # Comma-separated file paths or URLs
    videos = Column(Text)  # Comma-separated file paths or URLs
    technician_id = Column(Integer, ForeignKey('technicians.id'))
    manufacturer_status = Column(String)  # approved/rejected/pending
    manufacturer_response = Column(Text)
    spare_parts_used = relationship('SparePartUsage', back_populates='service_request')
    vehicle = relationship('Vehicle', back_populates='service_history')
    customer = relationship('Customer')
    technician = relationship('Technician')

class Inventory(Base):
    __tablename__ = 'inventory'
    id = Column(Integer, primary_key=True)
    part_code = Column(String, unique=True, nullable=False)
    part_name = Column(String, nullable=False)
    quantity = Column(Integer, default=0)
    location = Column(String)


class SparePartUsage(Base):
    __tablename__ = 'spare_part_usage'
    id = Column(Integer, primary_key=True)
    service_request_id = Column(Integer, ForeignKey('service_requests.id'))
    part_code = Column(String, ForeignKey('inventory.part_code'))
    part_name = Column(String)  # PART NAME
    quantity_used = Column(Integer)  # QTY
    who_gave_parts = Column(String)  # WHO GAVE THE PARTS (Adwitha/Warehouse)
    old_parts_location = Column(String)  # OLD PARTS location (warehouse/Adwit)
    manufacturer_replacement_status = Column(String)  # IF Manufacturer GIVEN replaced spare/pending
    received_from_manufacturer = Column(Boolean, default=False)
    service_request = relationship('ServiceRequest', back_populates='spare_parts_used')
    inventory = relationship('Inventory')

class Technician(Base):
    __tablename__ = 'technicians'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    contact_number = Column(String)
    email = Column(String)

class Manufacturer(Base):
    __tablename__ = 'manufacturers'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String)

# Feedback table can be added for customer feedback
class Feedback(Base):
    __tablename__ = 'feedback'
    id = Column(Integer, primary_key=True)
    service_request_id = Column(Integer, ForeignKey('service_requests.id'))
    customer_id = Column(Integer, ForeignKey('customers.id'))
    rating = Column(Integer)
    comments = Column(Text)
    created_at = Column(DateTime)
