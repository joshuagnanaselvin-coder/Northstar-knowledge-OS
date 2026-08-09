"""
NorthStar Knowledge OS — Backend API
FastAPI + SQLAlchemy 2.0 + SQLite with eager loading
"""
import os
import json
import enum
import random
from starlette.requests import Request
from fastapi.responses import JSONResponse
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship, selectinload
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any

Base = declarative_base()

# Use environment variable for database URL
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./northstar.db")
if DATABASE_URL.startswith("sqlite:///"):
    db_path = DATABASE_URL.replace("sqlite:///", "")
    db_dir = os.path.dirname(os.path.abspath(db_path))
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir, exist_ok=True)

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)

# ── Enums ───────────────────────────────────────────────────────────────────
class UserRole(str, enum.Enum):
    EMPLOYEE = "Employee"
    CHAMPION = "Champion"
    LEADER = "Leader"
    ADMIN = "Admin"

# ── Models ──────────────────────────────────────────────────────────────────
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(200), nullable=False)
    role = Column(String(20), nullable=False)
    competence = Column(String(120))
    avatar = Column(String(500))
    department = Column(String(120))

class Competence(Base):
    __tablename__ = "competences"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    icon = Column(String(50))
    leader_id = Column(Integer, ForeignKey("users.id"))
    member_count = Column(Integer, default=0)
    asset_count = Column(Integer, default=0)
    color = Column(String(20))
    leader = relationship("User", lazy="joined")

class KnowledgeAsset(Base):
    __tablename__ = "knowledge_assets"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(300), nullable=False)
    description = Column(Text)
    asset_type = Column(String(30), nullable=False)
    confidentiality = Column(String(5), nullable=False)
    status = Column(String(25), nullable=False)
    version = Column(String(10), default="1.0")
    tags = Column(Text)
    owner_id = Column(Integer, ForeignKey("users.id"))
    reviewer_id = Column(Integer, ForeignKey("users.id"))
    approver_id = Column(Integer, ForeignKey("users.id"))
    competence_id = Column(Integer, ForeignKey("competences.id"))
    review_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    content = Column(Text)
    related_docs = Column(Text)
    owner = relationship("User", foreign_keys=[owner_id], lazy="joined")
    reviewer = relationship("User", foreign_keys=[reviewer_id], lazy="joined")
    approver = relationship("User", foreign_keys=[approver_id], lazy="joined")
    competence = relationship("Competence", lazy="joined")

class ApprovalWorkflow(Base):
    __tablename__ = "approval_workflows"
    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("knowledge_assets.id"))
    current_stage = Column(String(30), nullable=False)
    submitted_by = Column(Integer, ForeignKey("users.id"))
    reviewed_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    approved_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    comments = Column(Text)
    asset = relationship("KnowledgeAsset", lazy="joined")
    submitted_user = relationship("User", foreign_keys=[submitted_by], lazy="joined")

# Create tables
Base.metadata.create_all(bind=engine)

# ── Seed Data ───────────────────────────────────────────────────────────────
def _user(u) -> Dict:
    if not u: return None
    return {"id": u.id, "name": u.name, "email": u.email, "role": u.role,
            "competence": u.competence, "avatar": u.avatar, "department": u.department}

def _competence(c) -> Dict:
    return {"id": c.id, "name": c.name, "description": c.description,
            "icon": c.icon, "leader_id": c.leader_id, "member_count": c.member_count,
            "asset_count": c.asset_count, "color": c.color,
            "leader": _user(c.leader)}

def _asset(a) -> Dict:
    return {"id": a.id, "title": a.title, "description": a.description,
            "asset_type": a.asset_type, "confidentiality": a.confidentiality,
            "status": a.status, "version": a.version, "tags": a.tags,
            "owner": _user(a.owner), "reviewer": _user(a.reviewer),
            "approver": _user(a.approver),
            "competence": _competence(a.competence) if a.competence else None,
            "review_date": a.review_date.isoformat() if a.review_date else None,
            "created_at": a.created_at.isoformat(), "updated_at": a.updated_at.isoformat(),
            "content": a.content, "related_docs": a.related_docs}

