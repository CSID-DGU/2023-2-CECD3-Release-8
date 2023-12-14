import tensorflow as tf
import numpy as np
import librosa
import sys
import os
import json

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
os.environ['KMP_DUPLICATE_LIB_OK']='True'

model_name = '1115_100.h5'
model = tf.keras.models.load_model(model_name, compile=False)
# sound_name = ['덕', '덩', '쿵']
def checkSound(jangdan):
    # 소리 체크
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

    # motion
    Time = librosa.times_like(onset_env, sr=sr, hop_length=512)
    end_time = int(round(Time[-1],1)*10)
    motion_times = []
    for p in peaks:
      motion_times.append(round(Time[p], 1))
    motion_times = [int(motion_times[i]*10) for i in range(len(motion_times))]
    # print(motion_times)
    # motion

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


    # 모션 체크
    p_time = []
    le = []
    lw = []
    re = []
    rw = []

    
    with open('janggu_poses.json') as file:
        datas = json.load(file)  # datas[0]이 전체 좌표값
    # print(file)
    for i, data in enumerate(datas):  #없으면 전 값 그대로 채우기

        p_time.append(int(data[0]['time']//100))

        if 'le' in data[0].keys() : le.append(data[0]['le']['y'])
        else :
            if i==0 : le.append(300)
            else : le.append(le[-1])

        if 'lw' in data[0].keys() : lw.append(data[0]['lw']['y'])
        else :
            if i==0 : lw.append(300)
            else : lw.append(lw[-1])

        if 're' in data[0].keys() : re.append(data[0]['re']['y'])
        else :
            if i==0: re.append(300)
            else : re.append(re[-1])

        if 'rw' in data[0].keys() : rw.append(data[0]['rw']['y'])
        else :
            if i==0 : rw.append(300)
            else : rw.append(rw[-1])

    com_time = p_time[-1] - end_time
    # print(com_time, p_time[-1], end_time)

    while True:
        if p_time[0] <= com_time:
            p_time.pop(0)
            le.pop(0)
            lw.pop(0)
            re.pop(0)
            rw.pop(0)
        else:
            break

    response = []
    cnt = -1
    
    i = 0
    for idx, time in enumerate(motion_times):  #장단 구음 수만큼 반복문 진행
        if idx >= len(ans) : break  #피크 타임들에서 장단 개수 넘어갈 때부터는 패스

        le_max, lw_max, re_max, rw_max = 0, 0, 0, 0
        le_min, lw_min, re_min, rw_min = 1000, 1000, 1000, 1000
        cnt = cnt+1

        while True:  #각 구음에 대하여 관절의 최대 및 최소 구하기

            while True:  #인덱스값 조정
                check = True  #덕 체크 변수
                if p_time[i] < time-5:  #인덱스값 time 앞으로
                    i = i+1
                else: break

            if p_time[i] >= time-5 and p_time[i] < time+5:
                if le_max < le[i] : le_max = le[i] #왼쪽 팔꿈치
                if le_min > le[i] : le_min = le[i]
                if lw_max < lw[i] : lw_max = lw[i] #왼쪽 팔목
                if lw_min > lw[i] : lw_min = lw[i]
                if re_max < re[i] : re_max = re[i] #오른쪽 팔꿈치
                if re_min > re[i] : re_min = re[i]
                if rw_max < rw[i] : rw_max = rw[i] #오른쪽 팔목
                if rw_min > rw[i] : rw_min = rw[i]
                if rw[i] < re[i] : check = False  #덕 체크
                i = i+1
            else: break

        if ans[cnt] == 2:
            if (le_min < lw_max) and (le_min > lw_min) : response.append(1)
            else : response.append(0)
        elif ans[cnt] == 0:
            if check : response.append(1)
            else : response.append(0)
        elif ans[cnt] == 1:
            if ((le_min < lw_max) and (le_min > lw_min)) and check : response.append(1)
            else : response.append(0)
        i = i-10

    diff =  len(sound) - len(response)
    if (diff > 0):
        for i in range(diff):
            response.append(-1)

    ret = {
        "peaks": peaks.tolist(),
        "sound" : sound,
        "sound_acc": acc,
        "motion": response,
        "motion_acc": round(response.count(1)/len(response)*100, 2)
    }
    print(ret)

    return "end"

if __name__ == '__main__': 
   	checkSound(sys.argv[1])