from PIL import Image
import math, sys

try:
    fname = sys.argv[1]
except:
    exit("u need a filename, dummy")
    
im = Image.open(fname)

with open('symbols.txt','r') as symfile:
    symbols = [ x.strip().split(':') for x in symfile.readlines() ]

symdict = {}
for a in symbols:
    try:
        symdict[(int(a[2]), int(a[3]), int(a[4]))] =  a[1]
    except:
        continue
symkeys = list(symdict.keys())

def pix_dist(x,y,z,a,b,c):
    return math.sqrt((x-a)**2 + (y-b)**2 + (z-c)**2)

pixels = list(im.getdata())
pixcolors = set(pixels)

pixdict = {}

for i in pixcolors:
    dists = { pix_dist( i[0], i[1], i[2], k[0], k[1], k[2] ) : k for k in symkeys }
    pixdict[i] = dists[min(dists.keys())]

str_out = ''
for i in pixels:
    str_out += symdict[pixdict[i]]

#print(str_out)
compressed_str = ''
last_char = ''
last_ctr = 1
ctr = 1
setbuf = ''
for a in str_out:
    if a == last_char:
        ctr += 1
        if setbuf != '' and len(setbuf) > 5:
            compressed_str += f"[{''.join(set(setbuf))}]{{{len(setbuf)}}}"
            setbuf = ''
        else:
            compressed_str += setbuf
            setbuf = ''
    else:
        if ctr > 1:
            compressed_str += f'{last_char}{{{ctr}}}' if ctr > 3 else last_char * ctr
        else:
            if last_ctr == 1:
                setbuf += last_char
            else:
                compressed_str += last_char
        last_char = a
        last_ctr = ctr
        ctr = 1
compressed_str += f'{last_char}{{{ctr}}}' if ctr > 1 else last_char


print(compressed_str)
