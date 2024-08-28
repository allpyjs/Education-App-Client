import "./App.scss";
import React, { useState, useEffect } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Messages from "./pages/Messages";

import { Schools as AdminSchools } from "./pages/admin/Schools";
import { School as AdminSchool } from "./pages/admin/School";
import { Students as AdminStudents } from "./pages/admin/Students";
import { Student as AdminStudent } from "./pages/admin/Student";
import { Teachers as AdminTeachers } from "./pages/admin/Teachers";
import { Teacher as AdminTeacher } from "./pages/admin/Teacher";
import { Parents as AdminParents } from "./pages/admin/Parents";
import { Parent as AdminParent } from "./pages/admin/Parent";
import { Reward as AdminReward } from "./pages/admin/Reward";
import { Rewards as AdminRewards } from "./pages/admin/Rewards";
import { Tracking as AdminTracking } from "./pages/admin/Tracking";

import { Students as SchoolStudents } from "./pages/school/Students";
import { Student as SchoolStudent } from "./pages/school/Student";
import { Parent as SchoolParent } from "./pages/school/Parent";
import { Parents as SchoolParents } from "./pages/school/Parents";
import { Teacher as SchoolTeacher } from "./pages/school/Teacher";
import { Teachers as SchoolTeachers } from "./pages/school/Teachers";
import { Reward as SchoolReward } from "./pages/school/Reward";
import { Rewards as SchoolRewards } from "./pages/school/Rewards";
import { Tracking as SchoolTracking } from "./pages/school/Tracking";

import { Dashboard as TeacherDashboard } from "./pages/teacher/Dashboard";
import { Students as TeacherStudents } from "./pages/teacher/Students";
import { Goals as TeacherGoals } from "./pages/teacher/Goals";
import { Rewards as TeacherRewards } from "./pages/teacher/Rewards";
import { Tracking as TeacherTracking } from "./pages/teacher/Tracking";
import { Profile as TeacherProfile } from "./pages/teacher/Profile";
import { Progress as TeacherProgress } from "./pages/teacher/Progress";
import { Student as TeacherStudent } from "./pages/teacher/Student";
import { Reward as TeacherReward } from "./pages/teacher/Reward";
import { Goal as TeacherGoal } from "./pages/teacher/Goal";
import { Parents as TeacherParents } from "./pages/teacher/Parents";
import { Parent as TeacherParent } from "./pages/teacher/Parent";

import { Dashboard as ParentDashboard } from "./pages/parent/Dashboard";
import { Goals as ParentGoals } from "./pages/parent/Goals";
import { Goal as ParentGoal } from "./pages/parent/Goal";
import { Students as ParentStudents } from "./pages/parent/Students";
import { Profile as ParentProfile } from "./pages/parent/Profile";
import { Progress as ParentProgress } from "./pages/parent/Progress";

import { Dashboard as StudentDashboard } from "./pages/student/Dashboard";
import { Profile as StudentProfile } from "./pages/student/Profile";
import { Goals as StudentGoals } from "./pages/student/Goals";
import { Rewards as StudentRewards } from "./pages/student/Rewards";
import { Progress as StudentProgress } from "./pages/student/Progress";

