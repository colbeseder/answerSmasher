import spacy
import sys

from flask import Flask, jsonify, request
from flask_restful import Resource, Api, reqparse


# Load English tokenizer, tagger, parser and NER
nlp = spacy.load("en_core_web_sm")

def combineDefs(text1, text2):
    doc1 = nlp(text1)
    doc2 = nlp(text2)

    nouns1 = [chunk.text for chunk in doc1.noun_chunks]
    nouns2 = [chunk.text for chunk in doc2.noun_chunks]


    haveNouns = min(len(nouns1), len(nouns2)) > 0
    if not haveNouns:
        return text1 + ' ' + text2

    combined = text1.replace(nouns1[-1], nouns2[-1])
    return combined

class Status(Resource):
    def __init__(self):
        pass
    def get(self):
        return {'data':'ok'}, 200

class Combiner(Resource):
    def __init__(self):
        pass
    def post(self):
        json_data = request.get_json(force=True)
        text1 = json_data['text1']
        text2 = json_data['text2']
        return jsonify(result=combineDefs(text1, text2))

app = Flask(__name__)
api = Api(app)

api.add_resource(Combiner, '/combine')
api.add_resource(Status, '/status')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)  # run our Flask app