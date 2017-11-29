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
    let invisibleMarkers = 0;
    for (let marker of markers)
        if (!marker.visible)
            invisibleMarkers++;
    return {
        text: '',
        index: invisibleMarkers > markers.length / 2 ? 1 : 2
    }
};