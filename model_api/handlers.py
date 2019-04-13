import numpy as np

def sort_pc(encoder,data):
    encoded = encoder.predict(data)
    variance = np.var(encoded, axis=0)
    sorted_ix = np.argsort(variance)[::-1]
    return sorted_ix

def calc_max(encoded_data):
    max_arr = np.amax(encoded_data, axis=0)
    return max_arr

def calc_min(encoded_data):
    min_arr = np.amin(encoded_data, axis=0)
    return min_arr