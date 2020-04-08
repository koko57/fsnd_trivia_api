import os
import unittest
import json
from flask_sqlalchemy import SQLAlchemy

from flaskr import create_app
from models import setup_db, Question, Category


class TriviaTestCase(unittest.TestCase):
    """This class represents the trivia test case"""

    def setUp(self):
        """Define test variables and initialize app."""
        self.app = create_app()
        self.client = self.app.test_client
        self.database_name = "trivia_test"
        self.database_path = "postgres://{}/{}".format('localhost:5432', self.database_name)
        setup_db(self.app, self.database_path)

        # binds the app to the current context
        with self.app.app_context():
            self.db = SQLAlchemy()
            self.db.init_app(self.app)
            # create all tables
            self.db.create_all()
    
    def tearDown(self):
        """Executed after reach test"""
        pass
    
    def test_get_paginated_questions(self):
        res = self.client().get('/questions')
        data = json.loads(res.data)
        
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'])
        self.assertTrue(data['total_questions'])
        self.assertTrue(len(data['questions']))
        
    def test_get_categories(self):
        res = self.client().get('/categories')
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'])
        self.assertTrue(len(data['categories']))
        
    def test_add_a_question(self):
        new_question = {
            'question': 'What is love?',
            'answer': 'Baby don\'t hurt me!',
            'category': 5,
            'difficulty': 1
        }
        res = self.client().post('/questions', json=new_question)
        data = json.loads(res.data)
        
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'])
    
    def test_get_questions_by_category(self):
        category_id = 1
        res = self.client().get(f'/categories/{category_id}/questions')
        data = json.loads(res.data)
        
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'])
        self.assertTrue(data['current_category'])
        self.assertTrue(data['questions'])
        self.assertEqual(data['current_category']['id'], category_id)
        
        for question in data['questions']:
            self.assertEqual(question['category'], category_id)
            
    def test_delete_question(self):
        question_to_delete = Question.query.order_by(Question.id).all()[-1]
        question_id = question_to_delete.id
        
        res = self.client().delete(f'/questions/{question_id}')
        data = json.loads(res.data)
        
        question = Question.query.filter_by(id=question_id).one_or_none()
        
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'])
        self.assertEqual(question, None)
        
    def test_get_next_question(self):
        quiz = {
            'previous_questions': [], 
            'quiz_category': 2
        }
        res = self.client().post('/quizzes', json=quiz)
        data = json.loads(res.data)
        
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'])
        
    def test_search_question(self):
        search_term = 'What'
        res = self.client().post('/questions', json={'search_term': search_term})
        data = json.loads(res.data)

        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'])
        
        for question in data['questions']:
            self.assertTrue(search_term.lower() in question['question'].lower())


# Make the tests conveniently executable
if __name__ == "__main__":
    unittest.main()
