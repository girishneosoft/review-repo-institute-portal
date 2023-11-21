export const extractInitials = (name: string) => {
    // Split the name into words
    var words = name.split(' ');

    // If there's only one word, extract the first letter of that word
    // If there are multiple words, extract the first letter of the first and last words
    var initials = words.length === 1 ? words[0][0] : words[0][0] + words[words.length - 1][0];

    return initials;
}