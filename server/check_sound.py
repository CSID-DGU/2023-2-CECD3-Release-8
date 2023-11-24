import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np
import librosa.display, librosa
import unicodedata
import sys
from os import lseek
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

model = load_model('./model/1115_100.h5', compile=False)
sound_name = ['덕', '덩', '쿵']
# def checkSound(file, jangdan):
def checkSound():
    file = '중중모리4.wav'
    jangdan = 3
    y, sr = librosa.load(file)
    ans = []
    # 굿거리
    if(jangdan == 0):
        ans = ['덩', '덕', '쿵', '덕', '쿵', '덩', '덕', '쿵', '덕', '쿵']
    # 세마치
    if(jangdan == 1):
        ans = ['덩', '덩', '덕', '쿵', '덕']
    # 자진모리
    if(jangdan == 2):
        ans = ['덩', '덕', '쿵', '덕', '쿵', '덕', '쿵', '덕']
    # 중중모리
    if(jangdan == 3):
        ans = ['덩', '덕', '쿵', '덕', '덕', '쿵', '쿵', '덕', '쿵', '쿵']
    # 휘모리
    if(jangdan == 4):
        ans = ['덩', '덕', '덕', '쿵', '덕', '쿵']

    onset_env = librosa.onset.onset_strength(y=y, sr=sr,
                                            hop_length=512,
                                            aggregate=np.median)
    peaks = librosa.util.peak_pick(onset_env, pre_max=1, post_max=3, pre_avg=5, post_avg=5, delta=5, wait=1)
    times = librosa.times_like(onset_env, sr=sr, hop_length=512)
    tmp2 = np.array([len(times)-1])
    peaks = np.append(peaks, tmp2)
    result = []
    for i in range(len(peaks)-1):
        start_frame = peaks[i]-3
        end_frame = peaks[i + 1]-3
        ny = y[round(start_frame*512):round(end_frame*512)]
        mfcc = librosa.feature.mfcc(y=ny, sr=sr, n_mfcc=100)
        pad_width = 75 - mfcc.shape[1]
        if(pad_width < 0): pad_width = 0
        mfcc = np.pad(mfcc, pad_width=((0,0), (0,pad_width)),mode='constant')
        mfcc= np.expand_dims(mfcc, 0)
        print(mfcc.shape)
        check = model.predict(mfcc)[0].tolist()
        cc = check.index(max(check))
        result.append(sound_name[cc])

    al = len(ans)
    cnt = 0
    for i in range(al):
        if(result[i] == unicodedata.normalize('NFC',ans[i])):
            cnt += 1

    acc = round(cnt/al*100, 2)
    print(acc)
    return acc


if __name__ == '__main__': 
    checkSound()
   	# checkSound(sys.argv[1], sys.argv[2])