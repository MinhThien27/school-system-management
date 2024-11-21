export const overrideFileName = (originalName: string, newName: string): string => {
    const fileExtension = originalName.split('.').pop();
    return `${newName}-${Date.now()}.${fileExtension}`;
};