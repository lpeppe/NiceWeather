export interface LatLng {
    lat: number,
    lng: number
}

export interface BikeDetails {
    drop: string,
    length: string,
    name: string,
    slope: string,
    surface: string,
    type: string,
    avgRating: number
}

export interface SkiDetails {
    img: string,
    name: string,
    phone: string,
    numPiste: number,
    pisteLength: string,
    height: string,
    blackPiste: string,
    bluePiste: string,
    redPiste: string,
    greenPiste: string,
    avgRating: number
  }

  export interface Review {
      name: string,
      surname: string,
      pic: string,
      rating: number
  }