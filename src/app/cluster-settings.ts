export const clusterStyle = [
    {
        url: 'assets/images/sun.png',
        height: 0,
        width: 0,

    },
    {
        url: 'assets/images/sun.png',
        height: 32,
        width: 32
    }
];

export const customCalculator = (markers) => {
    return {
        text: '',
        index: markers.filter(x => { return !x.visible }).length > markers.length / 2 ? 1 : 2
    }
};

export const computeGridSize = (zoomLevel) => {
    let offset = Math.round(zoomLevel) - 12;
    if(zoomLevel <= 9) {
        return 150 + offset * 20;
    }
    else
        return 150 - offset * 20;
}