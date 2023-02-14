from flask import Flask, request
import tensorflow as tf

app = Flask(__name__)

# Load your saved TensorFlow model
model = tf.saved_model.load("python/sentiment")
@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    prediction = 1 if model([data]).numpy()[0][0] >=0.5 else 0
    return str(prediction)

if __name__ == '__main__':
    app.run(debug=True)
