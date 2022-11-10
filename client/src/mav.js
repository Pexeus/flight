const modes = {'MANUAL': 0, 'CIRCLE': 1, 'STABILIZE': 2, 'TRAINING': 3, 'ACRO': 4, 'FBWA': 5, 'FBWB': 6, 'CRUISE': 7, 'AUTOTUNE': 8, 'AUTO': 10, 'RTL': 11, 'LOITER': 12, 'TAKEOFF': 13, 'AVOID_ADSB': 14, 'GUIDED': 15, 'INITIALISING': 16, 'QSTABILIZE': 17, 'QHOVER': 18, 'QLOITER': 19, 'QLAND': 20, 'QRTL': 21, 'QAUTOTUNE': 22, 'QACRO': 23, 'THERMAL': 24, 'LOITERALTQLAND': 25}

export function getMode(identificator) {
    if (isNaN(identificator)) {
        return modes[identificator]
    }

    const i = Number(identificator)

    for (const m of Object.keys(modes)) {
        if (modes[m] == i) {
            return m
        }
    }
}