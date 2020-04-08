import os
from flask import Flask, request, abort, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import random

from models import setup_db, Question, Category

QUESTIONS_PER_PAGE = 10


def paginate_results(page, results):
    start = (page - 1) * QUESTIONS_PER_PAGE
    end = start + QUESTIONS_PER_PAGE

    questions = [question.format() for question in results]
    displayed_questions = questions[start:end]

    return displayed_questions


def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__)
    setup_db(app)
    CORS(app)

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type, Authorization, true')
        response.headers.add('Access-Control-Allow-Methods',
                             'GET, POST, PATCH, DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials',
                             'true')

        print(response)
        return response

    @app.route('/questions')
    def get_paginated_questions():
        page = request.args.get('page', 1, type=int)
        results = Question.query.all()
        categories = [category.format() for category in Category.query.all()]
        questions = paginate_results(page, results)

        return jsonify({
            'success': True,
            'questions': questions,
            'questions_count': len(questions),
            'categories': categories
        })

    @app.route('/categories')
    def get_categories():
        categories = [category.format() for category in Category.query.all()]

        return jsonify({
            'success': True,
            'categories': categories
        })

    @app.route('/questions', methods=['POST'])
    def add_a_question():
        body = request.get_json()
        
        question = body['question']
        answer = body['answer']
        category = body['category']
        difficulty = body['difficulty']

        try:
            new_quesion = Question(question=question, answer=answer, category=category, difficulty=difficulty)
            print(question)
            new_quesion.insert()
        except:
            abort(422)

        return jsonify({
            'success': True,
        })
    '''
    TODO: 
    Create an endpoint to DELETE question using a question ID. 

    TEST: When you click the trash icon next to a question, the question will be removed.
    This removal will persist in the database and when you refresh the page. 
    '''

    '''
    TODO: 
    Create an endpoint to POST a new question, 
    which will require the question and answer text, 
    category, and difficulty score.

    TEST: When you submit a question on the "Add" tab, 
    the form will clear and the question will appear at the end of the last page
    of the questions list in the "List" tab.  
    '''

    '''
    TODO: 
    Create a POST endpoint to get questions based on a search term. 
    It should return any questions for whom the search term 
    is a substring of the question. 

    TEST: Search by any phrase. The questions list will update to include 
    only question that include that string within their question. 
    Try using the word "title" to start. 
    '''

    '''
    TODO: 
    Create a GET endpoint to get questions based on category. 

    TEST: In the "List" tab / main screen, clicking on one of the 
    categories in the left column will cause only questions of that 
    category to be shown. 
    '''

    '''
    TODO: 
    Create a POST endpoint to get questions to play the quiz. 
    This endpoint should take category and previous question parameters 
    and return a random questions within the given category, 
    if provided, and that is not one of the previous questions. 

    TEST: In the "Play" tab, after a user selects "All" or a category,
    one question at a time is displayed, the user is allowed to answer
    and shown whether they were correct or not. 
    '''

    '''
    TODO: 
    Create error handlers for all expected errors 
    including 404 and 422. 
    '''

    return app