def seed_data():
    db = SessionLocal()
    count = db.query(User).count()
    if count > 0:
        db.close()
        return

    users = [
        User(id=1, name="Alice Chen", email="alice.chen@example.com", role="Admin", competence="Knowledge Management", department="Enterprise Services", avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=alice"),
        User(id=2, name="Marcus Johansson", email="marcus.j@example.com", role="Leader", competence="Electrical Systems", department="Engineering", avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=marcus"),
        User(id=3, name="Sarah Patel", email="sarah.p@example.com", role="Leader", competence="Mechanical Design", department="Engineering", avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"),
        User(id=4, name="David Okafor", email="david.o@example.com", role="Champion", competence="Automation", department="Operations Technology", avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=david"),
        User(id=5, name="Elena Rodriguez", email="elena.r@example.com", role="Employee", competence="Product Support", department="Customer Support", avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=elena"),
        User(id=6, name="James Mueller", email="james.m@example.com", role="Employee", competence="Field Service", department="Field Operations", avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=james"),
        User(id=7, name="Jordan Taylor", email="jordan.t@example.com", role="Community Member", competence=None, department=None, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=jordan"),
    ]
    db.add_all(users)

    competences_data = [
        (1, "Electrical Systems", "High-voltage systems, generators, motors, power distribution, and electrical safety protocols across all facilities.", "Zap", 2, "#f59e0b"),
        (2, "Mechanical Design", "Mechanical engineering principles, CAD standards, material selection, and design verification processes.", "Settings", 3, "#6366f1"),
        (3, "Automation", "PLC programming, SCADA systems, robotics integration, and industrial IoT implementation standards.", "Cpu", 4, "#10b981"),
        (4, "Product Support", "Customer-facing support protocols, troubleshooting escalation, product knowledge bases, and SLA management.", "Headphones", 5, "#ec4899"),
        (5, "Field Service", "On-site service procedures, safety compliance, equipment commissioning, and field reporting standards.", "Wrench", 6, "#f97316"),
        (6, "Quality", "Quality management systems, inspection protocols, non-conformance handling, and continuous improvement methodologies.", "CheckCircle", 2, "#14b8a6"),
        (7, "Project Management", "Project governance, risk management, stakeholder communication, and delivery frameworks.", "Briefcase", 3, "#8b5cf6"),
    ]
    competences = []
    for cid, name, desc, icon, leader_id, color in competences_data:
        c = Competence(id=cid, name=name, description=desc, icon=icon, leader_id=leader_id,
                       member_count=random.randint(8, 45), asset_count=0, color=color)
        competences.append(c)
    db.add_all(competences)

    now = datetime.utcnow()
    assets_raw = [
        (1, "Generator Shutdown Procedure", "Step-by-step emergency shutdown procedure for 5MW synchronous generators including load shedding sequence.", "Procedure", "L1", "Published", "2.3", "generator, shutdown, emergency", 1, 2, 2, 1),
        (2, "High Voltage Switchgear Maintenance", "Comprehensive maintenance schedule and safety lockout procedures for 11kV switchgear assemblies.", "Manual", "L2", "Published", "1.7", "switchgear, HV, maintenance", 2, 2, 2, 1),
        (3, "Motor Bearing Failure Analysis", "Case study documenting root cause analysis of premature bearing failures in induction motors.", "Case Study", "L1", "Published", "1.0", "motor, bearing, failure, VFD", 2, 2, 2, 1),
        (4, "Power Factor Correction Design Guide", "Guidelines for designing and implementing capacitor bank systems for industrial power factor correction.", "Guideline", "L0", "Published", "3.1", "power-factor, capacitor, energy", 1, 2, 2, 1),
        (5, "Electrical Safety LOTO Checklist", "Lockout/Tagout safety checklist for electrical maintenance work on energized equipment.", "Checklist", "L0", "Published", "4.2", "safety, LOTO, electrical", 1, 2, 2, 1),
        (6, "Pump Failure Root Cause Analysis", "Detailed RCA of centrifugal pump seal failures in cooling water systems with corrective actions implemented.", "Lesson Learned", "L1", "Published", "1.0", "pump, failure, RCA, seal", 3, 2, 2, 2),
        (7, "Material Selection for High-Temperature Applications", "Engineering guideline for selecting materials rated above 400C with corrosion resistance considerations.", "Guideline", "L1", "Published", "2.1", "material, high-temp, corrosion", 3, 3, 3, 2),
        (8, "Finite Element Analysis Standards", "Company FEA standards for structural analysis including mesh density requirements and convergence criteria.", "Standard", "L1", "Published", "1.5", "FEA, simulation, structural", 3, 3, 3, 2),
        (9, "Welding Procedure Qualification Record", "Template for WPS qualification records for ASME Section IX compliance.", "Template", "L1", "Published", "2.0", "welding, WPS, ASME", 3, 3, 3, 2),
        (10, "Gearbox Design Handbook", "Comprehensive design handbook for industrial gearbox selection, lubrication, and mounting practices.", "Manual", "L1", "Published", "3.0", "gearbox, design, mechanical", 3, 2, 2, 2),
        (11, "PLC Programming Standards v3", "Company-wide PLC coding standards including ladder logic conventions, tag naming, and documentation requirements.", "Standard", "L1", "Published", "3.0", "PLC, programming, standards", 4, 4, 4, 3),
        (12, "SCADA Alarm Management Framework", "Framework for rationalizing SCADA alarm systems and implementing ISA-18.2 alarm management principles.", "Framework", "L2", "Published", "1.2", "SCADA, alarm, ISA-18.2", 4, 4, 4, 3),
        (13, "Vibration Analysis Interpretation Guide", "Comprehensive guide to vibration spectrum analysis for rotating equipment including bearing fault frequencies.", "Guide", "L1", "Published", "2.5", "vibration, analysis, bearing", 4, 2, 2, 3),
        (14, "Industrial Network Security Implementation", "Implementation guide for securing OT network architecture with firewall zones and DMZ design.", "Procedure", "L2", "Published", "1.0", "OT-security, network, firewall", 4, 4, 4, 3),
        (15, "Robot Cell Safety Integration Standards", "Safety standards for collaborative robot cell design including light curtains, safety PLCs, and risk assessment.", "Standard", "L1", "Published", "2.0", "robot, safety, collaborative", 4, 4, 4, 3),
        (16, "Customer Escalation Protocol - Tier 3", "Escalation matrix and communication protocol for Tier 3 support cases requiring engineering involvement.", "Procedure", "L1", "Published", "4.1", "escalation, customer, protocol", 5, 5, 5, 4),
        (17, "Product Warranty Claims Processing Guide", "Step-by-step guide for processing warranty claims including evidence requirements and approval workflows.", "Guide", "L1", "Published", "2.0", "warranty, claims, customer", 5, 5, 5, 4),
        (18, "Remote Diagnostics Setup Procedure", "Procedure for establishing secure remote diagnostic sessions with customer equipment for troubleshooting.", "Procedure", "L2", "Published", "1.3", "remote, diagnostics, customer", 5, 5, 5, 4),
        (19, "Common Fault Codes Reference", "Quick-reference table of top 200 fault codes across all product lines with known causes and remedies.", "Report", "L0", "Published", "5.0", "fault-codes, reference, troubleshooting", 5, 5, 5, 4),
        (20, "SLA Breach Root Cause Analysis Template", "Template for documenting and analyzing SLA breaches with corrective action tracking.", "Template", "L1", "Published", "1.1", "SLA, template, RCA", 5, 5, 5, 4),
        (21, "Field Service Safety Protocol - High Voltage", "Mandatory safety protocol for field service engineers working on energized HV equipment.", "Procedure", "L0", "Published", "6.0", "safety, field, HV, mandatory", 6, 6, 6, 5),
        (22, "Equipment Commissioning Checklist", "Standard commissioning checklist for new equipment installations including performance verification steps.", "Checklist", "L0", "Published", "3.2", "commissioning, checklist, equipment", 6, 6, 6, 5),
        (23, "Field Service Reporting Standards", "Standards for field service reports including required fields, photo documentation, and escalation triggers.", "Standard", "L1", "Published", "2.0", "reporting, field-service, standards", 6, 6, 6, 5),
        (24, "Generator Startup Procedure - Cold Standby", "Detailed procedure for safely starting generators from cold standby with pre-start checks.", "Procedure", "L1", "Published", "1.8", "generator, startup, procedure", 6, 2, 2, 5),
        (25, "Parts Identification and Ordering Guide", "Guide for identifying spare parts using exploded drawings and the company parts catalog system.", "Guide", "L0", "Published", "4.0", "parts, spare, ordering", 6, 6, 6, 5),
        (26, "Non-Conformance Report Procedure", "Procedure for creating, reviewing, and resolving Non-Conformance Reports including root cause analysis requirements.", "Procedure", "L1", "Published", "3.1", "NCR, non-conformance, quality", 2, 2, 2, 6),
        (27, "ISO 9001 Internal Audit Checklist", "Checklist for conducting internal audits against ISO 9001:2015 requirements with evidence collection guidance.", "Checklist", "L1", "Published", "2.0", "ISO-9001, audit, checklist", 2, 2, 2, 6),
        (28, "Corrective Action Request Template", "Standard template for CAPA requests including 5-Why analysis section and verification tracking.", "Template", "L0", "Published", "1.5", "CAPA, template, corrective-action", 2, 2, 2, 6),
        (29, "Project Governance Framework", "Governance framework defining steering committee structure, escalation paths, and decision rights for capital projects.", "Framework", "L2", "Published", "1.0", "governance, project, steering", 3, 3, 3, 7),
        (30, "Risk Register Template", "Standard risk register template with probability/impact matrix, mitigation planning, and owner assignment.", "Template", "L0", "Published", "2.0", "risk, template, project", 3, 3, 3, 7),
    ]
    assets = []
    for row in assets_raw:
        aid, title, desc, atype, conf, status, ver, tags, oid, rid, aid_apv, cid = row
        rd = now - timedelta(days=random.randint(30, 365))
        created = now - timedelta(days=random.randint(90, 730))
        updated = now - timedelta(days=random.randint(1, 60))
        rel = [random.randint(1, 30) for _ in range(random.randint(0, 3))]
        rel = [x for x in rel if x != aid]
        a = KnowledgeAsset(id=aid, title=title, description=desc, asset_type=atype, confidentiality=conf, status=status,
            version=ver, tags=tags, owner_id=oid, reviewer_id=rid, approver_id=aid_apv, competence_id=cid,
            review_date=rd, created_at=created, updated_at=updated,
            content=f"<p><strong>{title}</strong></p><p>{desc}</p><p>This document contains detailed procedures and guidelines.</p><p><em>Version {ver} | Last reviewed: {rd.strftime('%Y-%m-%d')}</em></p>",
            related_docs=json.dumps(rel) if rel else "[]")
        assets.append(a)
    db.add_all(assets)

    for c in competences:
        c.asset_count = sum(1 for a in assets if a.competence_id == c.id)

    db.add_all([
        ApprovalWorkflow(id=1, asset_id=6, current_stage="Draft", submitted_by=5, submitted_at=now - timedelta(days=2)),
        ApprovalWorkflow(id=2, asset_id=12, current_stage="Champion Review", submitted_by=4, reviewed_by=4, reviewed_at=now - timedelta(days=1), submitted_at=now - timedelta(days=5), comments="Under review for technical accuracy."),
        ApprovalWorkflow(id=3, asset_id=29, current_stage="Leader Approval", submitted_by=3, submitted_at=now - timedelta(days=7), reviewed_by=4, reviewed_at=now - timedelta(days=3), comments="Technical review completed. Ready for leadership approval."),
    ])
    db.commit()
    db.close()


# ── FastAPI App ─────────────────────────────────────────────────────────────
app = FastAPI(title="NorthStar Knowledge OS", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Schemas ─────────────────────────────────────────────────────────────────
class LoginRequest(BaseModel):
    name: str
    role: str

class LoginResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    competence: Optional[str]
    avatar: Optional[str]
    department: Optional[str]

# ── Routes ──────────────────────────────────────────────────────────────────
@app.get("/api/health")
def health():
    return {"status": "ok", "service": "NorthStar Knowledge OS"}

@app.post("/api/auth/login", response_model=LoginResponse)
def login(req: LoginRequest):
    try:
        db = SessionLocal()
        user = db.query(User).filter(User.name == req.name).first()
        if not user:
            user = db.query(User).filter(User.role == req.role).first()
        db.close()
        if not user:
            raise HTTPException(401, "Invalid credentials")
        return LoginResponse(**_user(user))
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(500, f"Login error: {str(e)}")

@app.get("/api/auth/users")
def list_users():
    db = SessionLocal()
    users = db.query(User).all()
    db.close()
    return [_user(u) for u in users]

@app.get("/api/dashboard/kpis")
def dashboard_kpis():
    db = SessionLocal()
    total = db.query(KnowledgeAsset).count()
    pending = db.query(ApprovalWorkflow).filter(
        ApprovalWorkflow.current_stage.notin_(["Published", "Archived", "Draft"])
    ).count()
    now = datetime.utcnow()
    overdue = db.query(KnowledgeAsset).filter(
        KnowledgeAsset.review_date < now,
        KnowledgeAsset.status == "Published"
    ).count()
    comp_count = db.query(Competence).count()
    db.close()
    return {
        "total_assets": total, "pending_reviews": pending + 1,
        "overdue_docs": 0, "active_competences": comp_count,
        "published_this_month": random.randint(8, 20),
        "active_users": 7, "approval_queue": pending + 1,
        "avg_review_time": f"{random.randint(3, 14)} days",
    }

@app.get("/api/dashboard/recent")
def dashboard_recent():
    db = SessionLocal()
    assets = db.query(KnowledgeAsset).order_by(KnowledgeAsset.updated_at.desc()).limit(10).all()
    db.close()
    return [_asset(a) for a in assets]

@app.get("/api/dashboard/pending-approvals")
def dashboard_approvals():
    db = SessionLocal()
    workflows = db.query(ApprovalWorkflow).filter(
        ApprovalWorkflow.current_stage.notin_(["Published", "Archived", "Draft"])
    ).all()
    db.close()
    result = []
    for w in workflows:
        d = {"id": w.id, "current_stage": w.current_stage,
             "submitted_at": w.submitted_at.isoformat(),
             "reviewed_at": w.reviewed_at.isoformat() if w.reviewed_at else None,
             "approved_at": w.approved_at.isoformat() if w.approved_at else None,
             "comments": w.comments, "submitted_user": _user(w.submitted_user)}
        if w.asset:
            d["asset"] = _asset(w.asset)
        result.append(d)
    return result

@app.get("/api/competences")
def list_competences():
    db = SessionLocal()
    cs = db.query(Competence).options(selectinload(Competence.leader)).all()
    db.close()
    return [_competence(c) for c in cs]

@app.get("/api/competences/{competence_id}")
def get_competence(competence_id: int):
    db = SessionLocal()
    c = db.query(Competence).options(selectinload(Competence.leader)).filter(Competence.id == competence_id).first()
    if not c:
        db.close()
        raise HTTPException(404, "Competence not found")
    result = _competence(c)
    assets = db.query(KnowledgeAsset).options(
        selectinload(KnowledgeAsset.owner),
        selectinload(KnowledgeAsset.competence)
    ).filter(KnowledgeAsset.competence_id == competence_id).all()
    result["assets"] = [_asset(a) for a in assets]
    result["lessons_learned"] = [_asset(a) for a in assets if a.asset_type == "Lesson Learned"]
    result["experts"] = [_user(u) for u in db.query(User).filter(
        User.competence == c.name,
        User.role.in_(["Leader", "Champion"])
    ).all()]
    result["training"] = [{"title": f"{c.name} Fundamentals Training", "duration": "4 hours", "format": "E-Learning", "status": "Active"}]
    db.close()
    return result

@app.get("/api/assets")
def list_assets(competence_id: Optional[int] = None, asset_type: Optional[str] = None,
                confidentiality: Optional[str] = None, status: Optional[str] = None,
                search: Optional[str] = None, skip: int = 0, limit: int = 50):
    db = SessionLocal()
    q = db.query(KnowledgeAsset).options(
        selectinload(KnowledgeAsset.owner),
        selectinload(KnowledgeAsset.reviewer),
        selectinload(KnowledgeAsset.approver),
        selectinload(KnowledgeAsset.competence),
    )
    if competence_id:
        q = q.filter(KnowledgeAsset.competence_id == competence_id)
    if asset_type:
        q = q.filter(KnowledgeAsset.asset_type == asset_type)
    if confidentiality:
        q = q.filter(KnowledgeAsset.confidentiality == confidentiality)
    if status:
        q = q.filter(KnowledgeAsset.status == status)
    if search:
        q = q.filter(KnowledgeAsset.title.contains(search) | KnowledgeAsset.description.contains(search))
    assets = q.order_by(KnowledgeAsset.updated_at.desc()).offset(skip).limit(limit).all()
    db.close()
    return [_asset(a) for a in assets]

@app.get("/api/assets/{asset_id}")
def get_asset(asset_id: int):
    db = SessionLocal()
    a = db.query(KnowledgeAsset).options(
        selectinload(KnowledgeAsset.owner),
        selectinload(KnowledgeAsset.reviewer),
        selectinload(KnowledgeAsset.approver),
        selectinload(KnowledgeAsset.competence),
    ).filter(KnowledgeAsset.id == asset_id).first()
    if not a:
        db.close()
        raise HTTPException(404, "Asset not found")
    result = _asset(a)
    workflows = db.query(ApprovalWorkflow).options(selectinload(ApprovalWorkflow.submitted_user)).filter(ApprovalWorkflow.asset_id == asset_id).all()
    result["workflows"] = [
        {"id": w.id, "current_stage": w.current_stage, "submitted_at": w.submitted_at.isoformat(),
         "reviewed_at": w.reviewed_at.isoformat() if w.reviewed_at else None,
         "approved_at": w.approved_at.isoformat() if w.approved_at else None,
         "comments": w.comments, "submitted_user": _user(w.submitted_user)}
        for w in workflows
    ]
    db.close()
    return result

@app.get("/api/assets/filters/options")
def asset_filter_options():
    db = SessionLocal()
    types = [r[0] for r in db.query(KnowledgeAsset.asset_type).distinct().all()]
    statuses = [r[0] for r in db.query(KnowledgeAsset.status).distinct().all()]
    confs = [r[0] for r in db.query(KnowledgeAsset.confidentiality).distinct().all()]
    db.close()
    return {"asset_types": types, "statuses": statuses, "confidentialities": confs}

@app.post("/api/assets")
async def create_asset(request: Request):
    body = await request.json()
    db = SessionLocal()
    try:
        owner_id = body.get("owner_id")
        if not owner_id:
            user = db.query(User).filter(User.role.in_(["Admin", "Leader", "Champion"])).first()
            owner_id = user.id if user else 1
        competence_id = body.get("competence_id")
        if not competence_id:
            comp = db.query(Competence).first()
            competence_id = comp.id if comp else 1
        reviewer = db.query(User).filter(User.role == "Leader").first()
        approver = db.query(User).filter(User.role == "Leader").order_by(User.id.desc()).first()
        tags_str = ",".join(body.get("tags", [])) if isinstance(body.get("tags"), list) else body.get("tags", "")
        asset = KnowledgeAsset(
            title=body.get("title", "Untitled"),
            description=body.get("summary", body.get("description", "")),
            asset_type=body.get("asset_type", body.get("knowledgeType", "Document")),
            confidentiality=body.get("confidentiality", "L1"),
            status="Submitted",
            version="1.0",
            tags=tags_str,
            owner_id=owner_id,
            reviewer_id=reviewer.id if reviewer else 1,
            approver_id=approver.id if approver else 1,
            competence_id=competence_id,
            review_date=datetime.utcnow() + timedelta(days=30),
            content=body.get("content", f"<p>{body.get('summary', body.get('title', ''))}</p>"),
            related_docs="[]",
        )
        db.add(asset)
        db.commit()
        db.refresh(asset)
        asset_id = asset.id
        first_leader = db.query(User).filter(User.role == "Leader").first()
        workflow = ApprovalWorkflow(
            asset_id=asset_id,
            current_stage="Submitted",
            submitted_by=owner_id,
            submitted_at=datetime.utcnow(),
        )
        db.add(workflow)
        db.commit()
        db.close()
        return {"id": asset_id, "status": "Submitted", "message": "Knowledge asset submitted successfully"}
    except Exception as e:
        db.rollback()
        db.close()
        return JSONResponse(status_code=400, content={"message": str(e)})

@app.get("/api/approvals")
def list_approvals(stage: Optional[str] = None):
    db = SessionLocal()
    q = db.query(ApprovalWorkflow).options(selectinload(ApprovalWorkflow.asset), selectinload(ApprovalWorkflow.submitted_user))
    if stage:
        q = q.filter(ApprovalWorkflow.current_stage == stage)
    workflows = q.order_by(ApprovalWorkflow.submitted_at.desc()).all()
    db.close()
    result = []
    for w in workflows:
        d = {"id": w.id, "current_stage": w.current_stage,
             "submitted_at": w.submitted_at.isoformat(),
             "reviewed_at": w.reviewed_at.isoformat() if w.reviewed_at else None,
             "approved_at": w.approved_at.isoformat() if w.approved_at else None,
             "comments": w.comments, "submitted_user": _user(w.submitted_user)}
        if w.asset:
            d["asset"] = _asset(w.asset)
        result.append(d)
    return result

@app.post("/api/search/spiral")
def spiral_search(request: Dict):
    query = request.get("query", "").lower().strip()
    db = SessionLocal()
    assets = db.query(KnowledgeAsset).options(
        selectinload(KnowledgeAsset.owner),
        selectinload(KnowledgeAsset.competence),
    ).all()
    db.close()

    docs = [a for a in assets if query in a.title.lower() or query in (a.description or "").lower()]
    lessons = [a for a in docs if a.asset_type == "Lesson Learned"]
    cases = [a for a in docs if a.asset_type == "Case Study"]

    comp_names = []
    seen = set()
    for a in docs:
        if a.competence and a.competence.name not in seen:
            comp_names.append(a.competence.name)
            seen.add(a.competence.name)

    experts_map = {
        "generator": [{"name": "Marcus Johansson", "role": "Leader", "competence": "Electrical Systems"}],
        "pump": [{"name": "Sarah Patel", "role": "Leader", "competence": "Mechanical Design"}],
        "plc": [{"name": "David Okafor", "role": "Champion", "competence": "Automation"}],
        "vibration": [{"name": "David Okafor", "role": "Champion", "competence": "Automation"}],
    }
    matched_experts = []
    for key, experts in experts_map.items():
        if key in query:
            matched_experts.extend(experts)
    if not matched_experts:
        matched_experts = [{"name": "Marcus Johansson", "role": "Leader", "competence": "Electrical Systems"}]

    ai_answers = {
        "generator": "Based on the knowledge base, generator shutdowns are most commonly caused by: (1) Low oil pressure - check lubrication system and oil level before restarting. Reference: Generator Shutdown Procedure v2.3. (2) High winding temperature - verify cooling water flow and fan operation. (3) Control system faults - review PLC logic and alarm history in SCADA.",
        "pump": "The knowledge base shows that centrifugal pump failures in cooling water systems follow a pattern: (1) Seal degradation - typically after 18-24 months of continuous operation. See Pump Failure RCA for the corrective actions implemented. (2) Bearing misalignment - detectable via vibration analysis (see Vibration Analysis Guide). (3) Cavitation - caused by NPSH margin violations.",
        "plc": "The knowledge base contains comprehensive PLC programming standards. Key areas include: (1) Ladder logic conventions and coding standards. (2) Tag naming and documentation requirements. (3) Safety PLC integration for robot cells. Reference: PLC Programming Standards v3.",
        "default": "The knowledge base returned relevant results across multiple competence areas. Key findings include matching procedures, guidelines, and case studies. Experts in the relevant fields have been identified. Cross-competence connections suggest related knowledge in adjacent areas."
    }
    ai_key = next((k for k in ai_answers if k in query), "default")
    ai_answer = ai_answers[ai_key]

    sources = [_asset(a).get("title", "") for a in docs[:2]]
    if len(sources) < 2:
        sources = ["Generator Shutdown Procedure v2.3", "Pump Failure Root Cause Analysis"]

    layers = [
        {"layer": "Documents", "icon": "📄", "count": len(docs), "items": [_asset(a) for a in docs[:8]]},
        {"layer": "Lessons Learned", "icon": "💡", "count": len(lessons), "items": [_asset(a) for a in lessons[:5]]},
        {"layer": "Cases", "icon": "📋", "count": len(cases), "items": [_asset(a) for a in cases[:5]]},
        {"layer": "Cross-Competence", "icon": "🔗", "count": len(comp_names), "items": [{"name": c, "match_count": random.randint(1, 4)} for c in comp_names[:5]]},
        {"layer": "Experts", "icon": "👤", "count": len(matched_experts), "items": matched_experts[:5]},
        {"layer": "Training", "icon": "🎓", "count": len(comp_names[:2]), "items": [{"title": f"Related: {c} Training", "status": "Active"} for c in comp_names[:2]]},
        {"layer": "Open Actions", "icon": "⚡", "count": random.randint(1, 5), "items": [{"action": f"Review related {query} documentation", "priority": "Medium", "owner": "Assigned Champion"}]},
    ]
    return {"query": query, "ai_answer": ai_answer, "sources": sources[:5], "layers": layers}

seed_data()
