import  { useState, useMemo } from 'react';

// Standard 4.0 GPA Grade Scale mapping
const GRADE_POINTS = {
  'A': 4.0, 'A-': 3.7,
  'B+': 3.3, 'B': 3.0, 'B-': 2.7,
  'C+': 2.3, 'C': 2.0, 'C-': 1.7,
  'D+': 1.3, 'D': 1.0,
  'F': 0.0
};

export default function GradeCalculator({ onNavigate }) {
  const [courses, setCourses] = useState([
    { id: 1, name: 'Web Programming', credits: 3, grade: 'A' },
    { id: 2, name: 'Java Backend Development', credits: 4, grade: 'A-' },
    { id: 3, name: 'Database Management', credits: 3, grade: 'B+' },
    { id: 4, name: 'UI/UX Vector Design', credits: 2, grade: 'A' }
  ]);

  const [newCourseName, setNewCourseName] = useState('');
  const [newCredits, setNewCredits] = useState(3);
  const [newGrade, setNewGrade] = useState('A');

  // Calculate Cumulative GPA & Total Credits
  const { gpa, totalCredits, totalQualityPoints } = useMemo(() => {
    let credSum = 0;
    let pointSum = 0;

    courses.forEach(course => {
      const credits = parseFloat(course.credits) || 0;
      const gradePoint = GRADE_POINTS[course.grade] ?? 0;
      credSum += credits;
      pointSum += credits * gradePoint;
    });

    const calculatedGpa = credSum > 0 ? (pointSum / credSum).toFixed(2) : '0.00';
    return {
      gpa: calculatedGpa,
      totalCredits: credSum,
      totalQualityPoints: pointSum.toFixed(1)
    };
  }, [courses]);

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    const newItem = {
      id: Date.now(),
      name: newCourseName.trim(),
      credits: Number(newCredits),
      grade: newGrade
    };

    setCourses([...courses, newItem]);
    setNewCourseName('');
    setNewCredits(3);
    setNewGrade('A');
  };

  const handleDeleteCourse = (id) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  const handleGradeChange = (id, newGradeValue) => {
    setCourses(courses.map(c => c.id === id ? { ...c, grade: newGradeValue } : c));
  };

  const handleCreditsChange = (id, newCreditsValue) => {
    setCourses(courses.map(c => c.id === id ? { ...c, credits: Math.max(1, Number(newCreditsValue)) } : c));
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
      
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span className="text-cyan-400">Grade & GPA</span> Calculator
            </h1>
            <span className="px-3 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px] font-bold tracking-wider">
              4.0 Scale System
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Calculate your semester grade point average (GPA), track subject credits, and manage your academic performance effortlessly.
          </p>
        </div>

        <button
          onClick={() => onNavigate('home')}
          className="px-4 py-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-cyan-950/40 active:scale-95 shrink-0"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      {/* Main KPI Summary Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* GPA Result Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/60 via-slate-900/90 to-slate-950 border border-cyan-500/30 shadow-xl relative overflow-hidden flex items-center justify-between">
          <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-cyan-500/10 rounded-full blur-[40px] pointer-events-none"></div>
          <div>
            <p className="text-xs uppercase font-bold text-cyan-400 tracking-wider">Cumulative GPA</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-1 tracking-tight">{gpa}</h2>
            <p className="text-xs text-slate-400 mt-1">Scale out of 4.00</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-2xl font-black">
            🏆
          </div>
        </div>

        {/* Total Credits Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Credits</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-1 tracking-tight">{totalCredits}</h2>
            <p className="text-xs text-slate-400 mt-1">Enrolled credit hours</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 text-2xl font-black">
            📚
          </div>
        </div>

        {/* Quality Points Card */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs uppercase font-bold text-slate-400 tracking-wider">Quality Points</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mt-1 tracking-tight">{totalQualityPoints}</h2>
            <p className="text-xs text-slate-400 mt-1">Credits × Grade points</p>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 text-2xl font-black">
            ⚡
          </div>
        </div>

      </div>

      {/* Grid: Add Course Form & Courses List Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Quick Add Course Form */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-5 h-fit">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>➕</span> Add New Subject / Course
          </h3>

          <form onSubmit={handleAddCourse} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Course Name</label>
              <input
                type="text"
                placeholder="e.g. Data Structures"
                value={newCourseName}
                onChange={(e) => setNewCourseName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Credits</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newCredits}
                  onChange={(e) => setNewCredits(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Grade</label>
                <select
                  value={newGrade}
                  onChange={(e) => setNewGrade(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all cursor-pointer"
                >
                  {Object.keys(GRADE_POINTS).map((g) => (
                    <option key={g} value={g}>{g} ({GRADE_POINTS[g].toFixed(1)})</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-400/25 cursor-pointer active:scale-95"
            >
              Add Course to List
            </button>
          </form>
        </div>

        {/* Right Column: Interactive Subject Grades Table */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>📋</span> Enrolled Courses & Grades
            </h3>
            <span className="text-xs font-mono text-cyan-400">
              {courses.length} Courses Listed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Course Name</th>
                  <th className="py-3 px-4 text-center">Credits</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-center">Points</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-sm">
                {courses.length > 0 ? (
                  courses.map((course) => {
                    const gradePt = GRADE_POINTS[course.grade] ?? 0;
                    const coursePoints = (course.credits * gradePt).toFixed(1);
                    return (
                      <tr key={course.id} className="hover:bg-slate-950/40 transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {course.name}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={course.credits}
                            onChange={(e) => handleCreditsChange(course.id, e.target.value)}
                            className="w-16 py-1.5 px-2 rounded-lg bg-slate-950 border border-slate-800 text-center text-white text-xs font-mono focus:outline-none focus:border-cyan-400"
                          />
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <select
                            value={course.grade}
                            onChange={(e) => handleGradeChange(course.id, e.target.value)}
                            className="py-1.5 px-3 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 text-xs font-bold font-mono focus:outline-none focus:border-cyan-400 cursor-pointer"
                          >
                            {Object.keys(GRADE_POINTS).map((g) => (
                              <option key={g} value={g}>{g}</option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-300">
                          {coursePoints}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteCourse(course.id)}
                            className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Remove course"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-slate-500 text-sm">
                      No courses added yet. Use the form on the left to add your subjects.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
}