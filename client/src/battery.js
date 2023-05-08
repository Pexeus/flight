export function getCapacity(cellNum, voltage) {
    if (cellNum === 2) {
        if (voltage >= 8.4) {
            return 100;
        } else if (voltage >= 8.3) {
            return 95;
        } else if (voltage >= 8.22) {
            return 90;
        } else if (voltage >= 8.16) {
            return 85;
        } else if (voltage >= 8.05) {
            return 80;
        } else if (voltage >= 7.97) {
            return 75;
        } else if (voltage >= 7.91) {
            return 70;
        } else if (voltage >= 7.83) {
            return 65;
        } else if (voltage >= 7.75) {
            return 60;
        } else if (voltage >= 7.71) {
            return 55;
        } else if (voltage >= 7.67) {
            return 50;
        } else if (voltage >= 7.63) {
            return 45;
        } else if (voltage >= 7.59) {
            return 40;
        } else if (voltage >= 7.57) {
            return 35;
        } else if (voltage >= 7.53) {
            return 30;
        } else if (voltage >= 7.49) {
            return 25;
        } else if (voltage >= 7.45) {
            return 20;
        } else if (voltage >= 7.41) {
            return 15;
        } else if (voltage >= 7.37) {
            return 10;
        } else if (voltage >= 7.22) {
            return 5;
        } else {
            return 0;
        }
    } else {
        return "?";
    }
}