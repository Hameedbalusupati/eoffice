"""
constants/activities.py

👉 Stores all module activities
👉 Used to initialize DB activities
"""

# =========================
# 📚 ACADEMICS
# =========================
ACADEMICS_ACTIVITIES = [
    "absentees_report",
    "academic_register",
    "assignments",
    "attendance_reports",
    "batches",
    "counseling",
    "time_table",
    "electives",
    "extra_class",
    "faculty",
    "faculty_adjustments",
    "internal_marks",
    "leaves",
    "lesson_plan",
    "projects",
    "resources",
    "student",
    "student_profile",
    "teaching_assignments",
    "teaching_load",
    "teaching_plan",
    "teaching_schedule",
    "upload_resource",
    "circulars",
    "library_books",
    "leaves_history"
]

# =========================
# 📬 CORRESPONDENCE
# =========================
CORRESPONDENCE_ACTIVITIES = [
    "complaint_suggestion",
    "greetings",
    "inbox",
    "sms_exam_attendance",
    "sms_marks_attendance",
    "sms_parent_student",
    "sms_staff",
    "staff_list",
    "students_list",
    "circulars",
    "library_books",
    "leaves_history"
]

# =========================
# 👨‍💼 EMPLOYEE
# =========================
EMPLOYEE_ACTIVITIES = [
    "additional_work",
    "employee_search",
    "search_report",
    "staff_vs_courses",
    "circulars",
    "library_books",
    "leaves_history"
]

# =========================
# 📝 EXAMINATIONS
# =========================
EXAMINATION_ACTIVITIES = [
    "external_time_table",
    "external_hall_tickets",
    "external_seating",
    "external_invigilation",
    "external_marks_upload",
    "external_reports",
    "internal_analysis",
    "internal_reports",
    "circulars",
    "library_books",
    "leaves_history"
]

# =========================
# 🎯 PLACEMENTS
# =========================
PLACEMENTS_ACTIVITIES = [
    "companies",
    "internship_report",
    "internship_details",
    "internship_status",
    "offers",
    "placement_report",
    "internship_report_view",
    "offer_report",
    "student_performance",
    "circulars",
    "library_books",
    "leaves_history"
]

# =========================
# 📚 LIBRARY (ADD THIS BACK ✅)
# =========================
LIBRARY_ACTIVITIES = [
    "books_list",
    "journals",
    "search",
    "new_arrivals",
    "circulars",
    "library_books",
    "leaves_history"
]

# =========================
# 🔥 MASTER DICTIONARY
# =========================
ALL_ACTIVITIES = {
    "academics": ACADEMICS_ACTIVITIES,
    "correspondence": CORRESPONDENCE_ACTIVITIES,
    "employee": EMPLOYEE_ACTIVITIES,
    "examinations": EXAMINATION_ACTIVITIES,
    "placements": PLACEMENTS_ACTIVITIES,
    "library": LIBRARY_ACTIVITIES,
}

# =========================
# 🔍 HELPER FUNCTIONS
# =========================
def get_all_modules():
    return list(ALL_ACTIVITIES.keys())


def get_activities_by_module(module: str):
    return ALL_ACTIVITIES.get(module, [])


def is_valid_activity(module: str, activity: str):
    return activity in ALL_ACTIVITIES.get(module, [])


# =========================
# 🔥 INITIALIZE ACTIVITIES
# =========================
def initialize_faculty_activities(db, faculty_id, ActivityModel):
    """
    Create default activities for new user
    """

    # 🔍 Fetch existing once (OPTIMIZED)
    existing = db.query(ActivityModel).filter(
        ActivityModel.faculty_id == faculty_id
    ).all()

    existing_set = {
        (act.module, act.activity_name)
        for act in existing
    }

    new_data = []

    for module, activities in ALL_ACTIVITIES.items():
        for activity in activities:
            if (module, activity) not in existing_set:
                new_data.append(
                    ActivityModel(
                        faculty_id=faculty_id,
                        module=module,
                        activity_name=activity,
                        status=False
                    )
                )

    if new_data:
        db.bulk_save_objects(new_data)

    db.commit()