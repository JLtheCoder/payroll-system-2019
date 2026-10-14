import { NavLink, Route, Routes } from 'react-router-dom';
import { PayrollUpload } from './components/PayrollUpload';
import { Report } from './components/Report';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-4 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`;

export function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <nav className="flex justify-center gap-2 border-b border-slate-200 bg-white px-4 py-3">
        <NavLink to="/" end className={navLinkClass}>
          Payroll Upload
        </NavLink>
        <NavLink to="/report" className={navLinkClass}>
          Payroll Report
        </NavLink>
      </nav>
      <main className="mx-auto max-w-xl px-4 py-8">
        <Routes>
          <Route path="/" element={<PayrollUpload />} />
          <Route path="/report" element={<Report />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
