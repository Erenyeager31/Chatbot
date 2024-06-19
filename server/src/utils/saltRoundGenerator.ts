export const saltRoundGen = (username:string) => {
    const len1 = username.length
    const randomNumber = Math.floor(Math.random()*(50-10)+10)
    return Math.floor(randomNumber/len1)
};
