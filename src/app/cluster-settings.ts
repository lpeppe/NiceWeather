import { SelectedActivity } from './../models/enums';
import * as L from 'leaflet';
import '../assets/js/leaflet-beautify-marker-icon';

export const getActivityIconOptions = (activity: SelectedActivity, size?: number) => {
    let html;
    let icon;
    switch (activity) {
        case SelectedActivity.ski:
            html = "<img style='height: 20px; width: 20px; margin-right:-1px; margin-top:10px;'src='assets/icon/ski_white.png'>";
            break;
        case SelectedActivity.bike:
            icon = "bicycle"
            break;
        case SelectedActivity.sea:
            html = "<img style='height: 20px; width: 20px; margin-right:0px; margin-top:8px;'src='assets/icon/beach_white.png'>";
            break;
    }
    if (size != undefined)
        return {
            // spin: true,
            //html,
            iconShape: 'marker',
            iconSize: [33, 33],
            backgroundColor: '#488aff',
            borderColor: '#488aff',
            textColor: 'white',
            innerIconStyle: 'font-size:1.5em',
            isAlphaNumericIcon: true,
            text: size
        }
    return {
        // spin: true,
        html,
        icon,
        iconShape: 'marker',
        iconSize: [35, 35],
        backgroundColor: '#488aff',
        borderColor: '#488aff',
        textColor: 'white',
        innerIconStyle: 'font-size:1.5em',
        isAlphaNumericIcon: false,
        text: size
    }

}

const sunClustererOptions = {
    showCoverageOnHover: false,
    iconCreateFunction: (cluster) => {
        return cluster.getAllChildMarkers()
            .filter(x => { return x.options.icon.options.iconSize.x != 0 })
            .length > cluster.getChildCount() / 2 ? visibleIcon : invisibleIcon
    },
    maxClusterRadius: (zoom) => { return computeGridSize(zoom) },
    spiderLegPolylineOptions: {
        opacity: 0
    },
    disableClusteringAtZoom: 14
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
        case SelectedActivity.ski: case SelectedActivity.bike: case SelectedActivity.sea:
            return {
                showCoverageOnHover: false,
                iconCreateFunction: (cluster) =>
                    (<any>L).BeautifyIcon.icon(getActivityIconOptions(activity, cluster.getChildCount()))
            }
    }
}


export const computeGridSize = (zoomLevel) => {
    // (6,55) (7,80) (8,105)(9,130)(10,155)(11,180) couples used to calculate the interpolation

    // if(zoomLevel == 9)
    //     return 130
    // if(zoomLevel == 10)
    //     return 155
    // if(zoomLevel == 11)
    //     return 1
    // if(zoomLevel == 8)
    //     return 10
    // return 25 * zoomLevel - 95;
    // if(zoomLevel == 8)
    //     return 50
    switch (zoomLevel) {
        case 8:
            return 60;
        case 9:
            return 80;
        case 10:
            return 100;
        case 11:
            return 130;
        case 12:
            return 150;
        default:
            return 150;
    }
}