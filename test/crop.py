import sys, zlib, struct
src, dst, W, H = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
data = open(src, 'rb').read(); pos, idat = 8, b''
while pos < len(data):
    n = struct.unpack('>I', data[pos:pos+4])[0]; t = data[pos+4:pos+8]; b = data[pos+8:pos+8+n]
    if t == b'IHDR': w0, h0, depth, ct, _, _, il = struct.unpack('>IIBBBBB', b)
    elif t == b'IDAT': idat += b
    pos += 12 + n
assert depth == 8 and ct in (2, 6) and il == 0, (depth, ct, il)
bpp = 4 if ct == 6 else 3
raw = zlib.decompress(idat); stride = w0 * bpp; prev = bytearray(stride); i = 0; rows = []
for y in range(min(h0, H)):
    f = raw[i]; line = bytearray(raw[i+1:i+1+stride]); i += 1 + stride
    if f == 1:
        for k in range(bpp, stride): line[k] = (line[k] + line[k-bpp]) & 255
    elif f == 2:
        for k in range(stride): line[k] = (line[k] + prev[k]) & 255
    elif f == 3:
        for k in range(stride): line[k] = (line[k] + ((line[k-bpp] if k >= bpp else 0) + prev[k]) // 2) & 255
    elif f == 4:
        for k in range(stride):
            a = line[k-bpp] if k >= bpp else 0; b = prev[k]; c = prev[k-bpp] if k >= bpp else 0
            p = a + b - c; pa, pb, pc = abs(p-a), abs(p-b), abs(p-c)
            line[k] = (line[k] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
    rows.append(bytes(line[:W*bpp])); prev = line
out = b''.join(b'\x00' + r for r in rows)
def chunk(t, b): return struct.pack('>I', len(b)) + t + b + struct.pack('>I', zlib.crc32(t + b) & 0xffffffff)
open(dst, 'wb').write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', W, len(rows), 8, ct, 0, 0, 0)) + chunk(b'IDAT', zlib.compress(out, 9)) + chunk(b'IEND', b''))
