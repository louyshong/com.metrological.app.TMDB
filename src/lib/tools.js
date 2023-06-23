export const getImgUrl = (imgPath, width = 185)=> {
    switch (width) {
        case 1280: 
            return "images/background1280.pvr"
        case 500:
            return "images/poster500.pvr"
        case 300:
            return "images/poster300.pvr"
    }
    // return `//image.tmdb.org/t/p/w${width}${imgPath}`
};