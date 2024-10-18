import pandas as pd
import os

# Paths for raw, prep, and report folders
raw_path = r'C:\Users\SuryaPandiM\Desktop\full_final_project\dataengineering\raw'
prep_path = r'C:\Users\SuryaPandiM\Desktop\full_final_project\dataengineering\prep'
report_path = r'C:\Users\SuryaPandiM\Desktop\full_final_project\dataengineering\reporting'

# Create folders if they do not exist
os.makedirs(raw_path, exist_ok=True)
os.makedirs(prep_path, exist_ok=True)
os.makedirs(report_path, exist_ok=True)


# Step 1: Load the raw data (RAW Layer)
users = pd.read_csv(r'C:\Users\SuryaPandiM\Desktop\full_final_project\fakedata\users.csv')
courses = pd.read_csv(r'C:\Users\SuryaPandiM\Desktop\full_final_project\fakedata\courses.csv')
enrollments = pd.read_csv(r'C:\Users\SuryaPandiM\Desktop\full_final_project\fakedata\enrollments.csv')
course_completions = pd.read_csv(r'C:\Users\SuryaPandiM\Desktop\full_final_project\fakedata\course_completions.csv')
learning_paths = pd.read_csv(r'C:\Users\SuryaPandiM\Desktop\full_final_project\fakedata\learning_paths.csv')
performance_metrics = pd.read_csv(r'C:\Users\SuryaPandiM\Desktop\full_final_project\fakedata\performance_metrics.csv')

# Save raw data to raw folder
users.to_csv(os.path.join(raw_path, 'users_raw.csv'), index=False)
courses.to_csv(os.path.join(raw_path, 'courses_raw.csv'), index=False)
enrollments.to_csv(os.path.join(raw_path, 'enrollments_raw.csv'), index=False)
course_completions.to_csv(os.path.join(raw_path, 'course_completions_raw.csv'), index=False)
learning_paths.to_csv(os.path.join(raw_path, 'learning_paths_raw.csv'), index=False)
performance_metrics.to_csv(os.path.join(raw_path, 'performance_metrics_raw.csv'), index=False)

# Step 2: Data cleaning and transformation (PREP Layer)
# Remove unwanted columns
users_clean = users.drop(columns=['password', 'email'])
enrollments_clean = enrollments.drop(columns=['lastUpdated'])
courses_clean = courses.drop(columns=['description'])
course_completions_clean = course_completions.drop(columns=['certificateLink'])  # Example clean-up

# Save cleaned data to prep folder
users_clean.to_csv(os.path.join(prep_path, 'users_prep.csv'), index=False)
courses_clean.to_csv(os.path.join(prep_path, 'courses_prep.csv'), index=False)
enrollments_clean.to_csv(os.path.join(prep_path, 'enrollments_prep.csv'), index=False)
course_completions_clean.to_csv(os.path.join(prep_path, 'course_completions_prep.csv'), index=False)
learning_paths.to_csv(os.path.join(prep_path, 'learning_paths_prep.csv'), index=False)
performance_metrics.to_csv(os.path.join(prep_path, 'performance_metrics_prep.csv'), index=False)

# Step 3: Join data (REPORT Layer)
# Join users, enrollments, courses, and performance metrics to create a report
merged_data = enrollments_clean.merge(users_clean, left_on='userId', right_on='employeeId', how='left')
merged_data = merged_data.merge(courses_clean, left_on='courseId', right_on='id', how='left')
merged_data = merged_data.merge(performance_metrics, on=['userId', 'courseId'], how='left')

# Save final merged report
merged_data.to_csv(os.path.join(report_path, 'final_report.csv'), index=False)

print("ETL process complete. Data is available in raw, prep, and report layers.")
