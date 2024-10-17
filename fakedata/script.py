import csv
import random
from faker import Faker
from datetime import datetime

fake = Faker()

num_users = 1000
num_courses = 50
num_enrollments = 1000
num_learning_paths = 10
num_performance_metrics = 1000


def random_joining_date():
    return fake.date_between(start_date='-5y', end_date='today')


def random_completion_date(enrollment_date_str):
    enrollment_date = datetime.strptime(enrollment_date_str, '%Y-%m-%d').date()
    return fake.date_between(start_date=enrollment_date, end_date=datetime.now().date())


def generate_users(num_users):
    users = []
    for i in range(1, num_users + 1):
        name = fake.name()
        employee_id = f"EMP{str(i).zfill(4)}"
        password = fake.password(length=8)
        email = fake.email()
        organization_domain_id = random.randint(1, 2)  
        role_id = random.randint(1, 2) 
        joining_date = random_joining_date().strftime('%Y-%m-%d')
        designation_id = random.randint(1, 2) 
        department_id = random.randint(1, 2) 
        users.append([name, employee_id, password, email, organization_domain_id, role_id, joining_date, designation_id, department_id])
    return users


def generate_courses(num_courses):
    courses = []
    for i in range(1, num_courses + 1):
        title = f"Course {i}"
        duration = random.randint(30, 120)  
        difficulty_level = random.choice(['Beginner', 'Intermediate', 'Advanced'])
        description = f"Description for {title}"
        organization_domain_id = random.randint(1, 2)
        courses.append([i, title, duration, difficulty_level, description, organization_domain_id])
    return courses

def generate_enrollments(num_enrollments, num_courses, num_users, num_learning_paths):
    enrollments = []
    for i in range(1, num_enrollments + 1):
        course_id = random.randint(1, num_courses)
        enrollment_date = random_joining_date().strftime('%Y-%m-%d')  
        completion_status = random.choice(['Completed', 'In Progress'])
        
        completion_date = random_completion_date(enrollment_date).strftime('%Y-%m-%d') if completion_status == 'Completed' else None
        
        last_updated = datetime.now().strftime('%Y-%m-%d')
        percentage = random.randint(50, 100) if completion_status == 'Completed' else random.randint(0, 50)
        user_id = f"EMP{str(random.randint(1, num_users)).zfill(4)}"
        learning_path_id = random.choice([None, random.randint(1, num_learning_paths)])
        
        enrollments.append([i, course_id, enrollment_date, completion_status, completion_date, last_updated, percentage, user_id, learning_path_id])
    return enrollments


def generate_course_completions(num_enrollments):
    course_completions = []
    for i in range(1, num_enrollments + 1):
        score = round(random.uniform(60, 100), 2)  
        certificate_link = f"http://certificates.com/{i}" if random.choice([True, False]) else None
        course_completions.append([i, score, certificate_link])
    return course_completions

def generate_learning_paths(num_learning_paths):
    learning_paths = []
    for i in range(1, num_learning_paths + 1):
        title = f"Learning Path {i}"
        description = f"Description for {title}"
        organization_domain_id = random.randint(1, 2) 
        learning_paths.append([i, title, description, organization_domain_id])
    return learning_paths


def generate_performance_metrics(num_performance_metrics, num_courses, num_users):
    performance_metrics = []
    for i in range(1, num_performance_metrics + 1):
        course_id = random.randint(1, num_courses)
        completion_time = f"{random.randint(20, 100)}h"  
        performance_score = round(random.uniform(60, 100), 2)
        user_id = f"EMP{str(random.randint(1, num_users)).zfill(4)}"
        organization_domain_id = random.randint(1, 2) 
        performance_metrics.append([i, course_id, completion_time, performance_score, user_id, organization_domain_id])
    return performance_metrics

def save_to_csv(filename, data, headers):
    with open(f'/mnt/data/{filename}', 'w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(headers)
        writer.writerows(data)

users = generate_users(num_users)
courses = generate_courses(num_courses)
enrollments = generate_enrollments(num_enrollments, num_courses, num_users, num_learning_paths)
course_completions = generate_course_completions(num_enrollments)
learning_paths = generate_learning_paths(num_learning_paths)
performance_metrics = generate_performance_metrics(num_performance_metrics, num_courses, num_users)

save_to_csv('users.csv', users, ['name', 'employeeId', 'password', 'email', 'organizationDomainId', 'roleId', 'joiningDate', 'designationId', 'departmentId'])
save_to_csv('courses.csv', courses, ['id', 'title', 'duration', 'difficultyLevel', 'description', 'organizationDomainId'])
save_to_csv('enrollments.csv', enrollments, ['id', 'courseId', 'enrollmentDate', 'completionStatus', 'completionDate', 'lastUpdated', 'percentage', 'userId', 'learningPathId'])
save_to_csv('course_completions.csv', course_completions, ['enrollmentId', 'score', 'certificateLink'])
save_to_csv('learning_paths.csv', learning_paths, ['id', 'title', 'description', 'organizationDomainId'])
save_to_csv('performance_metrics.csv', performance_metrics, ['id', 'courseId', 'completionTime', 'performanceScore', 'userId', 'organizationDomainId'])
