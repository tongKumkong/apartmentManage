import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
import PIL.ImageOps
import sys
import base64
import requests
import json
from cStringIO import StringIO

img = Image.open(sys.argv[1])
box = (  float(sys.argv[2]), float(sys.argv[3]),float(sys.argv[4]) + float(sys.argv[2]),float(sys.argv[5]) + float(sys.argv[3])) 
croppedImg = img.crop(box)

img = ImageEnhance.Sharpness(img).enhance(2)
img = PIL.ImageOps.autocontrast(croppedImg)
img = PIL.ImageOps.grayscale(img)

output = StringIO()
img.save(output, format='JPEG')

im_data = output.getvalue()
im_data_b64 = base64.b64encode(im_data)

req_payload = {
    "requests": [
        {
            "image": {
                "content" : im_data_b64
            },
            "features" : [
                {
                    "type": "TEXT_DETECTION"
                }
            ]
        }
    ]
}

ret = requests.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCH1YPCOzXuS3co8e8VkpPKE4ZYsTaMfQc',json.dumps(req_payload),headers={'content-type': 'application/json'})

retJson = ret.json()
unit = retJson['responses'][0]['textAnnotations'][0]['description']

#save read number to history

requests.post('http://127.0.0.1:3000/api/readers/reading/'+argv[6],{
    "image": im_data_b64,
    "unit": unit
})