import { useEffect, useState } from 'react';
import StudentLayout from '../../components/Layout/StudentLayout';
import { useAuthStore } from '../../store';
import { getStudentCertificates } from '../../services/firestoreService';
import { Award, BookOpen, Calendar, Hash, Printer } from 'lucide-react';

const Certificates = () => {
  const { userData } = useAuthStore();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.uid) {
      loadCertificates();
    }
  }, [userData]);

  const loadCertificates = async () => {
    try {
      const certs = await getStudentCertificates(userData.uid);
      setCertificates(certs);
    } catch (err) {
      console.error('Error loading certificates:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '—';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handlePrint = (cert) => {
    const issueDate = formatDate(cert.issueDate);
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <title>Certificate – ${cert.courseName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Georgia, serif; background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
          .cert { width: 900px; padding: 60px; border: 8px double #c9a84c; text-align: center; }
          .cert-title { font-size: 13px; letter-spacing: 4px; text-transform: uppercase; color: #888; margin-bottom: 12px; }
          .cert-heading { font-size: 48px; font-weight: bold; color: #1a1a2e; margin-bottom: 8px; }
          .cert-sub { font-size: 14px; letter-spacing: 2px; text-transform: uppercase; color: #888; margin-bottom: 40px; }
          .divider { border: none; border-top: 1px solid #ddd; margin: 20px auto; width: 60%; }
          .cert-label { font-size: 13px; color: #888; margin-bottom: 6px; }
          .cert-name { font-size: 36px; color: #1a1a2e; margin-bottom: 24px; font-style: italic; }
          .cert-course-label { font-size: 13px; color: #888; margin-bottom: 6px; }
          .cert-course { font-size: 22px; font-weight: bold; color: #1a1a2e; margin-bottom: 32px; }
          .cert-score { display: inline-block; padding: 8px 24px; background: #f0f4ff; border: 1px solid #c9a84c; border-radius: 30px; font-size: 16px; color: #444; margin-bottom: 32px; }
          .cert-footer { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 48px; padding-top: 24px; border-top: 1px solid #eee; }
          .cert-footer div { text-align: center; }
          .cert-footer .label { font-size: 11px; color: #aaa; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; }
          .cert-number { font-size: 11px; color: #bbb; margin-top: 32px; }
          @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
        </style>
      </head>
      <body>
        <div class="cert">
          <div class="cert-title">Certificate of Completion</div>
          <div class="cert-heading">iVersity</div>
          <div class="cert-sub">AI-Powered Learning Platform</div>
          <hr class="divider" />
          <div class="cert-label">This is to certify that</div>
          <div class="cert-name">${cert.studentName}</div>
          <div class="cert-course-label">has successfully completed the course</div>
          <div class="cert-course">${cert.courseName}</div>
          <div class="cert-score">Final Exam Score: ${cert.examScore}%</div>
          <div class="cert-footer">
            <div>
              <div style="font-size:18px;font-weight:bold;color:#1a1a2e">iVersity</div>
              <div class="label">Issuing Authority</div>
            </div>
            <div>
              <div style="font-size:16px;color:#444">${issueDate}</div>
              <div class="label">Date of Issue</div>
            </div>
          </div>
          <div class="cert-number">Certificate No: ${cert.certificateNumber}</div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <StudentLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Certificates</h1>
          <p className="text-gray-400 mt-2">Certificates you've earned by completing courses</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading certificates…</div>
        ) : certificates.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-16 text-center">
            <Award className="mx-auto text-gray-500 mb-4" size={56} />
            <h2 className="text-xl font-semibold text-white mb-2">No certificates yet</h2>
            <p className="text-gray-400 max-w-sm mx-auto">
              Complete a course and pass the final exam to earn your first certificate.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 flex flex-col gap-4"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500">
                    <Award className="text-white" size={22} />
                  </div>
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                    Completed
                  </span>
                </div>

                {/* Course name */}
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                    <BookOpen size={12} />
                    <span>COURSE</span>
                  </div>
                  <h3 className="text-white font-semibold text-lg leading-snug">{cert.courseName}</h3>
                </div>

                {/* Score */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-white/5 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-white">{cert.examScore}%</div>
                    <div className="text-xs text-gray-400 mt-0.5">Exam Score</div>
                  </div>
                </div>

                {/* Meta */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Calendar size={14} />
                    <span>{formatDate(cert.issueDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500">
                    <Hash size={14} />
                    <span className="font-mono text-xs truncate">{cert.certificateNumber}</span>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => handlePrint(cert)}
                  className="mt-auto w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold hover:scale-[1.02] transition-transform"
                >
                  <Printer size={15} />
                  Print / Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default Certificates;
