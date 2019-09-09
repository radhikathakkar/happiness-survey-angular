export class Questions {
  questionText: string;
  questionType: string;
}

export class Survey {
  id: string;
  ownerId: string;
  title: string;
  questions: Questions;
  assignees: [
    {
      userID: string,
      response: [
        {
          questionId: string,
          response: number
        }
      ]
    }
  ];
}


