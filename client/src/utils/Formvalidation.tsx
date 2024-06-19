export const emailValidity = async (email: string): Promise<boolean> => {
    // Regular expression for basic email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Test the email against the regex pattern
    return regex.test(email);
};
