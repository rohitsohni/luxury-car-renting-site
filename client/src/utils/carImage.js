import { assets } from "../assets/assets";

export const fallbackCarImage = (car = {}) => {
    const brand = car.brand?.toLowerCase() || "";
    const category = car.category?.toLowerCase() || "";

    if (brand.includes("toyota") || category.includes("sedan")) return assets.car_image1;
    if (brand.includes("bmw") || category.includes("suv")) return assets.car_image2;
    if (brand.includes("mercedes")) return assets.car_image3;

    return assets.car_image4;
};

export const handleCarImageError = (event, car) => {
    const fallback = fallbackCarImage(car);

    if (event.currentTarget.src !== fallback) {
        event.currentTarget.src = fallback;
    }
};