import CookieUtil from "./utils/CookieUtil";
import Constants from "./utils/constants";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [show, setShow] = useState(false);

  /* eslint-disable */
  useEffect(() => {
    if (!CookieUtil.getCookie(Constants.ACCESS_PROPERTY)) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.role) setRole(user.role);
  }, [location.pathname]);
  /* eslint-enable */
  return (
    <Layout role={role} show={show} setShow={setShow}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/message/:chatId" element={<Messages />} />
      </Routes>
      {role === "teacher" && (
        <Routes>
          <Route exact path="/" element={<TeacherDashboard />} />
          <Route path="/students" element={<TeacherStudents />} />
          <Route path="/student" element={<TeacherStudent />} />
          <Route path="/goals" element={<TeacherGoals />} />
          <Route path="/goal" element={<TeacherGoal />} />
          <Route path="/goal/:id" element={<TeacherGoal />} />
          <Route path="/rewards" element={<TeacherRewards />} />
          <Route path="/reward" element={<TeacherReward />} />
          <Route path="/reward/:id" element={<TeacherReward />} />
          <Route path="/tracking" element={<TeacherTracking />} />
          <Route path="/student/:id" element={<TeacherProfile />} />
          <Route path="/progress/:id" element={<TeacherProgress />} />
          <Route path="/parents" element={<TeacherParents />} />
          <Route path="/parent" element={<TeacherParent />} />
          <Route path="/parent/:id" element={<TeacherParent />} />
        </Routes>
      )}
      {role === "parent" && (
        <Routes>
          <Route exact path="/" element={<ParentDashboard />} />
          <Route path="/goals" element={<ParentGoals />} />
          <Route path="/goal" element={<ParentGoal />} />
          <Route path="/goal/:id" element={<ParentGoal />} />
          <Route path="/tracking" element={<ParentProgress />} />
          <Route path="/students" element={<ParentStudents />} />
          <Route path="/student/:id" element={<ParentProfile />} />
          <Route path="/student/progress/:id" element={<ParentProgress />} />
          <Route path="/goal/progress/:goalId" element={<ParentProgress />} />
        </Routes>
      )}
      {role === "student" && (
        <Routes>
          <Route exact path="/" element={<StudentDashboard />} />
          <Route path="/progress" element={<StudentProfile />} />
          <Route path="/progress/:id" element={<StudentProgress />} />
          <Route path="/goals" element={<StudentGoals />} />
          <Route path="/rewards" element={<StudentRewards />} />
        </Routes>
      )}
      {role === "admin" && (
        <Routes>
          <Route exact path="/" element={<AdminStudents />} />
          <Route path="/schools" element={<AdminSchools />} />
          <Route path="/school" element={<AdminSchool />} />
          <Route path="/school/:id" element={<AdminSchool />} />
          <Route path="/students" element={<AdminStudents />} />
          <Route path="/student" element={<AdminStudent />} />
          <Route path="/student/:id" element={<AdminStudent />} />
          <Route path="/teachers" element={<AdminTeachers />} />
          <Route path="/teacher" element={<AdminTeacher />} />
          <Route path="/teacher/:id" element={<AdminTeacher />} />
          <Route path="/parents" element={<AdminParents />} />
          <Route path="/parent" element={<AdminParent />} />
          <Route path="/parent/:id" element={<AdminParent />} />
          <Route path="/reward" element={<AdminReward />} />
          <Route path="/reward/:id" element={<AdminReward />} />
          <Route path="/rewards" element={<AdminRewards />} />
          <Route path="/tracking" element={<AdminTracking />} />
        </Routes>
      )}
      {role === "school" && (
        <Routes>
          <Route exact path="/" element={<SchoolTracking />} />
          <Route path="/students" element={<SchoolStudents />} />
          <Route path="/student" element={<SchoolStudent />} />
          <Route path="/student/:id" element={<SchoolStudent />} />
          <Route path="/parent" element={<SchoolParent />} />
          <Route path="/parent/:id" element={<SchoolParent />} />
          <Route path="/parents" element={<SchoolParents />} />
          <Route path="/reward" element={<SchoolReward />} />
          <Route path="/reward/:id" element={<SchoolReward />} />
          <Route path="/rewards" element={<SchoolRewards />} />
          <Route path="/teacher" element={<SchoolTeacher />} />
          <Route path="/teacher/:id" element={<SchoolTeacher />} />
          <Route path="/teachers" element={<SchoolTeachers />} />
          <Route path="/tracking" element={<SchoolTracking />} />
        </Routes>
      )}
    </Layout>
  );
}

export default App;
