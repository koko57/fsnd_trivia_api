import os
from flask import Flask, request, abort, jsonify, redirect, url_for
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
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Headers',
                             'Content-Type, Authorization, true')
        response.headers.add('Access-Control-Allow-Methods',
                             'GET, POST, PATCH, DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials',
                             'true')

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
            'total_questions': len(results),
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
            new_quesion = Question(
                question=question, answer=answer, category=category, difficulty=difficulty)
            new_quesion.insert()
        except:
            abort(422)

        return jsonify({
            'success': True,
        })

    @app.route('/categories/<int:category_id>/questions')
    def get_questions_by_category(category_id):
        category = Category.query.filter_by(id=category_id).first()
        questions = [question.format() for question in category.questions]
        
        return jsonify({
            'success': True,
            'questions': questions,
            'total_questions': len(questions),
            'current_category': category.format()
        })
        
    @app.route('/questions/<int:question_id>', methods=['DELETE'])
    def delete_question(question_id):
        question = Question.query.filter_by(id=question_id).first()
        deleted_id = question.id
        try:
            question.delete()
            redirect(url_for('get_paginated_questions'))
        except:
            abort(422)
        return jsonify({
            'success': True,
            'deleted_question': deleted_id,
        })

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
