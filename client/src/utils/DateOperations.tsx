export const determineDay = async (date: Date) => {
    const today = new Date();

    const dateToCompare = new Date(date);
    dateToCompare.setHours(0, 0, 0, 0);

    today.setHours(0, 0, 0, 0);

    const differenceinMS = today.getTime() - dateToCompare.getTime();
    const oneDayinMS = 24 * 60 * 60 * 1000;

    if (differenceinMS < oneDayinMS && differenceinMS >= 0) {
        return 'today';
    } else if (differenceinMS < 0 && differenceinMS >= -oneDayinMS) {
        return 'yesterday';
    } else {
        return 'other';
    }
}
