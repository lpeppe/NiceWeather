export const getDaysString = (days: number[]): string => {
    let toReturn = "";
    for(let day of days)
        toReturn += `${day}|`;
    return toReturn.substring(0, toReturn.length - 1);    
}