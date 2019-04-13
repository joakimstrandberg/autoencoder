import pickle
import os
import numpy as np

#Faces
with open(str(os.path.dirname(os.path.realpath(__file__)))+"/faces_order", 'rb') as f:
    faces_pc_order = pickle.load(f)
f.close()
with open(str(os.path.dirname(os.path.realpath(__file__)))+"/faces_min", 'rb') as f:
    faces_min = pickle.load(f)
    fmin = np.array(faces_min)
    fmin = fmin[np.array(faces_pc_order)]
f.close()
pickle.dump(fmin.tolist(),open("faces_min",'wb'))
with open(str(os.path.dirname(os.path.realpath(__file__)))+"/faces_max", 'rb') as f:
    faces_max = pickle.load(f)
    fmax = np.array(faces_max)
    fmax = fmax[np.array(faces_pc_order)]
f.close()
pickle.dump(fmax.tolist(),open("faces_max",'wb'))
with open(str(os.path.dirname(os.path.realpath(__file__)))+"/faces_steps", 'rb') as f:
    faces_step = pickle.load(f)
    fs = np.array(faces_step)
    fs = fs[np.array(faces_pc_order)]
f.close()
pickle.dump(fs.tolist(),open("faces_steps",'wb'))