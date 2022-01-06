import sys

try:
    pixrange = int(sys.argv[1])
except:
    exit("u need to provide a number, dummy")

def symb2color(c):
    color = ( (c * 13) % 255,
             (c * 17) % 255,
             (c * 19) % 255 )
    return(f"{color[0]}:{color[1]}:{color[2]}")

for i in range(pixrange):
    if i<32 or (i >= 127 and i <= 160) or chr(i) in '[]*+.?{}()|`~^':
        continue
    print( f"{i}:{chr(i)}:{symb2color(i)}")
