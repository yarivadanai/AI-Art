import type { AssemblyTemplate } from "./code-templates";

export const ASSEMBLY_TEMPLATES_EXT: AssemblyTemplate[] = [
  // ─── 1. Simple arithmetic chain ────────────────────────────────────────────
  // eax=7, ebx=4, eax=7+4=11, eax=11*3=33, eax=33-8=25
  {
    code: `mov eax, 7
mov ebx, 4
add eax, ebx
imul eax, eax, 3
sub eax, 8`,
    expectedEax: 25,
    options: [20, 25, 29, 33],
    correctOptionIndex: 1,
  },

  // ─── 2. Shift and XOR ─────────────────────────────────────────────────────
  // eax=5 (0b101), shl 2 => 20 (0b10100), ebx=3, xor => 20^3=23, add 7 => 30
  {
    code: `mov eax, 5
shl eax, 2
mov ebx, 3
xor eax, ebx
add eax, 7`,
    expectedEax: 30,
    options: [28, 30, 32, 23],
    correctOptionIndex: 1,
  },

  // ─── 3. NEG and ADD ────────────────────────────────────────────────────────
  // eax=12, neg => -12, add 50 => 38, sub 3 => 35, shl 1 => 70
  {
    code: `mov eax, 12
neg eax
add eax, 50
sub eax, 3
shl eax, 1`,
    expectedEax: 70,
    options: [62, 70, 76, 80],
    correctOptionIndex: 1,
  },

  // ─── 4. Stack push/pop swap ────────────────────────────────────────────────
  // push 15, push 8, pop eax => eax=8, pop ebx => ebx=15, add => 23, sub 3 => 20
  {
    code: `push 15
push 8
pop eax
pop ebx
add eax, ebx
sub eax, 3`,
    expectedEax: 20,
    options: [18, 20, 23, 26],
    correctOptionIndex: 1,
  },

  // ─── 5. LEA multiply-add chain ─────────────────────────────────────────────
  // eax=6, ebx=2, ecx=lea[6+2*4]=14, eax=lea[14+14*2]=42, sub 2 => 40
  {
    code: `mov eax, 6
mov ebx, 2
lea ecx, [eax + ebx*4]
lea eax, [ecx + ecx*2]
sub eax, 2`,
    expectedEax: 40,
    options: [36, 38, 40, 42],
    correctOptionIndex: 2,
  },

  // ─── 6. AND mask and shift ─────────────────────────────────────────────────
  // eax=0xFF (255), and 0x3C => 0x3C=60, shr 2 => 15, add 10 => 25
  {
    code: `mov eax, 0xFF
and eax, 0x3C
shr eax, 2
add eax, 10`,
    expectedEax: 25,
    options: [15, 20, 25, 30],
    correctOptionIndex: 2,
  },

  // ─── 7. OR and combined bitops ─────────────────────────────────────────────
  // eax=0x0A (10=0b1010), ebx=0x05 (5=0b0101), or => 0x0F=15, shl 1 => 30,
  // xor 0x0F => 30^15 = 0b11110 ^ 0b01111 = 0b10001 = 17
  {
    code: `mov eax, 0x0A
mov ebx, 0x05
or eax, ebx
shl eax, 1
xor eax, 0x0F`,
    expectedEax: 17,
    options: [13, 15, 17, 21],
    correctOptionIndex: 2,
  },

  // ─── 8. imul three-operand ─────────────────────────────────────────────────
  // ebx=9, eax=imul ebx,7 => 63, sub 13 => 50, add 4 => 54, shr 1 => 27
  {
    code: `mov ebx, 9
imul eax, ebx, 7
sub eax, 13
add eax, 4
shr eax, 1`,
    expectedEax: 27,
    options: [25, 27, 31, 54],
    correctOptionIndex: 1,
  },

  // ─── 9. NOT and mask ───────────────────────────────────────────────────────
  // eax=0x55 (01010101=85), not => 0xFFFFFFAA, and 0xFF => 0xAA=170,
  // shr 1 => 85, sub 5 => 80
  {
    code: `mov eax, 0x55
not eax
and eax, 0xFF
shr eax, 1
sub eax, 5`,
    expectedEax: 80,
    options: [75, 80, 85, 90],
    correctOptionIndex: 1,
  },

  // ─── 10. DEC loop to accumulate ────────────────────────────────────────────
  // ecx=4, eax=0
  // iter1: eax=0+4=4, ecx=3
  // iter2: eax=4+3=7, ecx=2
  // iter3: eax=7+2=9, ecx=1
  // iter4: eax=9+1=10, ecx=0 => done
  // shl eax, 1 => 20
  {
    code: `mov ecx, 4
mov eax, 0
.loop:
  add eax, ecx
  dec ecx
  jnz .loop
shl eax, 1`,
    expectedEax: 20,
    options: [10, 16, 20, 24],
    correctOptionIndex: 2,
  },

  // ─── 11. Two-register accumulation loop ────────────────────────────────────
  // ecx=5, eax=1, ebx=1
  // iter1: edx=1+1=2, eax=ebx=1, ebx=edx=2, ecx=4
  // iter2: edx=1+2=3, eax=2, ebx=3, ecx=3
  // iter3: edx=2+3=5, eax=3, ebx=5, ecx=2
  // iter4: edx=3+5=8, eax=5, ebx=8, ecx=1
  // iter5: edx=5+8=13, eax=8, ebx=13, ecx=0
  // eax = ebx = 13
  {
    code: `mov ecx, 5
mov eax, 1
mov ebx, 1
.fib:
  mov edx, eax
  add edx, ebx
  mov eax, ebx
  mov ebx, edx
  dec ecx
  jnz .fib
mov eax, ebx`,
    expectedEax: 13,
    options: [8, 11, 13, 21],
    correctOptionIndex: 2,
  },

  // ─── 12. Conditional branch (taken) ────────────────────────────────────────
  // eax=20, cmp 20,15 => 20>15 so jle NOT taken, sub 5 => 15, shl 2 => 60
  {
    code: `mov eax, 20
cmp eax, 15
jle .skip
sub eax, 5
shl eax, 2
jmp .done
.skip:
add eax, 10
.done:`,
    expectedEax: 60,
    options: [30, 40, 60, 120],
    correctOptionIndex: 2,
  },

  // ─── 13. Conditional branch (not taken) ────────────────────────────────────
  // eax=10, cmp 10,15 => 10<=15 so jle IS taken, add 10 => 20
  {
    code: `mov eax, 10
cmp eax, 15
jle .skip
sub eax, 5
shl eax, 2
jmp .done
.skip:
add eax, 10
.done:`,
    expectedEax: 20,
    options: [5, 10, 15, 20],
    correctOptionIndex: 3,
  },

  // ─── 14. XOR self-clear then build ────────────────────────────────────────
  // eax=0, add 17 => 17, imul 3 => 51, sub 1 => 50
  {
    code: `xor eax, eax
add eax, 17
imul eax, eax, 3
sub eax, 1`,
    expectedEax: 50,
    options: [48, 50, 51, 52],
    correctOptionIndex: 1,
  },

  // ─── 15. Push/pop with arithmetic ─────────────────────────────────────────
  // push 25, push 10, pop ebx => 10, pop eax => 25, sub => 25-10=15,
  // imul 4 => 60, add 7 => 67
  {
    code: `push 25
push 10
pop ebx
pop eax
sub eax, ebx
imul eax, eax, 4
add eax, 7`,
    expectedEax: 67,
    options: [53, 60, 67, 72],
    correctOptionIndex: 2,
  },

  // ─── 16. Nested bit manipulation ───────────────────────────────────────────
  // eax=0b11001100=204, ebx=0b10101010=170
  // and => 0b10001000=136, shr 3 => 17, add 3 => 20
  {
    code: `mov eax, 0xCC
mov ebx, 0xAA
and eax, ebx
shr eax, 3
add eax, 3`,
    expectedEax: 20,
    options: [17, 20, 23, 34],
    correctOptionIndex: 1,
  },

  // ─── 17. INC loop counting ─────────────────────────────────────────────────
  // eax=0, ecx=0
  // iter: ecx=0, 0!=6, inc eax, eax=1, add ecx,2 => ecx=2
  // iter: ecx=2, 2!=6, inc eax, eax=2, ecx=4
  // iter: ecx=4, 4!=6, inc eax, eax=3, ecx=6
  // iter: ecx=6, 6==6, exit
  // imul eax,eax,5 => 15, add 2 => 17
  {
    code: `mov eax, 0
mov ecx, 0
.loop:
  cmp ecx, 6
  je .done
  inc eax
  add ecx, 2
  jmp .loop
.done:
imul eax, eax, 5
add eax, 2`,
    expectedEax: 17,
    options: [12, 15, 17, 20],
    correctOptionIndex: 2,
  },

  // ─── 18. Multi-register pipeline ──────────────────────────────────────────
  // eax=3, ebx=7, ecx=eax+ebx=10, edx=ebx-eax=4
  // eax=ecx*edx=40, add 8 => 48, shr 2 => 12
  {
    code: `mov eax, 3
mov ebx, 7
mov ecx, eax
add ecx, ebx
mov edx, ebx
sub edx, eax
imul eax, ecx, 1
imul eax, edx
add eax, 8
shr eax, 2`,
    expectedEax: 12,
    options: [10, 12, 14, 48],
    correctOptionIndex: 1,
  },

  // ─── 19. Doubling loop ────────────────────────────────────────────────────
  // eax=3, ecx=4
  // iter1: shl eax,1 => 6, ecx=3
  // iter2: 12, ecx=2
  // iter3: 24, ecx=1
  // iter4: 48, ecx=0
  // sub 8 => 40
  {
    code: `mov eax, 3
mov ecx, 4
.double:
  shl eax, 1
  dec ecx
  jnz .double
sub eax, 8`,
    expectedEax: 40,
    options: [32, 36, 40, 48],
    correctOptionIndex: 2,
  },

  // ─── 20. OR chain with shift ──────────────────────────────────────────────
  // eax=1, shl 4 => 16 (0x10), or 0x05 => 21 (0x15), shl 1 => 42 (0x2A),
  // or 0x01 => 43 (0x2B), sub 3 => 40
  {
    code: `mov eax, 1
shl eax, 4
or eax, 0x05
shl eax, 1
or eax, 0x01
sub eax, 3`,
    expectedEax: 40,
    options: [37, 40, 42, 43],
    correctOptionIndex: 1,
  },

  // ─── 21. Signed division ──────────────────────────────────────────────────
  // eax=100, ecx=7, cdq extends sign => edx=0, idiv ecx => eax=14 rem edx=2,
  // add edx => eax=14+2=16
  {
    code: `mov eax, 100
mov ecx, 7
cdq
idiv ecx
add eax, edx`,
    expectedEax: 16,
    options: [14, 16, 100, 2],
    correctOptionIndex: 1,
  },

  // ─── 22. LEA chain ────────────────────────────────────────────────────────
  // eax=5, lea ebx,[5+5*2]=15, lea ecx,[15+5]=20, lea eax,[20+15]=35
  {
    code: `mov eax, 5
lea ebx, [eax + eax*2]
lea ecx, [ebx + eax]
lea eax, [ecx + ebx]`,
    expectedEax: 35,
    options: [25, 30, 35, 40],
    correctOptionIndex: 2,
  },

  // ─── 23. Loop with odd/even add/sub ────────────────────────────────────────
  // ecx=6, eax=0, ebx=1
  // i=1: odd, eax=0+1=1, ebx=2, ecx=5
  // i=2: even, eax=1-2=-1, ebx=3, ecx=4
  // i=3: odd, eax=-1+3=2, ebx=4, ecx=3
  // i=4: even, eax=2-4=-2, ebx=5, ecx=2
  // i=5: odd, eax=-2+5=3, ebx=6, ecx=1
  // i=6: even, eax=3-6=-3, ebx=7, ecx=0
  // add 33 => 30
  {
    code: `mov ecx, 6
mov eax, 0
mov ebx, 1
.loop:
  test ebx, 1
  jz .even
  add eax, ebx
  jmp .next
.even:
  sub eax, ebx
.next:
  inc ebx
  dec ecx
  jnz .loop
add eax, 33`,
    expectedEax: 30,
    options: [27, 30, 33, 36],
    correctOptionIndex: 1,
  },

  // ─── 24. XOR swap then multiply ───────────────────────────────────────────
  // eax=8, ebx=5, xor swap => eax=5, ebx=8, imul eax,ebx => 40, sub 15 => 25
  {
    code: `mov eax, 8
mov ebx, 5
xor eax, ebx
xor ebx, eax
xor eax, ebx
imul eax, ebx
sub eax, 15`,
    expectedEax: 25,
    options: [20, 25, 40, 45],
    correctOptionIndex: 1,
  },

  // ─── 25. Stack-based expression evaluation ────────────────────────────────
  // push 6, push 4, pop ebx=4, pop eax=6, add => 10, push 10,
  // push 3, pop ebx=3, pop eax=10, imul => 30
  {
    code: `push 6
push 4
pop ebx
pop eax
add eax, ebx
push eax
push 3
pop ebx
pop eax
imul eax, ebx`,
    expectedEax: 30,
    options: [18, 24, 30, 36],
    correctOptionIndex: 2,
  },

  // ─── 26. Bit counting loop ────────────────────────────────────────────────
  // ebx=0b10110101=181, ecx=0
  // iter1: test 181&1=1, jz not taken, inc ecx=1, shr => 90
  // iter2: 90&1=0, jz taken, shr => 45
  // iter3: 45&1=1, inc ecx=2, shr => 22
  // iter4: 22&1=0, shr => 11
  // iter5: 11&1=1, inc ecx=3, shr => 5
  // iter6: 5&1=1, inc ecx=4, shr => 2
  // iter7: 2&1=0, shr => 1
  // iter8: 1&1=1, inc ecx=5, shr => 0
  // ebx=0, jnz not taken => exit
  // eax = ecx*3 = 15, add 5 => 20
  {
    code: `mov ebx, 0xB5
mov ecx, 0
.count:
  test ebx, 1
  jz .no_inc
  inc ecx
.no_inc:
  shr ebx, 1
  test ebx, ebx
  jnz .count
imul eax, ecx, 3
add eax, 5`,
    expectedEax: 20,
    options: [15, 18, 20, 23],
    correctOptionIndex: 2,
  },

  // ─── 27. Multiply via shifts and adds ─────────────────────────────────────
  // eax=13, multiply by 5 = 13*4 + 13 = 52 + 13 = 65
  // ebx=13, shl eax,2 => 52, add ebx => 65, sub 15 => 50
  {
    code: `mov eax, 13
mov ebx, eax
shl eax, 2
add eax, ebx
sub eax, 15`,
    expectedEax: 50,
    options: [45, 50, 55, 65],
    correctOptionIndex: 1,
  },

  // ─── 28. Two-pass loop with flag ──────────────────────────────────────────
  // eax=0, ecx=3, edx=1
  // iter1: edx=1, eax=0+3=3, ecx=2, edx=0
  // iter2: edx=0 (jnz not taken), eax=3-2=1, ecx=1, edx=1
  // iter3: edx=1, eax=1+1=2, ecx=0 => done
  // imul eax,eax,10 => 20
  {
    code: `mov eax, 0
mov ecx, 3
mov edx, 1
.loop:
  test edx, edx
  jz .sub_path
  add eax, ecx
  dec ecx
  xor edx, 1
  jmp .check
.sub_path:
  sub eax, ecx
  dec ecx
  xor edx, 1
.check:
  test ecx, ecx
  jnz .loop
imul eax, eax, 10`,
    expectedEax: 20,
    options: [10, 15, 20, 30],
    correctOptionIndex: 2,
  },

  // ─── 29. SHR division equivalent ─────────────────────────────────────────
  // eax=200, shr 3 => 25, add 7 => 32, and 0xFE => 32 (32=0b100000, &0xFE=32)
  {
    code: `mov eax, 200
shr eax, 3
add eax, 7
and eax, 0xFE`,
    expectedEax: 32,
    options: [25, 30, 32, 34],
    correctOptionIndex: 2,
  },

  // ─── 30. Nested branches ──────────────────────────────────────────────────
  // eax=40, ebx=25
  // cmp 40,30 => 40>30, jle not taken
  //   cmp 25,20 => 25>20, jle not taken
  //     eax=40+25=65, shr 1 => 32, jmp .done
  {
    code: `mov eax, 40
mov ebx, 25
cmp eax, 30
jle .else_outer
  cmp ebx, 20
  jle .else_inner
    add eax, ebx
    shr eax, 1
    jmp .done
  .else_inner:
    sub eax, ebx
    jmp .done
.else_outer:
  xor eax, ebx
.done:`,
    expectedEax: 32,
    options: [15, 25, 32, 65],
    correctOptionIndex: 2,
  },

  // ─── 31. Accumulating squares ─────────────────────────────────────────────
  // eax=0, ecx=4 (sum 1^2 + 2^2 + 3^2 + 4^2 = 1+4+9+16 = 30)
  // ebx=1
  // iter1: edx=1*1=1, eax=0+1=1, ebx=2, ecx=3
  // iter2: edx=2*2=4, eax=1+4=5, ebx=3, ecx=2
  // iter3: edx=3*3=9, eax=5+9=14, ebx=4, ecx=1
  // iter4: edx=4*4=16, eax=14+16=30, ebx=5, ecx=0
  {
    code: `mov eax, 0
mov ecx, 4
mov ebx, 1
.loop:
  mov edx, ebx
  imul edx, ebx
  add eax, edx
  inc ebx
  dec ecx
  jnz .loop`,
    expectedEax: 30,
    options: [20, 25, 30, 36],
    correctOptionIndex: 2,
  },

  // ─── 32. Mixed push/pop with bitops ───────────────────────────────────────
  // push 0xFF (255), push 0x0F (15), pop ebx=15, pop eax=255,
  // and => 255 & 15 = 15, shl 2 => 60, or 3 => 63
  {
    code: `push 0xFF
push 0x0F
pop ebx
pop eax
and eax, ebx
shl eax, 2
or eax, 3`,
    expectedEax: 63,
    options: [48, 55, 60, 63],
    correctOptionIndex: 3,
  },

  // ─── 33. Triangular number with loop ──────────────────────────────────────
  // eax=0, ecx=7 (sum 1..7 = 28)
  // iter1: eax=0+7=7, ecx=6
  // iter2: eax=7+6=13, ecx=5
  // iter3: eax=13+5=18, ecx=4
  // iter4: eax=18+4=22, ecx=3
  // iter5: eax=22+3=25, ecx=2
  // iter6: eax=25+2=27, ecx=1
  // iter7: eax=27+1=28, ecx=0
  // xor 0x03 => 28 ^ 3 = 0b11100 ^ 0b00011 = 0b11111 = 31
  {
    code: `mov eax, 0
mov ecx, 7
.sum:
  add eax, ecx
  dec ecx
  jnz .sum
xor eax, 0x03`,
    expectedEax: 31,
    options: [25, 28, 31, 35],
    correctOptionIndex: 2,
  },

  // ─── 34. Factorial via loop (5! = 120) ─────────────────────────────────────
  // eax=1, ecx=5
  // iter1: eax=1*5=5, ecx=4
  // iter2: eax=5*4=20, ecx=3
  // iter3: eax=20*3=60, ecx=2
  // iter4: eax=60*2=120, ecx=1
  // iter5: eax=120*1=120, ecx=0 => done
  // sub 20 => 100
  {
    code: `mov eax, 1
mov ecx, 5
.fact:
  imul eax, ecx
  dec ecx
  jnz .fact
sub eax, 20`,
    expectedEax: 100,
    options: [80, 100, 120, 140],
    correctOptionIndex: 1,
  },

  // ─── 35. GCD-like repeated subtraction ────────────────────────────────────
  // eax=48, ebx=18
  // iter1: 48!=18, 48>18 => eax=48-18=30
  // iter2: 30!=18, 30>18 => eax=30-18=12
  // iter3: 12!=18, 12<18 => ebx=18-12=6
  // iter4: 12!=6, 12>6 => eax=12-6=6
  // iter5: 6==6 => done
  // shl 2 => 24
  {
    code: `mov eax, 48
mov ebx, 18
.gcd:
  cmp eax, ebx
  je .done
  cmp eax, ebx
  jle .sub_b
  sub eax, ebx
  jmp .gcd
.sub_b:
  sub ebx, eax
  jmp .gcd
.done:
shl eax, 2`,
    expectedEax: 24,
    options: [6, 12, 18, 24],
    correctOptionIndex: 3,
  },

  // ─── 36. Countdown with XOR toggle ────────────────────────────────────────
  // eax=0, ecx=5, edx=0
  // iter1: edx=0^1=1, eax=0+1=1, ecx=4
  // iter2: edx=1^1=0, eax=1+0=1, ecx=3
  // iter3: edx=0^1=1, eax=1+1=2, ecx=2
  // iter4: edx=1^1=0, eax=2+0=2, ecx=1
  // iter5: edx=0^1=1, eax=2+1=3, ecx=0
  // imul eax,eax,9 => 27, add 3 => 30
  {
    code: `mov eax, 0
mov ecx, 5
mov edx, 0
.loop:
  xor edx, 1
  add eax, edx
  dec ecx
  jnz .loop
imul eax, eax, 9
add eax, 3`,
    expectedEax: 30,
    options: [24, 27, 30, 33],
    correctOptionIndex: 2,
  },

  // ─── 37. Power of 2 check pattern ────────────────────────────────────────
  // eax=64, ebx=eax=64, dec ebx => 63, and eax,ebx => 64&63=0,
  // jnz not taken, eax=1 (isPowerOf2), shl 5 => 32, add 8 => 40
  {
    code: `mov eax, 64
mov ebx, eax
dec ebx
and eax, ebx
jnz .not_pow2
mov eax, 1
jmp .done
.not_pow2:
mov eax, 0
.done:
shl eax, 5
add eax, 8`,
    expectedEax: 40,
    options: [8, 32, 40, 64],
    correctOptionIndex: 2,
  },

  // ─── 38. Multiply by 7 via LEA ────────────────────────────────────────────
  // eax=6, lea ebx,[6+6*2]=18 (3*6), lea eax,[6+18*2]=6+36=42 (7*6),
  // sub 2 => 40, xor 0x07 => 40^7=0b101000^0b000111=0b101111=47
  {
    code: `mov eax, 6
lea ebx, [eax + eax*2]
lea eax, [eax + ebx*2]
sub eax, 2
xor eax, 0x07`,
    expectedEax: 47,
    options: [40, 42, 45, 47],
    correctOptionIndex: 3,
  },

  // ─── 39. Register chain with neg ──────────────────────────────────────────
  // eax=15, ebx=eax=15, neg ebx => -15, add eax,ebx => 0, add 100 => 100,
  // shr 2 => 25, add 5 => 30
  {
    code: `mov eax, 15
mov ebx, eax
neg ebx
add eax, ebx
add eax, 100
shr eax, 2
add eax, 5`,
    expectedEax: 30,
    options: [20, 25, 30, 35],
    correctOptionIndex: 2,
  },

  // ─── 40. Multi-branch selector ────────────────────────────────────────────
  // eax=3, ecx=3
  // cmp 3,1 => not equal, jne .not1 taken
  // cmp 3,2 => not equal, jne .not2 taken
  // cmp 3,3 => equal, jne .not3 NOT taken
  // eax = 3*3 = 9, jmp .done
  // imul eax,eax,5 => 45, add 5 => 50
  {
    code: `mov eax, 3
mov ecx, eax
cmp ecx, 1
jne .not1
  mov eax, 10
  jmp .done
.not1:
cmp ecx, 2
jne .not2
  mov eax, 20
  jmp .done
.not2:
cmp ecx, 3
jne .not3
  imul eax, ecx
  jmp .done
.not3:
  mov eax, 0
.done:
imul eax, eax, 5
add eax, 5`,
    expectedEax: 50,
    options: [30, 40, 50, 55],
    correctOptionIndex: 2,
  },
];
