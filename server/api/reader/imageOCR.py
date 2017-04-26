import cv2
import numpy as np
from PIL import Image, ImageFilter, ImageEnhance
import PIL.ImageOps
import sys
import base64
import requests
import json
from io import BytesIO
from cStringIO import StringIO

# check if cropping area has been define
if sys.argv[2] == 'null' or sys.argv[3] == 'null' or sys.argv[4] == 'null' or sys.argv[5] == 'null':
    exit(1)

img = Image.open(BytesIO(base64.b64decode(sys.argv[1])))
box = (float(sys.argv[2]), float(sys.argv[3]), float(sys.argv[4]) + float(sys.argv[2]), float(sys.argv[5]) + float(sys.argv[3]))
croppedImg = img.crop(box)

img = ImageEnhance.Sharpness(img).enhance(2)
img = PIL.ImageOps.autocontrast(croppedImg)
img = PIL.ImageOps.grayscale(img)

output = StringIO()
img.save(output, format='JPEG')

im_data = output.getvalue()
im_data_b64 = base64.b64encode(im_data)

# print processes image data
print im_data_b64

req_payload = {
    "requests": [
        {
            "image": {
                "content": im_data_b64
            },
            "features": [
                {
                    "type": "TEXT_DETECTION"
                }
            ]
        }
    ]
}

ret = requests.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyCH1YPCOzXuS3co8e8VkpPKE4ZYsTaMfQc',
                    json.dumps(req_payload), headers={'content-type': 'application/json'})

retJson = ret.json()

if hasattr(retJson['responses'][0], 'textAnnotations'):
    unit = retJson['responses'][0]['textAnnotations'][0]['description']
    # print readed number
    print int(filter(str.isdigit, unit))

exit(0)
