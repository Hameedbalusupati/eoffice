from sqlalchemy.orm import declarative_base

Base = declarative_base()


# =========================
# IMPORT ALL MODELS
# =========================
def import_models():
    import models.user
    import models.activity
    import models.academics
    import models.correspondence
    import models.employee
    import models.examination
    import models.library
    import models.placements


# =========================
# CREATE TABLES
# =========================
def init_db(engine):
    import_models()
    Base.metadata.create_all(bind=engine)