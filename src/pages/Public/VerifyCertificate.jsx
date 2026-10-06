import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCertificate } from '../../services/firestoreService';
import Loading from '../../components/Loading';
import { Award, GraduationCap, ShieldAlert, ShieldCheck } from 'lucide-react';

const formatDate = (ts) => {
  if (!ts) return '—';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

/** Public page anyone can open to confirm a certificate is genuine. */
const VerifyCertificate = () => {
  const { certificateId } = useParams();
  const [cert, setCert] = useState(undefined);

  useEffect(() => {
    getCertificate(certificateId).then(setCert).catch(() => setCert(null));
  }, [certificateId]);

  if (cert === undefined) return <Loading label="Verifying certificate…" />;

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <Link to="/" className="mb-10 flex items-center justify-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-600">
            <GraduationCap size={16} className="text-white" />
          </span>
          <span className="text-xl font-bold text-white">i<span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">Versity</span></span>
        </Link>

        {cert ? (
          <div className="overflow-hidden rounded-3xl border border-emerald-500/25 bg-white/[0.03]">
            <div className="flex items-center gap-3 border-b border-emerald-500/20 bg-emerald-500/10 px-6 py-4">
              <ShieldCheck size={22} className="text-emerald-300" />
              <div>
                <p className="font-semibold text-emerald-200">Verified certificate</p>
                <p className="text-xs text-emerald-200/70">Issued by iVersity after passing the course final exam</p>
              </div>
            </div>
            <div className="p-8 sm:p-10 text-center">
              <Award size={40} className="mx-auto text-amber-400" />
              <p className="mt-6 text-sm text-gray-400">This certifies that</p>
              <p className="mt-1 text-3xl font-semibold italic text-white" style={{ fontFamily: 'Georgia, serif' }}>{cert.studentName}</p>
              <p className="mt-6 text-sm text-gray-400">successfully completed</p>
              <p className="mt-1 text-xl font-bold text-white">{cert.courseName}</p>
              <div className="mt-8 grid grid-cols-3 gap-3 text-left">
                <Meta label="Final exam" value={`${cert.examScore}%`} />
                <Meta label="Issued" value={formatDate(cert.issueDate)} />
                <Meta label="Certificate no." value={cert.certificateNumber} mono />
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-rose-500/25 bg-rose-500/[0.06] p-10 text-center">
            <ShieldAlert size={36} className="mx-auto text-rose-300" />
            <h1 className="mt-4 text-xl font-semibold text-white">Certificate not found</h1>
            <p className="mt-2 text-sm text-gray-400">
              We couldn't find a certificate with this ID. Check that the link was copied in full.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Meta = ({ label, value, mono = false }) => (
  <div className="rounded-xl border border-white/10 bg-black/20 p-3">
    <p className="text-[11px] uppercase tracking-wider text-gray-500">{label}</p>
    <p className={`mt-1 text-sm text-white break-words ${mono ? 'font-mono text-xs' : ''}`}>{value}</p>
  </div>
);

export default VerifyCertificate;
