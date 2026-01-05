import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import { getCourse, updateCourse } from '../../services/firestoreService';
import { uploadFile } from '../../services/storageService';
import { toast } from 'react-toastify';
import { 
  Plus, X, ChevronDown, ChevronUp, Upload, FileText, 
  Film, FileCheck, Brain, Save, ArrowLeft 
} from 'lucide-react';

const CourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedChapter, setExpandedChapter] = useState(null);
  
  const [chapters, setChapters] = useState([
    {
      id: 1,
      title: '',
      description: '',
      order: 1,
      lessons: [
        {
          id: 1,
          title: '',
          type: 'video', // video, document, article, quiz, assignment
          content: '',
          videoUrl: '',
          documentUrl: '',
          duration: '',
          order: 1,
        }
      ],
      quiz: {
        enabled: false,
        questions: [],
      },
      assignment: {
        enabled: false,
        title: '',
        description: '',
        dueInDays: 7,
        maxScore: 100,
      }
    }
  ]);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      const data = await getCourse(courseId);
      setCourse(data);
      
      // Load existing chapters if available
      if (data.chapters && data.chapters.length > 0) {
        setChapters(data.chapters);
      }
    } catch (error) {
      toast.error('Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Validate chapters
      const validChapters = chapters.filter(ch => ch.title.trim() !== '');
      
      if (validChapters.length === 0) {
        toast.error('Please add at least one chapter');
        setSaving(false);
        return;
      }

      await updateCourse(courseId, { chapters: validChapters });
      toast.success('Course content saved successfully!');
    } catch (error) {
      toast.error('Failed to save course content');
    } finally {
      setSaving(false);
    }
  };

  // Chapter operations
  const addChapter = () => {
    setChapters([...chapters, {
      id: Date.now(),
      title: '',
      description: '',
      order: chapters.length + 1,
      lessons: [{
        id: Date.now(),
        title: '',
        type: 'video',
        content: '',
        videoUrl: '',
        documentUrl: '',
        duration: '',
        order: 1,
      }],
      quiz: { enabled: false, questions: [] },
      assignment: { enabled: false, title: '', description: '', dueInDays: 7, maxScore: 100 }
    }]);
  };

  const removeChapter = (chapterId) => {
    setChapters(chapters.filter(ch => ch.id !== chapterId));
  };

  const updateChapter = (chapterId, field, value) => {
    setChapters(chapters.map(ch => 
      ch.id === chapterId ? { ...ch, [field]: value } : ch
    ));
  };

  // Lesson operations
  const addLesson = (chapterId) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          lessons: [...ch.lessons, {
            id: Date.now(),
            title: '',
            type: 'video',
            content: '',
            videoUrl: '',
            documentUrl: '',
            duration: '',
            order: ch.lessons.length + 1,
          }]
        };
      }
      return ch;
    }));
  };

  const removeLesson = (chapterId, lessonId) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          lessons: ch.lessons.filter(l => l.id !== lessonId)
        };
      }
      return ch;
    }));
  };

  const updateLesson = (chapterId, lessonId, field, value) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          lessons: ch.lessons.map(l => 
            l.id === lessonId ? { ...l, [field]: value } : l
          )
        };
      }
      return ch;
    }));
  };

  // File upload handler
  const handleFileUpload = async (chapterId, lessonId, file, type) => {
    try {
      toast.info('Uploading file...');
      const url = await uploadFile(file, `courses/${courseId}/${type}s`);
      
      const field = type === 'video' ? 'videoUrl' : 'documentUrl';
      updateLesson(chapterId, lessonId, field, url);
      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  // Quiz operations
  const toggleQuiz = (chapterId) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          quiz: {
            ...ch.quiz,
            enabled: !ch.quiz.enabled,
            questions: ch.quiz.questions.length === 0 ? [{
              id: Date.now(),
              question: '',
              options: ['', '', '', ''],
              correctAnswer: 0,
            }] : ch.quiz.questions
          }
        };
      }
      return ch;
    }));
  };

  const addQuizQuestion = (chapterId) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          quiz: {
            ...ch.quiz,
            questions: [...ch.quiz.questions, {
              id: Date.now(),
              question: '',
              options: ['', '', '', ''],
              correctAnswer: 0,
            }]
          }
        };
      }
      return ch;
    }));
  };

  const updateQuizQuestion = (chapterId, questionId, field, value) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          quiz: {
            ...ch.quiz,
            questions: ch.quiz.questions.map(q =>
              q.id === questionId ? { ...q, [field]: value } : q
            )
          }
        };
      }
      return ch;
    }));
  };

  const removeQuizQuestion = (chapterId, questionId) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          quiz: {
            ...ch.quiz,
            questions: ch.quiz.questions.filter(q => q.id !== questionId)
          }
        };
      }
      return ch;
    }));
  };

  // Assignment operations
  const toggleAssignment = (chapterId) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          assignment: {
            ...ch.assignment,
            enabled: !ch.assignment.enabled
          }
        };
      }
      return ch;
    }));
  };

  const updateAssignment = (chapterId, field, value) => {
    setChapters(chapters.map(ch => {
      if (ch.id === chapterId) {
        return {
          ...ch,
          assignment: {
            ...ch.assignment,
            [field]: value
          }
        };
      }
      return ch;
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <p className="text-gray-400">Loading...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/courses')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft className="text-white" size={24} />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-white">Course Content</h1>
              <p className="text-gray-400 mt-1">{course?.title}</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Save size={20} />
            {saving ? 'Saving...' : 'Save Content'}
          </button>
        </div>

        {/* Chapters */}
        <div className="space-y-4">
          {chapters.map((chapter, chapterIndex) => (
            <div key={chapter.id} className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
              {/* Chapter Header */}
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-blue-400">#{chapterIndex + 1}</span>
                    <input
                      type="text"
                      value={chapter.title}
                      onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                      className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none text-lg font-semibold"
                      placeholder="Chapter Title (e.g., Introduction to Neural Networks)"
                    />
                  </div>
                  <textarea
                    value={chapter.description}
                    onChange={(e) => updateChapter(chapter.id, 'description', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Chapter description..."
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setExpandedChapter(expandedChapter === chapter.id ? null : chapter.id)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    {expandedChapter === chapter.id ? 
                      <ChevronUp className="text-white" size={20} /> : 
                      <ChevronDown className="text-white" size={20} />
                    }
                  </button>
                  {chapters.length > 1 && (
                    <button
                      onClick={() => removeChapter(chapter.id)}
                      className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded Chapter Content */}
              {expandedChapter === chapter.id && (
                <div className="space-y-6 pt-4 border-t border-white/10">
                  {/* Lessons */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Lessons</h3>
                    <div className="space-y-4">
                      {chapter.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                          <div className="flex items-start gap-4">
                            <span className="text-gray-400 font-medium">{lessonIndex + 1}.</span>
                            <div className="flex-1 space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(chapter.id, lesson.id, 'title', e.target.value)}
                                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                  placeholder="Lesson title"
                                />
                                <select
                                  value={lesson.type}
                                  onChange={(e) => updateLesson(chapter.id, lesson.id, 'type', e.target.value)}
                                  className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                  <option value="video" className="bg-gray-900">Video Lecture</option>
                                  <option value="document" className="bg-gray-900">Document (PDF/PPT)</option>
                                  <option value="article" className="bg-gray-900">Article/Reading</option>
                                  <option value="interactive" className="bg-gray-900">Interactive Content</option>
                                </select>
                              </div>

                              {lesson.type === 'video' && (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={lesson.videoUrl}
                                    onChange={(e) => updateLesson(chapter.id, lesson.id, 'videoUrl', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Video URL (YouTube, Vimeo, or upload)"
                                  />
                                  <label className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg cursor-pointer transition-colors w-fit">
                                    <Upload size={18} />
                                    <span>Upload Video</span>
                                    <input
                                      type="file"
                                      accept="video/*"
                                      onChange={(e) => handleFileUpload(chapter.id, lesson.id, e.target.files[0], 'video')}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              )}

                              {lesson.type === 'document' && (
                                <div className="space-y-2">
                                  <input
                                    type="text"
                                    value={lesson.documentUrl}
                                    onChange={(e) => updateLesson(chapter.id, lesson.id, 'documentUrl', e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Document URL"
                                  />
                                  <label className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg cursor-pointer transition-colors w-fit">
                                    <FileText size={18} />
                                    <span>Upload PDF/PPT</span>
                                    <input
                                      type="file"
                                      accept=".pdf,.ppt,.pptx"
                                      onChange={(e) => handleFileUpload(chapter.id, lesson.id, e.target.files[0], 'document')}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              )}

                              {(lesson.type === 'article' || lesson.type === 'interactive') && (
                                <textarea
                                  value={lesson.content}
                                  onChange={(e) => updateLesson(chapter.id, lesson.id, 'content', e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                  placeholder="Lesson content (supports Markdown)"
                                  rows={4}
                                />
                              )}

                              <input
                                type="text"
                                value={lesson.duration}
                                onChange={(e) => updateLesson(chapter.id, lesson.id, 'duration', e.target.value)}
                                className="w-32 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Duration"
                              />
                            </div>
                            {chapter.lessons.length > 1 && (
                              <button
                                onClick={() => removeLesson(chapter.id, lesson.id)}
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                              >
                                <X size={18} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <button
                        onClick={() => addLesson(chapter.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                      >
                        <Plus size={18} />
                        Add Lesson
                      </button>
                    </div>
                  </div>

                  {/* Quiz Section */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Brain size={20} className="text-yellow-400" />
                        Chapter Quiz
                      </h3>
                      <button
                        onClick={() => toggleQuiz(chapter.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          chapter.quiz.enabled 
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' 
                            : 'bg-white/10 text-gray-400'
                        }`}
                      >
                        {chapter.quiz.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    {chapter.quiz.enabled && (
                      <div className="space-y-3">
                        {chapter.quiz.questions.map((question, qIndex) => (
                          <div key={question.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                              <span className="text-yellow-400 font-medium">Q{qIndex + 1}</span>
                              <div className="flex-1 space-y-3">
                                <input
                                  type="text"
                                  value={question.question}
                                  onChange={(e) => updateQuizQuestion(chapter.id, question.id, 'question', e.target.value)}
                                  className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
                                  placeholder="Question text"
                                />
                                <div className="grid gap-2">
                                  {question.options.map((option, optIndex) => (
                                    <div key={optIndex} className="flex items-center gap-2">
                                      <input
                                        type="radio"
                                        name={`question-${question.id}`}
                                        checked={question.correctAnswer === optIndex}
                                        onChange={() => updateQuizQuestion(chapter.id, question.id, 'correctAnswer', optIndex)}
                                        className="text-green-500"
                                      />
                                      <input
                                        type="text"
                                        value={option}
                                        onChange={(e) => {
                                          const newOptions = [...question.options];
                                          newOptions[optIndex] = e.target.value;
                                          updateQuizQuestion(chapter.id, question.id, 'options', newOptions);
                                        }}
                                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 outline-none"
                                        placeholder={`Option ${optIndex + 1}`}
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() => removeQuizQuestion(chapter.id, question.id)}
                                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                        ))}
                        <button
                          onClick={() => addQuizQuestion(chapter.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 rounded-lg transition-colors"
                        >
                          <Plus size={18} />
                          Add Question
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Assignment Section */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <FileCheck size={20} className="text-green-400" />
                        Chapter Assignment
                      </h3>
                      <button
                        onClick={() => toggleAssignment(chapter.id)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          chapter.assignment.enabled 
                            ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                            : 'bg-white/10 text-gray-400'
                        }`}
                      >
                        {chapter.assignment.enabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    {chapter.assignment.enabled && (
                      <div className="space-y-3 bg-white/5 border border-white/10 rounded-xl p-4">
                        <input
                          type="text"
                          value={chapter.assignment.title}
                          onChange={(e) => updateAssignment(chapter.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
                          placeholder="Assignment title"
                        />
                        <textarea
                          value={chapter.assignment.description}
                          onChange={(e) => updateAssignment(chapter.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 outline-none"
                          placeholder="Assignment instructions"
                          rows={3}
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Due in (days)</label>
                            <input
                              type="number"
                              value={chapter.assignment.dueInDays}
                              onChange={(e) => updateAssignment(chapter.id, 'dueInDays', parseInt(e.target.value))}
                              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-green-500 outline-none"
                              min="1"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-400 mb-2">Max Score</label>
                            <input
                              type="number"
                              value={chapter.assignment.maxScore}
                              onChange={(e) => updateAssignment(chapter.id, 'maxScore', parseInt(e.target.value))}
                              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-green-500 outline-none"
                              min="1"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          <button
            onClick={addChapter}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors border-2 border-dashed border-white/20"
          >
            <Plus size={24} />
            Add New Chapter
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CourseContent;
