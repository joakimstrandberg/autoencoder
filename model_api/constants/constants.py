import pickle
import os

#mnist
mnist_pc_order = [21,4,13,15,7,2,17,26,1,8,14,3,27,30,28,22,10,29,11,18,24,19,0,12,9,25,23,5,31,6,20,16]
with open(str(os.path.dirname(os.path.realpath(__file__)))+"/mnist_min", 'rb') as f:
    mnist_min = pickle.load(f)
f.close()
with open(str(os.path.dirname(os.path.realpath(__file__)))+"/mnist_max", 'rb') as f:
    mnist_max = pickle.load(f)
f.close()
with open(str(os.path.dirname(os.path.realpath(__file__)))+"/mnist_steps", 'rb') as f:
    mnist_step = pickle.load(f)
f.close()

#Faces
with open(str(os.path.dirname(os.path.realpath(__file__)))+"/faces_order", 'rb') as f:
    faces_pc_order = pickle.load(f)
f.close()
with open(str(os.path.dirname(os.path.realpath(__file__)))+"/faces_min", 'rb') as f:
    faces_min = pickle.load(f)
f.close()
with open(str(os.path.dirname(os.path.realpath(__file__)))+"/faces_max", 'rb') as f:
    faces_max = pickle.load(f)
f.close()
with open(str(os.path.dirname(os.path.realpath(__file__)))+"/faces_steps", 'rb') as f:
    faces_step = pickle.load(f)
f.close()



