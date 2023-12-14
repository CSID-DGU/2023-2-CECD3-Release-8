import tensorflow as tf
import numpy as np
import librosa
import sys
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['KMP_DUPLICATE_LIB_OK']='True'

model = tf.keras.models.load_model('1115_100.h5', compile=False)
# sound_name = ['덕', '덩', '쿵']
def checkSound(jangdan):
    file = "C:\\Users\\82109\\Downloads\\janggu_audio.wav"
    y, sr = librosa.load(file)
    ans = []
    # 굿거리
    if(jangdan == '0'):
        # ans = ['덩', '덕', '쿵', '덕', '쿵', '덩', '덕', '쿵', '덕', '쿵']
        ans = [1, 0, 2, 0, 2, 1, 0, 2, 0, 2]
    # 세마치
    if(jangdan == '1'):
        # ans = ['덩', '덩', '덕', '쿵', '덕']
        ans = [1, 1, 0, 2, 0]
    # 자진모리
    if(jangdan == '2'):
        # ans = ['덩', '덕', '쿵', '덕', '쿵', '덕', '쿵', '덕']
        ans = [1, 0, 2, 0, 2, 0, 2, 0]
    # 중중모리
    if(jangdan == '3'):
        # ans = ['덩', '덕', '쿵', '덕', '덕', '쿵', '쿵', '덕', '쿵', '쿵']
        ans = [1, 0, 2, 0, 0, 2, 2, 0, 2, 2]
    # 휘모리
    if(jangdan == '4'):
        # ans = ['덩', '덕', '덕', '쿵', '덕', '쿵']
        ans = [1, 0, 0, 2, 0, 2]

    onset_env = librosa.onset.onset_strength(y=y, sr=sr,
                                            hop_length=512,
                                            aggregate=np.median)
    peaks = librosa.util.peak_pick(onset_env, pre_max=10, post_max=10, pre_avg=10, post_avg=10, delta=10, wait=5)
    peaks = [peak for peak in peaks if peak*0.02205 > 4]
    times = librosa.times_like(onset_env, sr=sr, hop_length=512)
    tmp2 = np.array([len(times)-1])
    peaks = np.append(peaks, tmp2)
    sound = []
    for i in range(len(peaks)-1):
        start_frame = peaks[i]-3
        end_frame = peaks[i + 1]-3
        ny = y[round(start_frame*512):round(end_frame*512)]
        mfcc = librosa.feature.mfcc(y=ny, sr=sr, n_mfcc=100)
        pad_width = 75 - mfcc.shape[1]
        if(pad_width < 0): pad_width = 0
        mfcc = np.pad(mfcc, pad_width=((0,0), (0,pad_width)),mode='constant')
        mfcc= np.expand_dims(mfcc, 0)
        check = model.predict(mfcc, verbose=0)[0].tolist()
        cc = check.index(max(check))
        sound.append(cc)

    al = len(ans)
    sl = len(sound)
    cnt = 0
    for i in range(al):
        if(i >= sl):
            sound.append(-1)
        if(sound[i] == ans[i]):
            cnt += 1
    acc = round(cnt/al*100, 2)

    ret = {
        "peaks": peaks.tolist(),
        "sound" : sound,
        "acc": acc
    }
    print(ret)
    
    return "end"


if __name__ == '__main__': 
   	checkSound(sys.argv[1])