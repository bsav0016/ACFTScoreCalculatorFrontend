def createReadableCalculations(raw_calculations):
    rows = raw_calculations.strip().split('\n')
    ages = [0, 20, 27, 39, 99]

    for i in range(len(rows)):
        row = rows[i]
        columns = row.split()
        new_columns = []
        j = 1
        while j < len(columns):
            new_columns.append(columns[j])
            j += 2
        print(f'{columns[0].replace('″', '')}: {{')
        for j in range(len(new_columns)):
            print_str = "\t"
            print_str += f"{ages[j]}"
            print_str += ": "
            print_str += f"'{new_columns[j]}'"
            print_str += ", "
            print(print_str)
        print("},")


rawMaleHeightWeight = '''60″	97 lbs.	132 lbs.	136 lbs.	139 lbs.	141 lbs.
61″	100 lbs.	136 lbs.	140 lbs.	144 lbs.	146 lbs.
62″	104 lbs.	141 lbs.	144 lbs.	148 lbs.	150 lbs.
63″	107 lbs.	145 lbs.	149 lbs.	153 lbs.	155 lbs.
64″	110 lbs.	150 lbs.	154 lbs.	158 lbs.	160 lbs.
65″	114 lbs.	155 lbs.	159 lbs.	163 lbs.	165 lbs.
66″	117 lbs.	160 lbs.	163 lbs.	168 lbs.	170 lbs.
67″	121 lbs.	165 lbs.	169 lbs.	174 lbs.	176 lbs.
68″	125 lbs.	170 lbs.	174 lbs.	179 lbs.	181 lbs.
69″	128 lbs.	175 lbs.	179 lbs.	184 lbs.	186 lbs.
70″	132 lbs.	180 lbs.	185 lbs.	189 lbs.	192 lbs.
71″	136 lbs.	185 lbs.	189 lbs.	194 lbs.	197 lbs.
72″	140 lbs.	190 lbs.	195 lbs.	200 lbs.	203 lbs.
73″	144 lbs.	195 lbs.	200 lbs.	205 lbs.	208 lbs.
74″	148 lbs.	201 lbs.	206 lbs.	211 lbs.	214 lbs.
75″	152 lbs.	206 lbs.	212 lbs.	217 lbs.	220 lbs.
76″	156 lbs.	212 lbs.	217 lbs.	223 lbs.	226 lbs.
77″	160 lbs.	218 lbs.	223 lbs.	229 lbs.	232 lbs.
78″	164 lbs.	223 lbs.	229 lbs.	235 lbs.	238 lbs.
79″	168 lbs.	229 lbs.	235 lbs.	241 lbs.	244 lbs.
80″	173 lbs.	234 lbs.	240 lbs.	247 lbs.	250 lbs.'''


rawFemaleHeightWeight = '''58″	91 lbs.	119 lbs.	121 lbs.	122 lbs.	124 lbs.
59″	94 lbs.	124 lbs.	125 lbs.	126 lbs.	128 lbs.
60″	97 lbs.	128 lbs.	129 lbs.	131 lbs.	133 lbs.
61″	100 lbs.	132 lbs.	134 lbs.	135 lbs.	137 lbs.
62″	104 lbs.	136 lbs.	138 lbs.	140 lbs.	142 lbs.
63″	107 lbs.	141 lbs.	143 lbs.	144 lbs.	146 lbs.
64″	110 lbs.	145 lbs.	147 lbs.	149 lbs.	151 lbs.
65″	114 lbs.	150 lbs.	152 lbs.	154 lbs.	156 lbs.
66″	117 lbs.	155 lbs.	156 lbs.	158 lbs.	161 lbs.
67″	121 lbs.	159 lbs.	161 lbs.	163 lbs.	166 lbs.
68″	125 lbs.	164 lbs.	166 lbs.	168 lbs.	171 lbs.
69″	128 lbs.	169 lbs.	171 lbs.	173 lbs.	176 lbs.
70″	132 lbs.	174 lbs.	176 lbs.	178 lbs.	181 lbs.
71″	136 lbs.	179 lbs.	181 lbs.	183 lbs.	186 lbs.
72″	140 lbs.	184 lbs.	186 lbs.	188 lbs.	191 lbs.
73″	144 lbs.	189 lbs.	191 lbs.	194 lbs.	197 lbs.
74″	148 lbs.	194 lbs.	197 lbs.	199 lbs.	202 lbs.
75″	152 lbs.	200 lbs.	202 lbs.	204 lbs.	208 lbs.
76″	156 lbs.	205 lbs.	207 lbs.	210 lbs.	213 lbs.
77″	160 lbs.	210 lbs.	213 lbs.	215 lbs.	219 lbs.
78″	164 lbs.	216 lbs.	218 lbs.	221 lbs.	225 lbs.
79″	168 lbs.	221 lbs.	224 lbs.	227 lbs.	230 lbs.
80″	173 lbs.	227 lbs.	230 lbs.	233 lbs.	236 lbs.'''


if __name__ == "__main__":
    createReadableCalculations(rawFemaleHeightWeight)