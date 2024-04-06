module.exports = {
    content: ['./src/**/*.tsx', './docs/**/*.mdx','./theme/**/*.tsx'],
    theme: {
        spacing: Array.from({ length: 1920 }).reduce((map, _, index) => {
            map[index] = `${index}px`;
            return map;
        }, {}),
        extend: {
            fontSize: ({ theme }) => ({
                ...theme("spacing"),
            }),
        },
    },
    plugins: [],
};