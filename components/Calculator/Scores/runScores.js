const runScores = [[100,13.3667,15.4834,13.45,15,13.5167,15,13.7,15.3,13.9667,15.5,14.0834,15.8167,14.5,15.9667,15.15,16.4834,15.4667,17.3,15.4667,17.3,100],
[99,13.7,15.9167,13.8334,15.5,13.9667,15.5,14.1,15.7667,14.3334,15.9334,14.4834,16.2,14.9,16.2334,15.5667,17.0167,15.9167,17.7834,15.9167,17.7834,99],
[98,14,16.2667,14.1334,15.85,14.25,15.8834,14.4167,16.1167,14.6167,16.3,14.8,16.5834,15.2334,16.6,15.9167,17.3667,16.3667,17.9334,16.3667,17.9334,98],
[97,14.25,16.5667,14.4167,16.15,14.5167,16.1667,14.6667,16.4667,14.8834,16.6,15.0667,16.8334,15.5334,16.9334,16.2334,17.6334,16.7334,18,16.7334,18,97],
[96,14.4667,16.8,14.6334,16.4334,14.75,16.4334,14.9,16.7167,15.1,16.85,15.3334,17.1167,15.8,17.25,16.4667,17.8334,16.9667,18.4167,16.9667,18.4167,96],
[95,14.6667,17.0167,14.8334,16.65,14.95,16.6667,15.1,16.95,15.3167,17.0667,15.55,17.4,16.0334,17.4667,16.7,18,17.2334,18.5167,17.2334,18.5167,95],
[94,14.85,17.2334,15.0167,16.8667,15.1167,16.9,15.3,17.1334,15.5,17.3,15.75,17.5834,16.25,17.65,16.9167,18.2167,17.45,18.6,17.45,18.6,94],
[93,15,17.45,15.2167,17.0667,15.3167,17.0834,15.5,17.3334,15.6834,17.5,15.9334,17.7834,16.45,17.8834,17.1,18.3334,17.75,18.7667,17.75,18.7667,93],
[92,15.1834,17.6167,15.3834,17.2667,15.5,17.2834,15.65,17.5,15.85,17.6834,16.1,17.9334,16.6,18,17.2667,18.5,17.95,18.8,17.95,18.8,92],
[91,15.3334,17.7834,15.5334,17.4667,15.65,17.45,15.8167,17.6834,16,17.8667,16.3,18.1,16.7667,18.2,17.4334,18.6667,18.1167,18.9334,18.1167,18.9334,91],
[90,15.5,17.9334,15.7167,17.6167,15.8,17.5834,15.9667,17.8334,16.1667,18,16.4667,18.2667,16.95,18.4,17.6,18.8834,18.2834,18.9834,18.2834,18.9834,90],
[89,15.65,18.0667,15.8834,17.7834,15.9667,17.7667,16.1167,18,16.3334,18.1667,16.6334,18.4334,17.1167,18.5667,17.8,19.0334,18.4167,19.0667,18.4167,19.0667,89],
[88,15.8,18.2167,16.0167,17.95,16.0834,17.9167,16.2667,18.15,16.5,18.3334,16.7834,18.5834,17.2667,18.7334,17.95,19.2334,18.6,19.2334,18.6,19.2334,88],
[87,15.95,18.3667,16.1667,18.0667,16.25,18.0334,16.4167,18.3,16.6334,18.5,16.9167,18.7334,17.4334,18.9167,18.0667,19.4834,18.75,19.4834,18.75,19.4834,87],
[86,16.0834,18.5,16.3334,18.2167,16.4,18.2,16.5334,18.45,16.7667,18.6,17.0667,18.8834,17.5667,19.0667,18.25,19.6,18.8834,19.6834,18.8834,19.6834,86],
[85,16.2334,18.65,16.4834,18.3834,16.5334,18.35,16.6834,18.6,16.9167,18.75,17.2,19.0167,17.7167,19.2167,18.4,19.75,19,19.75,19,19.75,85],
[84,16.3667,18.7667,16.6167,18.5,16.6834,18.5,16.8167,18.75,17.05,18.8667,17.35,19.1667,17.85,19.3667,18.5334,19.9667,19.1167,19.9667,19.1167,19.9667,84],
[83,16.5,18.9,16.7667,18.65,16.8167,18.6167,16.9667,18.8667,17.2167,19,17.5,19.3167,18,19.5,18.6667,20.0334,19.2834,20.0334,19.2834,20.0334,83],
[82,16.65,19,16.9167,18.8,16.9667,18.7667,17.0834,19,17.35,19.0834,17.6334,19.45,18.1,19.6667,18.8167,20.1167,19.45,20.1167,19.45,20.1167,82],
[81,16.8,19.15,17.0667,18.9334,17.0834,18.9,17.25,19.1167,17.5,19.2334,17.7834,19.6,18.2667,19.75,18.9334,20.2834,19.6,20.2834,19.6,20.2834,81],
[80,16.95,19.2834,17.2167,19.05,17.2334,19,17.3834,19.25,17.6334,19.3667,17.9167,19.75,18.4334,19.8667,19.05,20.3667,19.75,20.3667,19.75,20.3667,80],
[79,17.0834,19.4,17.3667,19.2,17.3834,19.1334,17.5167,19.3834,17.75,19.5,18,19.85,18.55,19.9834,19.2167,20.5167,19.85,20.5167,19.85,20.5167,79],
[78,17.25,19.5334,17.5,19.35,17.5167,19.2667,17.6667,19.5167,17.9,19.6167,18.1667,19.9667,18.7,20.1,19.35,20.6334,19.9834,20.6334,19.9834,20.6334,78],
[77,17.4,19.6667,17.6667,19.5,17.6834,19.4167,17.8,19.6667,18,19.8,18.3334,20.0334,18.85,20.2334,19.5,20.7167,20.1167,20.7167,20.1167,20.7167,77],
[76,17.55,19.8,17.8167,19.65,17.8334,19.55,17.9334,19.7834,18.1667,19.9334,18.4834,20.2,19,20.3334,19.6,20.7334,20.2334,20.7334,20.2334,20.7334,76],
[75,17.7167,19.9334,17.9834,19.7834,17.9667,19.7,18.05,19.9167,18.3,20.0334,18.6167,20.35,19.1167,20.4834,19.75,20.7334,20.3667,20.7334,20.3667,20.7334,75],
[74,17.8667,20.05,18.1167,19.9334,18.0834,19.8334,18.2,20.0167,18.4667,20.2,18.7667,20.5334,19.2834,20.6,19.8834,20.8334,20.5167,20.8334,20.5167,20.8334,74],
[73,18.0167,20.2,18.2834,20.0667,18.25,19.9834,18.3834,20.1667,18.6167,20.3334,18.9334,20.6334,19.45,20.7167,20,21.05,20.6834,21.05,20.6834,21.05,73],
[72,18.2,20.35,18.4667,20.2334,18.4167,20.1167,18.55,20.3,18.7834,20.5,19.0667,20.7834,19.6,20.7334,20.1334,21.25,20.7667,21.25,20.7667,21.25,72],
[71,18.3834,20.5,18.6334,20.3834,18.5834,20.2667,18.7167,20.45,18.95,20.6334,19.2667,20.95,19.7834,20.8667,20.3,21.5334,20.9,21.5334,20.9,21.5334,71],
[70,18.5834,20.6667,18.8334,20.5334,18.7667,20.4167,18.8834,20.5834,19.1,20.7667,19.4334,21,19.95,21.15,20.45,21.6667,21,21.6667,21,21.6667,70],
[69,18.7834,20.8167,19,20.7167,18.9667,20.6,19.05,20.7334,19.3167,20.9167,19.6334,21.1334,20.1,21.4,20.65,21.7167,21.0167,21.7167,21.0167,21.7167,69],
[68,19,20.9667,19.2167,20.8834,19.15,20.75,19.2667,20.9,19.5,21,19.8334,21.3334,20.2834,21.6,20.8167,21.9834,21.3167,21.9834,21.3167,22.0334,68],
[67,19.2,21.05,19.4334,21,19.3667,20.9334,19.4667,21,19.7,21.0667,20,21.5834,20.4667,21.8167,20.9834,22.15,21.5834,22.15,21.5834,22.25,67],
[66,19.45,21.3334,19.6667,21.1,19.6,21,19.6834,21.0834,19.9167,21.3334,20.1667,21.85,20.6667,22.0167,21,22.3834,21.7834,22.3834,21.7834,22.5167,66],
[65,19.7167,21.6167,19.9334,21.4,19.85,21.25,19.9334,21.45,20.1167,21.6,20.4167,22.0834,20.8834,22.2167,21.2667,22.55,22.05,22.55,22.05,22.7334,65],
[64,20,21.9,20.2,21.7334,20.1,21.5667,20.1834,21.8,20.3667,21.9334,20.6667,22.3334,21,22.4667,21.65,22.7167,22.35,22.7167,22.35,22.8334,64],
[63,20.3167,22.1834,20.5,22.05,20.4167,21.9334,20.4834,22.1,20.6834,22.1834,20.9667,22.6,21.2167,22.5834,22,22.8667,22.65,23.0167,22.65,23.0667,63],
[62,20.7,22.5834,20.8667,22.4,20.7667,22.3,20.8167,22.5,21,22.5667,21,22.8834,21.7167,22.8334,22.4,23.0667,22.9667,23.3667,22.9667,23.3667,62],
[61,21.05,22.9667,21.2334,22.8334,21,22.7667,21.0167,22.9167,21.2834,23,21.7334,23.1667,22.2834,23.4167,22.8834,23.7334,23.2,24.0834,23.2,24.1834,61],
[60,22,23.3667,22,23.25,22,23.2167,22,23.3167,22.1834,23.3834,22.5334,23.7,22.9167,24,23.3334,24.4,23.6,24.8,23.6,25,60],
[59,22.0167,23.3834,22.0167,23.2667,22.0167,23.2334,22.0167,23.3334,22.2,23.4,22.55,23.7167,22.9334,24.0167,23.35,24.4167,23.6167,24.8167,23.6167,25.0167,59],
[58,22.05,23.4167,22.05,23.3,22.05,23.2667,22.05,23.3667,22.2334,23.4334,22.5834,23.75,22.9667,24.05,23.3834,24.45,23.65,24.85,23.65,25.05,58],
[57,22.0834,23.45,22.0834,23.3334,22.0834,23.3,22.0834,23.4,22.2667,23.4667,22.6167,23.7834,23,24.0834,23.4167,24.4834,23.6834,24.8834,23.6834,25.0834,57],
[56,22.1167,23.4834,22.1167,23.3667,22.1167,23.3334,22.1167,23.4334,22.3,23.5,22.65,23.8167,23.0334,24.1167,23.45,24.5167,23.7167,24.9167,23.7167,25.1167,56],
[55,22.15,23.5167,22.15,23.4,22.15,23.3667,22.15,23.4667,22.3334,23.5334,22.6834,23.85,23.0667,24.15,23.4834,24.55,23.75,24.95,23.75,25.15,55],
[54,22.1834,23.55,22.1834,23.4334,22.1834,23.4,22.1834,23.5,22.3667,23.5667,22.7167,23.8834,23.1,24.1834,23.5167,24.5834,23.7834,24.9834,23.7834,25.1834,54],
[53,22.2167,23.5834,22.2167,23.4667,22.2167,23.4334,22.2167,23.5334,22.4,23.6,22.75,23.9167,23.1334,24.2167,23.55,24.6167,23.8167,25.0167,23.8167,25.2167,53],
[52,22.25,23.6167,22.25,23.5,22.25,23.4667,22.25,23.5667,22.4334,23.6334,22.7834,23.95,23.1667,24.25,23.5834,24.65,23.85,25.05,23.85,25.25,52],
[51,22.2834,23.65,22.2834,23.5334,22.2834,23.5,22.2834,23.6,22.4667,23.6667,22.8167,23.9834,23.2,24.2834,23.6167,24.6834,23.8834,25.0834,23.8834,25.2834,51],
[50,22.3167,23.6834,22.3167,23.5667,22.3167,23.5334,22.3167,23.6334,22.5,23.7,22.85,24.0167,23.2334,24.3167,23.65,24.7167,23.9167,25.1167,23.9167,25.3167,50],
[49,22.35,23.7167,22.35,23.6,22.35,23.5667,22.35,23.6667,22.5334,23.7334,22.8834,24.05,23.2667,24.35,23.6834,24.75,23.95,25.15,23.95,25.35,49],
[48,22.3834,23.75,22.3834,23.6334,22.3834,23.6,22.3834,23.7,22.5667,23.7667,22.9167,24.0834,23.3,24.3834,23.7167,24.7834,23.9834,25.1834,23.9834,25.3834,48],
[47,22.4167,23.7834,22.4167,23.6667,22.4167,23.6334,22.4167,23.7334,22.6,23.8,22.95,24.1167,23.3334,24.4167,23.75,24.8167,24.0167,25.2167,24.0167,25.4167,47],
[46,22.45,23.8167,22.45,23.7,22.45,23.6667,22.45,23.7667,22.6334,23.8334,22.9834,24.15,23.3667,24.45,23.7834,24.85,24.05,25.25,24.05,25.45,46],
[45,22.4834,23.85,22.4834,23.7334,22.4834,23.7,22.4834,23.8,22.6667,23.8667,23.0167,24.1834,23.4,24.4834,23.8167,24.8834,24.0834,25.2834,24.0834,25.4834,45],
[44,22.5167,23.8834,22.5167,23.7667,22.5167,23.7334,22.5167,23.8334,22.7,23.9,23.05,24.2167,23.4334,24.5167,23.85,24.9167,24.1167,25.3167,24.1167,25.5167,44],
[43,22.55,23.9167,22.55,23.8,22.55,23.7667,22.55,23.8667,22.7334,23.9334,23.0834,24.25,23.4667,24.55,23.8834,24.95,24.15,25.35,24.15,25.55,43],
[42,22.5834,23.95,22.5834,23.8334,22.5834,23.8,22.5834,23.9,22.7667,23.9667,23.1167,24.2834,23.5,24.5834,23.9167,24.9834,24.1834,25.3834,24.1834,25.5834,42],
[41,22.6167,23.9834,22.6167,23.8667,22.6167,23.8334,22.6167,23.9334,22.8,24,23.15,24.3167,23.5334,24.6167,23.95,25.0167,24.2167,25.4167,24.2167,25.6167,41],
[40,22.65,24.0167,22.65,23.9,22.65,23.8667,22.65,23.9667,22.8334,24.0334,23.1834,24.35,23.5667,24.65,23.9834,25.05,24.25,25.45,24.25,25.65,40],
[39,22.6834,24.05,22.6834,23.9334,22.6834,23.9,22.6834,24,22.8667,24.0667,23.2167,24.3834,23.6,24.6834,24.0167,25.0834,24.2834,25.4834,24.2834,25.6834,39],
[38,22.7167,24.0834,22.7167,23.9667,22.7167,23.9334,22.7167,24.0334,22.9,24.1,23.25,24.4167,23.6334,24.7167,24.05,25.1167,24.3167,25.5167,24.3167,25.7167,38],
[37,22.75,24.1167,22.75,24,22.75,23.9667,22.75,24.0667,22.9334,24.1334,23.2834,24.45,23.6667,24.75,24.0834,25.15,24.35,25.55,24.35,25.75,37],
[36,22.7834,24.15,22.7834,24.0334,22.7834,24,22.7834,24.1,22.9667,24.1667,23.3167,24.4834,23.7,24.7834,24.1167,25.1834,24.3834,25.5834,24.3834,25.7834,36],
[35,22.8167,24.1834,22.8167,24.0667,22.8167,24.0334,22.8167,24.1334,23,24.2,23.35,24.5167,23.7334,24.8167,24.15,25.2167,24.4167,25.6167,24.4167,25.8167,35],
[34,22.85,24.2167,22.85,24.1,22.85,24.0667,22.85,24.1667,23.0334,24.2334,23.3834,24.55,23.7667,24.85,24.1834,25.25,24.45,25.65,24.45,25.85,34],
[33,22.8834,24.25,22.8834,24.1334,22.8834,24.1,22.8834,24.2,23.0667,24.2667,23.4167,24.5834,23.8,24.8834,24.2167,25.2834,24.4834,25.6834,24.4834,25.8834,33],
[32,22.9167,24.2834,22.9167,24.1667,22.9167,24.1334,22.9167,24.2334,23.1,24.3,23.45,24.6167,23.8334,24.9167,24.25,25.3167,24.5167,25.7167,24.5167,25.9167,32],
[31,22.95,24.3167,22.95,24.2,22.95,24.1667,22.95,24.2667,23.1334,24.3334,23.4834,24.65,23.8667,24.95,24.2834,25.35,24.55,25.75,24.55,25.95,31],
[30,22.9834,24.35,22.9834,24.2334,22.9834,24.2,22.9834,24.3,23.1667,24.3667,23.5167,24.6834,23.9,24.9834,24.3167,25.3834,24.5834,25.7834,24.5834,25.9834,30],
[29,23.0334,24.4,23.0334,24.2834,23.0334,24.25,23.0334,24.35,23.2167,24.4167,23.5667,24.7334,23.95,25.0334,24.3667,25.4334,24.6334,25.8334,24.6334,26.0334,29],
[28,23.0667,24.4334,23.0667,24.3167,23.0667,24.2834,23.0667,24.3834,23.25,24.45,23.6,24.7667,23.9834,25.0667,24.4,25.4667,24.6667,25.8667,24.6667,26.0667,28],
[27,23.1,24.4667,23.1,24.35,23.1,24.3167,23.1,24.4167,23.2834,24.4834,23.6334,24.8,24.0167,25.1,24.4334,25.5,24.7,25.9,24.7,26.1,27],
[26,23.1334,24.5,23.1334,24.3834,23.1334,24.35,23.1334,24.45,23.3167,24.5167,23.6667,24.8334,24.05,25.1334,24.4667,25.5334,24.7334,25.9334,24.7334,26.1334,26],
[25,23.1667,24.5334,23.1667,24.4167,23.1667,24.3834,23.1667,24.4834,23.35,24.55,23.7,24.8667,24.0834,25.1667,24.5,25.5667,24.7667,25.9667,24.7667,26.1667,25],
[24,23.2,24.5667,23.2,24.45,23.2,24.4167,23.2,24.5167,23.3834,24.5834,23.7334,24.9,24.1167,25.2,24.5334,25.6,24.8,26,24.8,26.2,24],
[23,23.2334,24.6,23.2334,24.4834,23.2334,24.45,23.2334,24.55,23.4167,24.6167,23.7667,24.9334,24.15,25.2334,24.5667,25.6334,24.8334,26.0334,24.8334,26.2334,23],
[22,23.2667,24.6334,23.2667,24.5167,23.2667,24.4834,23.2667,24.5834,23.45,24.65,23.8,24.9667,24.1834,25.2667,24.6,25.6667,24.8667,26.0667,24.8667,26.2667,22],
[21,23.3,24.6667,23.3,24.55,23.3,24.5167,23.3,24.6167,23.4834,24.6834,23.8334,25,24.2167,25.3,24.6334,25.7,24.9,26.1,24.9,26.3,21],
[20,23.3334,24.7,23.3334,24.5834,23.3334,24.55,23.3334,24.65,23.5167,24.7167,23.8667,25.0334,24.25,25.3334,24.6667,25.7334,24.9334,26.1334,24.9334,26.3334,20],
[19,23.3667,24.7334,23.3667,24.6167,23.3667,24.5834,23.3667,24.6834,23.55,24.75,23.9,25.0667,24.2834,25.3667,24.7,25.7667,24.9667,26.1667,24.9667,26.3667,19],
[18,23.4,24.7667,23.4,24.65,23.4,24.6167,23.4,24.7167,23.5834,24.7834,23.9334,25.1,24.3167,25.4,24.7334,25.8,25,26.2,25,26.4,18],
[17,23.4334,24.8,23.4334,24.6834,23.4334,24.65,23.4334,24.75,23.6167,24.8167,23.9667,25.1334,24.35,25.4334,24.7667,25.8334,25.0334,26.2334,25.0334,26.4334,17],
[16,23.4667,24.8334,23.4667,24.7167,23.4667,24.6834,23.4667,24.7834,23.65,24.85,24,25.1667,24.3834,25.4667,24.8,25.8667,25.0667,26.2667,25.0667,26.4667,16],
[15,23.5,24.8667,23.5,24.75,23.5,24.7167,23.5,24.8167,23.6834,24.8834,24.0334,25.2,24.4167,25.5,24.8334,25.9,25.1,26.3,25.1,26.5,15],
[14,23.5334,24.9,23.5334,24.7834,23.5334,24.75,23.5334,24.85,23.7167,24.9167,24.0667,25.2334,24.45,25.5334,24.8667,25.9334,25.1334,26.3334,25.1334,26.5334,14],
[13,23.5667,24.9334,23.5667,24.8167,23.5667,24.7834,23.5667,24.8834,23.75,24.95,24.1,25.2667,24.4834,25.5667,24.9,25.9667,25.1667,26.3667,25.1667,26.5667,13],
[12,23.6,24.9667,23.6,24.85,23.6,24.8167,23.6,24.9167,23.7834,24.9834,24.1334,25.3,24.5167,25.6,24.9334,26,25.2,26.4,25.2,26.6,12],
[11,23.6334,25,23.6334,24.8834,23.6334,24.85,23.6334,24.95,23.8167,25.0167,24.1667,25.3334,24.55,25.6334,24.9667,26.0334,25.2334,26.4334,25.2334,26.6334,11],
[10,23.6667,25.0334,23.6667,24.9167,23.6667,24.8834,23.6667,24.9834,23.85,25.05,24.2,25.3667,24.5834,25.6667,25,26.0667,25.2667,26.4667,25.2667,26.6667,10],
[9,23.7,25.0667,23.7,24.95,23.7,24.9167,23.7,25.0167,23.8834,25.0834,24.2334,25.4,24.6167,25.7,25.0334,26.1,25.3,26.5,25.3,26.7,9],
[8,23.7334,25.1,23.7334,24.9834,23.7334,24.95,23.7334,25.05,23.9167,25.1167,24.2667,25.4334,24.65,25.7334,25.0667,26.1334,25.3334,26.5334,25.3334,26.7334,8],
[7,23.7667,25.1334,23.7667,25.0167,23.7667,24.9834,23.7667,25.0834,23.95,25.15,24.3,25.4667,24.6834,25.7667,25.1,26.1667,25.3667,26.5667,25.3667,26.7667,7],
[6,23.8,25.1667,23.8,25.05,23.8,25.0167,23.8,25.1167,23.9834,25.1834,24.3334,25.5,24.7167,25.8,25.1334,26.2,25.4,26.6,25.4,26.8,6],
[5,23.8334,25.2,23.8334,25.0834,23.8334,25.05,23.8334,25.15,24.0167,25.2167,24.3667,25.5334,24.75,25.8334,25.1667,26.2334,25.4334,26.6334,25.4334,26.8334,5],
[4,23.8667,25.2334,23.8667,25.1167,23.8667,25.0834,23.8667,25.1834,24.05,25.25,24.4,25.5667,24.7834,25.8667,25.2,26.2667,25.4667,26.6667,25.4667,26.8667,4],
[3,23.9,25.2667,23.9,25.15,23.9,25.1167,23.9,25.2167,24.0834,25.2834,24.4334,25.6,24.8167,25.9,25.2334,26.3,25.5,26.7,25.5,26.9,3],
[2,23.9334,25.3,23.9334,25.1834,23.9334,25.15,23.9334,25.25,24.1167,25.3167,24.4667,25.6334,24.85,25.9334,25.2667,26.3334,25.5334,26.7334,25.5334,26.9334,2],
[1,23.9667,25.3334,23.9667,25.2167,23.9667,25.1834,23.9667,25.2834,24.15,25.35,24.5,25.6667,24.8834,25.9667,25.3,26.3667,25.5667,26.7667,25.5667,26.9667,1],
[0,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,99,0]]

export default runScores;