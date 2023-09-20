const question = ["Question 1", "Question 2", "Question 3", "Question 4"];

export default async function HomeworkPage({
  params: { homeworkId },
}: {
  params: { homeworkId: string };
}) {
  return (
    <div className="max-w-5xl mx-auto">
      {question.map((question, index) => {
        return (
          <div className="min-h-[80vh] py-8" key={index}>
            <h2 className="text-xl font-semibold">{question}</h2>
          </div>
        );
      })}
    </div>
  );
}
