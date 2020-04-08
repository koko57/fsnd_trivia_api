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
            'categories': categories,
            'current_category': None
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
            'message': 'Question successfully created',
            'question': {
                'question': question,
                'answer': answer,
                'category': category,
                'difficulty': difficulty,
            }
        })

    @app.route('/questions/search', methods=['POST'])
    def search_question():
        body = request.get_json()
        search_term = body.get('search_term', None)
        searched_question = Question.query.filter(
                Question.question.ilike(f'%{search_term}%')).all()
        return jsonify({
            'success': True,
            'questions': [question.format() for question in searched_question],
            'total_questions': len(searched_question)
        })
    
    @app.route('/categories/<int:category_id>/questions')
    def get_questions_by_category(category_id):
        category = Category.query.filter_by(id=category_id).first()

        if category is None:
            abort(404)

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
        try:
            question.delete()
        except:
            abort(422)
        return jsonify({
            'success': True,
            'message': 'Question successfully deleted',
            'id': question_id
        })

    @app.route('/quizzes', methods=['POST'])
    def get_next_question():
        body = request.get_json()
        category = body['quiz_category']
        previous_questions = body['previous_questions']
        index = len(previous_questions)
        questions_query = Question.query
        
        if category != 0:
            questions_query = Question.query.filter(
                Question.category == category)
        
        questions = questions_query.filter(Question.id not in previous_questions).all()
        
        next_question = questions[index]
        
        if index == questions_query.count() - 1:
            return jsonify({
                'success': True,
                'question': next_question.format(),
                'last_question': True
            })
        
        if index > questions_query.count() - 1:
            abort(404)

        return jsonify({
            'success': True,
            'question': next_question.format(),
            'last_question': False
        })

    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({
            "success": False,
            "error": 400,
            "message": "Bad request"
        }), 400

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            "success": False,
            "error": 404,
            "message": "Resource not found"
        }), 404

    @app.errorhandler(405)
    def not_allowed(error):
        return jsonify({
            "success": False,
            "error": 405,
            "message": "Method not allowed"
        }), 405

    @app.errorhandler(422)
    def unprocessable(error):
        return jsonify({
            "success": False,
            "error": 422,
            "message": "Unprocessable request"
        }), 422

    @app.errorhandler(500)
    def server_error(error):
        return jsonify({
            "success": False,
            "error": 500,
            "message": "Internal server error"
        }), 500

    return app
