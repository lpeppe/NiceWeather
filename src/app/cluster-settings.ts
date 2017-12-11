import * as L from 'leaflet';

export const invisibleIcon = L.icon({
    iconUrl: 'assets/images/sun.png',
    iconSize: L.point(0, 0)
})

export const visibleIcon = L.icon({
    iconUrl: 'assets/images/sun.png',
    iconSize: L.point(32, 32)
})

export const clusterOptions = {
    showCoverageOnHover: false,
    iconCreateFunction: (cluster) => {
        return cluster.getAllChildMarkers()
            .filter(x => { return x.options.icon.options.iconSize.x != 0 })
            .length > cluster.getAllChildMarkers().length / 2 ? visibleIcon : invisibleIcon
    },
    maxClusterRadius: (zoom) => { return 80 - 25 * (7 - zoom) }
}

export const computeGridSize = (zoomLevel) => {
    return 80 - 25 * (7 - zoomLevel)
}