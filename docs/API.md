#TRIVIA API ENDPOINTS
---

##Getting Started
The app can only be run locally. 

**Base URL:** http://localhost:5000/ (backend)
**Authentication:**  neither authentication nor API keys are required

##Endpoints

####GET '/categories'

Fetches a list of categories dictionaries with keys `id` and `type`

- **Request Arguments:** None
- **Response**

```
{
  "categories": [
    {
      "id": 1,
      "type": "Science"
    },
    {
      "id": 2,
      "type": "Art"
    },
    ...
  ],
  "success": true
}

```

####GET '/questions'

Returns a list of questions, categories, success value, and total number of questions
Questions are paginated in groups of 10.

- **Request Arguments:** page number (integer)
- **Response**
```
curl http://localhost:5000/questions 
```

```
{
  {
    "categories": [
      {
        "id": 1,
        "type": "Science"
      },
        ...
    ],
    "questions": [
      {
        "answer": "Apollo 13",
        "category": 5,
        "difficulty": 4,
        "id": 2,
        "question": "What movie earned Tom Hanks his third straight Oscar nomination, in 1996?"
      },
      {
        "answer": "Maya Angelou",
        "category": 4,
        "difficulty": 2,
        "id": 5,
        "question": "Whose autobiography is entitled 'I Know Why the Caged Bird Sings'?"
      },
    ...
    ],
    "success": true,
    "total_questions": 20
  }
}

```

###GET '/categories/:category_id/questions'

Gets list of questions from chosen category, success value and the total count of questions in chosen category and the category itself

- **Request Arguments:** category id (integer)
- **Response**
```
curl http://localhost:5000/categories/1/questions
```

```
{
  "current_category": {
    "id": 1,
    "type": "Science"
  },
  "questions": [
    {
      "answer": "The Liver",
      "category": 1,
      "difficulty": 4,
      "id": 20,
      "question": "What is the heaviest organ in the human body?"
    },
    {
      "answer": "Alexander Fleming",
      "category": 1,
      "difficulty": 3,
      "id": 21,
      "question": "Who discovered penicillin?"
    },
    {
      "answer": "Blood",
      "category": 1,
      "difficulty": 4,
      "id": 22,
      "question": "Hematology is a branch of medicine involving the study of what?"
    }
  ],
  "success": true,
  "total_questions": 3
}
```

####POST '/questions'

Creates a new question using the submitted data (question, answer, difficulty, category). Returns the success value.

- **Request Arguments:** None
- **Request Body:** (json) 
```
{
  "question": "Some question",
  "answer": "Some answer",
  "category": 1 (integer, 1-5),
  "difficulty": 1 (integer, 1-5)
}
```
- **Response**
```
curl http://localhost:5000/questions -X POST -H "Content-Type: application/json" -d '{"question": "Some q","answer":"Some a", "category": 1, "difficulty": 4}' 
```
```
{
  "success": true
}

```

####POST '/questions/search'

Gets questions with submitted search term (case insensitive). Returns questions list, success value and total questions count.

- **Request Arguments:** None
- **Request Body:** (json) 
```
{
  "search_term": "actor",
}
```
- **Response**
```
curl http://localhost:5000/questions/search -X POST -H "Content-Type: application/json" -d '{"search_term": "actor"}' 
```
```
{
  "questions": [
    {
      "answer": "Tom Cruise", 
      "category": 5, 
      "difficulty": 4, 
      "id": 4, 
      "question": "What actor did author Anne Rice first denounce, then praise in the role of her beloved Lestat?"
    }
  ], 
  "success": true, 
  "total_questions": 1
}

```


####POST '/quizzes'

Gets one question of chosen category for the quiz.

- **Request Arguments:** None
- **Request Body:** (json)
```
{
    "quiz_category": 1, // (integer, 1-5) 
    "previous_questions": [] // (array of previous questions)
}
```
- **Response**
```
curl http://localhost:5000/quizzes -X POST -H "Content-Type: application/json" -d '{"quiz_category": 1, "previous_questions": []}'
```

```
{
  "question": {
    "answer": "The Liver", 
    "category": 1, 
    "difficulty": 4, 
    "id": 20, 
    "question": "What is the heaviest organ in the human body?"
  }, 
  "success": true
}

```


####DELETE '/questions/:question_id'

Creates a new question using the submitted data (question, answer, difficulty, category). Returns the success value.

- **Request Arguments:** question_id (integer)
- **Response**
```
curl http://localhost:5000/questions/21 -X DELETE
```
```
{
  "success": true
}

```


##Error Handling
Errors are returned as JSON objects in the following format:
```
{
    "success": False, 
    "error": 400,
    "message": "Bad request"
}
```
Error types:

400: Bad Request
404: Resource Not Found
405: Method Not Allowed
422: Unprocessable
500: Internal Server Error


