import tensorflow as tf
import keras
import numpy as np
import io
import os
from PIL import Image
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input

original_dense_from_config = keras.layers.Dense.from_config
def patched_dense_from_config(config):
    config.pop('quantization_config', None)
    return original_dense_from_config(config)
keras.layers.Dense.from_config = patched_dense_from_config

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "powernest_expert_v1.keras")
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

CLASS_MAP = {
    0: {"name": "Organic", "bin": "bd"},      # BD
    1: {"name": "E-Waste", "bin": "ewaste"},  # E_Waste
    2: {"name": "Hazardous", "bin": "medical"}, # Medical
    3: {"name": "Recyclable", "bin": "nbd"}   # NBD
}

async def classify_image(image_bytes: bytes) -> dict:
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224))
    
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array) 
    predictions = model.predict(img_array, verbose=0)
    idx = np.argmax(predictions)
    confidence = float(np.max(predictions) * 100)

    result = CLASS_MAP[idx]
    
    print(f"🧠 [AI REAL] Classified as: {result['name']} ({confidence:.2f}%)")
    
    return {
        "category": result["name"],
        "confidence": round(confidence, 2),
        "bin_id": result["bin"]
    }