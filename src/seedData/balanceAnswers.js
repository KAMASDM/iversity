/**
 * Deterministically shuffles each quiz question's options (and remaps
 * correctAnswer) so the right answer isn't always in the same position.
 * Same input → same output, so re-seeding a course is stable.
 */
function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function balanceAnswers(course) {
  return {
    ...course,
    chapters: course.chapters.map(chapter => ({
      ...chapter,
      quiz: chapter.quiz && {
        ...chapter.quiz,
        questions: chapter.quiz.questions.map(q => {
          const target = hash(`${course.title}:${chapter.id}:${q.id}`) % q.options.length;
          const others = q.options.filter((_, i) => i !== q.correctAnswer);
          const options = [...others.slice(0, target), q.options[q.correctAnswer], ...others.slice(target)];
          return { ...q, options, correctAnswer: target };
        }),
      },
    })),
  };
}
