import { SelectedActivity } from './../models/enums';
import * as L from 'leaflet';
import '../assets/js/leaflet-beautify-marker-icon';

export const getActivityIconOptions = (activity: SelectedActivity, size?: number) => {
    switch (activity) {
        case SelectedActivity.ski:
            return {
                // spin: true,
                icon: 'snowflake',
                iconShape: 'marker',
                iconSize: [33, 33],
                backgroundColor: '#488aff',
                borderColor: '#488aff',
                textColor: 'white',
                innerIconStyle:'font-size:1.5em',
                isAlphaNumericIcon: size != undefined,
                text: size
            }
    }
}

const sunClustererOptions = {
    showCoverageOnHover: false,
    iconCreateFunction: (cluster) => {
        return cluster.getAllChildMarkers()
            .filter(x => { return x.options.icon.options.iconSize.x != 0 })
            .length > cluster.getChildCount() / 2 ? visibleIcon : invisibleIcon
    },
    maxClusterRadius: (zoom) => { return computeGridSize(zoom) }
}

export const invisibleIcon: L.Icon = L.icon({
    iconUrl: 'assets/images/sun.png',
    iconSize: L.point(0, 0)
})

export const visibleIcon: L.Icon = L.icon({
    iconUrl: 'assets/images/sun.png',
    iconSize: L.point(32, 32)
})

export const getClusterOptions = (activity: SelectedActivity) => {
    switch (activity) {
        case SelectedActivity.sun:
            return sunClustererOptions;
        case SelectedActivity.ski:
            return {
                showCoverageOnHover: false,
                iconCreateFunction: (cluster) =>
                    (<any>L).BeautifyIcon.icon(getActivityIconOptions(activity, cluster.getChildCount()))
            }
    }
}


export const computeGridSize = (zoomLevel) => {
    return 80 - 25 * (7 - zoomLevel)
}