export const getBaseFontSize = (height: number): number => {
    return height * 0.025; // 2.5% of screen height
};

export const getTitleFontSize = (
    isMobile: boolean,
    baseFontSize: number
): number => {
    return isMobile ? baseFontSize + 10 : baseFontSize + 35;
};

export const getGameModeFontSize = (
    isMobile: boolean,
    baseFontSize: number
): number => {
    return isMobile ? baseFontSize + 5 : baseFontSize + 15;
};

export const getMatchedFontSize = (
    isMobile: boolean,
    baseFontSize: number
): number => {
    return isMobile ? baseFontSize + 5 : baseFontSize + 15;
};

export const getManinMenuButtonFontSize = (
    isMobile: boolean,
    baseFontSize: number
): number => {
    return isMobile ? baseFontSize + 5 : baseFontSize + 15;
};

export const getTimerFontSize = (
    isMobile: boolean,
    baseFontSize: number
): number => {
    return isMobile ? baseFontSize + 5 : baseFontSize + 15;
};

/////TOP / Y position
export function getTitleY(screenHeight: number, isMobile: boolean): number {
    const baseFontSize = getBaseFontSize(screenHeight);
    return isMobile
        ? baseFontSize * 1.5 // e.g. 2.5% * 1.5 = ~3.75%
        : baseFontSize * 2; // e.g. 2.5% * 2 = ~5%
}
export function getMatchedX(
    screenWidth: number,
    screenHeight: number,
    isMobile: boolean,
    player: 1 | 2
): number {
    const baseFontSize = getBaseFontSize(screenHeight);
    if (player === 1) {
        return isMobile ? baseFontSize * 3 : baseFontSize * 6;
    } else {
        return isMobile
            ? screenWidth - baseFontSize * 3
            : screenWidth - baseFontSize * 6;
    }
}
export function getMatchedY(screenHeight: number, isMobile: boolean): number {
    const baseFontSize = getBaseFontSize(screenHeight);
    return isMobile ? baseFontSize * 4.2 : baseFontSize * 4;
}
