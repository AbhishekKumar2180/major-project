const { default: axios } = require("axios");

const GetAllGrades=()=>axios.get('/api/grade');
const CreateNewStudent=(data)=>axios.post('/api/student',data)
const GetAllStudents=()=>axios.get('/api/student');
const DeleteStudentRecord=(id)=>axios.delete('/api/student?id='+id)

const GetAttendanceList=(grade,month)=>axios.get('/api/attendance?grade='+grade+"&month="+month)
const MarkAttendance=(data)=>axios.post('/api/attendance',data);
const MarkAbsent=(studentId,day,date)=>axios.delete('/api/attendance?studentId='+studentId+"&day="+day+"&date="+date)

// Advanced Attendance Endpoints
const GetSubjects=(gradeId)=>axios.get('/api/subjects?gradeId='+gradeId);
const GetTimetable=(gradeId)=>axios.get('/api/timetable?gradeId='+gradeId);
const VerifySmartAttendance=(data)=>axios.post('/api/attendance/verify', data);

const GetUserNotifications=(userId)=>axios.get('/api/notifications?userId='+userId);
const SubmitLeaveRequest=(data)=>axios.post('/api/leaves', data);

const TotalPresentCountByDay=(date,grade)=>axios.get('/api/dashboard?date='+date+"&grade="+grade);
const GetFaculty=()=>axios.get('/api/faculty');
const GetSummaryStats=()=>axios.get('/api/analytics/summary');

const GetUser=(email)=>axios.get('/api/user?email='+email);
const UpdateUser=(data)=>axios.post('/api/user', data);

export default{
    GetAllGrades,
    CreateNewStudent,
    GetAllStudents,
    DeleteStudentRecord,
    GetAttendanceList,
    MarkAttendance,
    MarkAbsent,
    GetSubjects,
    GetTimetable,
    VerifySmartAttendance,
    GetUserNotifications,
    SubmitLeaveRequest,
    TotalPresentCountByDay,
    GetFaculty,
    GetSummaryStats,
    GetUser,
    UpdateUser
}