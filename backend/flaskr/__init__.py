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
                              'Content-Type, Authorization')
        response.headers.add('Access-Control-Allow-Methods',
                              'GET, POST, PATCH, DELETE, OPTIONS')
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
  
    return app

    
