import sys, os
from os import walk
import subprocess, json
import sqlite3
import cv2

#pip3 install opencv-python

supportedMedia = [
  'AVI', 'MPEG', 'WMV', 'ASF', 'FLV', 'MKV', 'MKA',
  'MP4', 'M4A', 'AAC', 'NUT', 'OGG', 'OGM', 'MOV',
  'RAM', 'RM', 'RV', 'RA', 'RMVB', '3GP', 'VIVO', 'PVA',
  'NUV', 'NSV', 'NSA', 'FLI', 'FLC', 'DVR-MS', 'WTV', 'TRP',
  'F4V'
]

def is_video_file(file):
  ext = os.path.splitext(file)[1][1:].upper()
  return ext in supportedMedia

def get_video_length(file):
  try:
    video = cv2.VideoCapture(file)
    frame_count = video.get(cv2.CAP_PROP_FRAME_COUNT)
    fps = video.get(cv2.CAP_PROP_FPS)
    return int(float(frame_count / fps) / 60)
  except:
    return 0
  # try:
  #   result = subprocess.check_output(
  #             f'ffprobe -v quiet -show_streams -select_streams v:0 -of json "{file}"',
  #             shell=True).decode()
  #   fields = json.loads(result)['streams'][0]
    
  #   if os.path.splitext(file)[1][:1] == 'mkv':
  #     print(fields)

  #   if not 'duration' in fields:
  #     return 0
  #   duration = fields['duration']
  #   return int(float(duration) / 60)
  # except:
  #   return 0

def updateDB(scannedDirs, db_dir):
  conn = sqlite3.connect(db_dir, detect_types=sqlite3.PARSE_DECLTYPES)
  cursor = conn.cursor()
  cursor.execute('DELETE FROM content')
  cursor.execute('DELETE FROM media')
  for dir in scannedDirs:
    cursor.execute('INSERT INTO content(name) VALUES (?)', [dir['dir']])
    created_dir_id = cursor.lastrowid
    for file in dir['files']:
      cursor.execute('INSERT INTO media(path,filename,duration,played,content_id) VALUES (?,?,?,?,?)', 
      [
        file['path'],
        file['filepath'],
        file['duration'],
        0,
        created_dir_id,
      ])
    cursor.execute('SELECT AVG(duration) as duration FROM media WHERE content_id=%s' % created_dir_id)
    avg_duration = cursor.fetchone()[0]
    cursor.execute('UPDATE content SET avg_duration=%s WHERE id=%s' % (avg_duration, created_dir_id))
  conn.commit()
  conn.close()


data = sys.stdin.readlines()
data = data[0].strip()
data = data.split(',')
selected_path = data[0].strip()
db_dir = data[1].strip()
os.listdir(selected_path)
dirs = []
failedScanFiles = []

for dir in os.scandir(selected_path):
  if dir.is_dir():
    scannedFiles = []
    for (dir_path, dir_names, file_names) in walk(dir.path):
      for file in file_names:
        if is_video_file(file):
          duration = get_video_length(f'{dir_path}/{file}')
          if duration == 0:
            failedScanFiles.append(file)
          else:
            scannedFiles.append({
              # 'path': dir_path,
              'path': f'{os.path.relpath(dir_path, selected_path)}/',
              'filepath': file,
              'duration': duration
            })
    dirs.append({
      'dir': dir.name,
      'files': scannedFiles
    })
          
# for (dir_path, dir_names, file_names) in walk(dir_path):
#     scannedFiles = []
#     for file in file_names:
#       if is_video_file(file):
#         duration = get_video_length(f'{dir_path}/{file}')
#         if duration == 0:
#           failedScanFiles.append(file)
#         scannedFiles.append({
#           'path': dir_path,
#           'filepath': file,
#           'duration': duration
#         })
#     if len(scannedFiles) > 0:
#       dirs.append({
#         'dir': dir_names,
#         'files': scannedFiles
#       })
# print(json.dumps(dirs))
updateDB(dirs, db_dir)
# print(scannedFiles)
print(json.dumps(failedScanFiles))
sys.stdout.flush()